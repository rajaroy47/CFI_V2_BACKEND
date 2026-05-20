const crypto      = require("crypto");
const jwt         = require("jsonwebtoken");
const UAParser    = require("ua-parser-js");   // npm i ua-parser-js
const geoip       = require("geoip-lite");      // npm i geoip-lite

const Session = require("../models/session.model.js");
const User    = require("../models/user.model.js");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken.js");

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Generate a unique sessionId */
const generateSessionId = () => crypto.randomBytes(32).toString("hex");

/** 7 days from now */
const sessionExpiry = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const COOKIE_OPTIONS = {
    httpOnly : true,
    secure   : process.env.NODE_ENV === "production",
    sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge   : 7 * 24 * 60 * 60 * 1000,
};

/**
 * Parse device / browser / OS info from the User-Agent header.
 * Falls back gracefully if ua-parser-js is not installed.
 */
const parseUserAgent = (uaString = "") => {
    try {
        const parser = new UAParser(uaString);
        const result = parser.getResult();

        const deviceTypeRaw = (result.device?.type || "").toLowerCase();
        const deviceTypeMap = {
            mobile  : "mobile",
            tablet  : "tablet",
            console : "desktop",
            smarttv : "desktop",
        };
        const deviceType = deviceTypeMap[deviceTypeRaw] || "desktop";

        return {
            deviceName      : result.device?.model  || "Unknown Device",
            deviceType,
            browser         : result.browser?.name  || "Unknown Browser",
            operatingSystem : result.os?.name        || "Unknown OS",
        };
    } catch {
        return {
            deviceName      : "Unknown Device",
            deviceType      : "unknown",
            browser         : "Unknown Browser",
            operatingSystem : "Unknown OS",
        };
    }
};

/**
 * Parse geo-location from an IP address.
 * Falls back gracefully if geoip-lite lookup fails.
 */
const parseLocation = (ip = "") => {
    try {
        // Strip IPv6-mapped IPv4 prefix (e.g. "::ffff:192.168.1.1")
        const cleanIp = ip.replace(/^::ffff:/, "");
        const geo     = geoip.lookup(cleanIp);
        return {
            country  : geo?.country  || "Unknown",
            state    : geo?.region   || "Unknown",
            city     : geo?.city     || "Unknown",
            timezone : geo?.timezone || "Unknown",
        };
    } catch {
        return { country: "Unknown", state: "Unknown", city: "Unknown", timezone: "Unknown" };
    }
};

/** Get real client IP even behind a proxy */
const getClientIp = (req) =>
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "0.0.0.0";

/**
 * Detect suspicious activity by comparing the new session's
 * fingerprint against the user's most-recent active session.
 */
const detectSuspiciousActivity = async (userId, newSessionData) => {
    const lastSession = await Session.findOne({
        userId,
        isActive  : true,
        isRevoked : false,
    }).sort({ createdAt: -1 });

    if (!lastSession) return { isSuspicious: false, reason: null };

    const countryChanged = lastSession.location?.country &&
        lastSession.location.country !== newSessionData.location.country &&
        lastSession.location.country !== "Unknown";

    if (countryChanged) {
        return {
            isSuspicious : true,
            reason       : `Login from new country: ${newSessionData.location.country} (previous: ${lastSession.location.country})`,
        };
    }

    return { isSuspicious: false, reason: null };
};


// ─── CREATE SESSION (called internally after login) ──────────────────────────

/**
 * Creates a new Session document and returns tokens.
 * Call this from your loginUser controller instead of storing
 * the refreshToken directly on the User model.
 *
 * @param {Object} user       - Mongoose user document
 * @param {Object} req        - Express request (for UA / IP)
 * @param {String} loginMethod - "email-password" | "google" | "otp" | "admin-login"
 * @returns {{ accessToken, refreshToken, sessionId }}
 */
const createSession = async (user, req, loginMethod = "email-password") => {
    const uaString  = req.headers["user-agent"] || "";
    const ipAddress = getClientIp(req);
    const deviceInfo = parseUserAgent(uaString);
    const location   = parseLocation(ipAddress);

    const { isSuspicious, reason: suspiciousReason } =
        await detectSuspiciousActivity(user._id, { location });

    const sessionId    = generateSessionId();
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await Session.create({
        userId          : user._id,
        refreshToken,
        accessToken,
        sessionId,
        deviceId        : req.headers["x-device-id"] || null,
        deviceName      : deviceInfo.deviceName,
        deviceType      : deviceInfo.deviceType,
        browser         : deviceInfo.browser,
        operatingSystem : deviceInfo.operatingSystem,
        ipAddress,
        location,
        loginMethod,
        expiresAt       : sessionExpiry(),
        isActive        : true,
        isRevoked       : false,
        isSuspicious,
        suspiciousReason: suspiciousReason || undefined,
        userAgent       : uaString,
        createdBy       : user._id,
        metadata        : {
            registeredVia : req.headers.origin || "unknown",
        },
    });

    return { accessToken, refreshToken, sessionId };
};


// ─── GET ALL SESSIONS (for the logged-in user) ───────────────────────────────

/**
 * GET /sessions
 * Returns all sessions for the authenticated user.
 * Query params: ?active=true|false  ?page=1  ?limit=10
 */
const getMySessions = async (req, res) => {
    try {
        const { active, page = 1, limit = 10 } = req.query;

        const filter = { userId: req.user._id };

        if (active === "true")  filter.isActive = true;
        if (active === "false") filter.isActive = false;

        const skip  = (Number(page) - 1) * Number(limit);
        const total = await Session.countDocuments(filter);

        const sessions = await Session.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select("-refreshToken -accessToken"); // never expose tokens

        // Mark which one is the current session
        const currentToken = req.cookies?.refreshToken;
        const enriched = sessions.map((s) => {
            const obj = s.toObject();
            obj.isCurrent = currentToken
                ? s.refreshToken === currentToken   // already excluded but for internal check
                : s.sessionId === req.headers["x-session-id"];
            return obj;
        });

        return res.status(200).json({
            success    : true,
            total,
            page       : Number(page),
            totalPages : Math.ceil(total / Number(limit)),
            sessions   : enriched,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── GET SINGLE SESSION ───────────────────────────────────────────────────────

/**
 * GET /sessions/:sessionId
 * Returns a specific session — only if it belongs to the user.
 */
const getSessionById = async (req, res) => {
    try {
        const session = await Session.findOne({
            sessionId : req.params.sessionId,
            userId    : req.user._id,
        }).select("-refreshToken -accessToken");

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        return res.status(200).json({ success: true, session });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── REVOKE SESSION (logout a specific device) ───────────────────────────────

/**
 * PATCH /sessions/:sessionId/revoke
 * Lets a user remotely log out any of their other sessions.
 */
const revokeSession = async (req, res) => {
    try {
        const { reason } = req.body;

        const session = await Session.findOne({
            sessionId : req.params.sessionId,
            userId    : req.user._id,
        });

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        if (session.isRevoked) {
            return res.status(400).json({ success: false, message: "Session is already revoked" });
        }

        session.isActive     = false;
        session.isRevoked    = true;
        session.revokedAt    = new Date();
        session.revokeReason = reason || "Revoked by user";
        session.logoutAt     = new Date();
        await session.save();

        return res.status(200).json({ success: true, message: "Session revoked successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── REVOKE ALL OTHER SESSIONS ────────────────────────────────────────────────

/**
 * PATCH /sessions/revoke-all-others
 * Logs out every session except the current one.
 */
const revokeAllOtherSessions = async (req, res) => {
    try {
        const currentToken = req.cookies?.refreshToken;

        const filter = {
            userId    : req.user._id,
            isRevoked : false,
        };

        // Exclude the current active session
        if (currentToken) {
            const currentSession = await Session.findOne({ refreshToken: currentToken });
            if (currentSession) {
                filter._id = { $ne: currentSession._id };
            }
        }

        const result = await Session.updateMany(filter, {
            $set: {
                isActive     : false,
                isRevoked    : true,
                revokedAt    : new Date(),
                logoutAt     : new Date(),
                revokeReason : "Revoked by user (sign out all devices)",
            },
        });

        return res.status(200).json({
            success : true,
            message : `${result.modifiedCount} session(s) revoked`,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── REFRESH ACCESS TOKEN (session-aware) ────────────────────────────────────

/**
 * POST /sessions/refresh-token
 * Rotates the refresh token and updates the session record.
 */
const refreshSessionToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({ success: false, message: "Refresh token missing" });
        }

        // ── Verify JWT signature ──
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch {
            res.clearCookie("refreshToken");
            return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
        }

        // ── Find session ──
        const session = await Session.findOne({
            refreshToken : token,
            userId       : decoded.id,
            isActive     : true,
            isRevoked    : false,
        });

        if (!session) {
            // Token reuse attack — revoke ALL sessions for this user
            await Session.updateMany(
                { userId: decoded.id },
                {
                    $set: {
                        isActive     : false,
                        isRevoked    : true,
                        revokedAt    : new Date(),
                        revokeReason : "Refresh token reuse detected — all sessions revoked",
                    },
                }
            );
            res.clearCookie("refreshToken");
            return res.status(403).json({
                success : false,
                message : "Token reuse detected. All sessions have been revoked for security.",
            });
        }

        // ── Check session expiry ──
        if (session.expiresAt < new Date()) {
            session.isActive  = false;
            session.logoutAt  = new Date();
            await session.save();
            res.clearCookie("refreshToken");
            return res.status(403).json({ success: false, message: "Session expired. Please log in again." });
        }

        // ── Get user ──
        const user = await User.findById(decoded.id);
        if (!user || user.accountStatus !== "active") {
            res.clearCookie("refreshToken");
            return res.status(403).json({ success: false, message: "User account is inactive" });
        }

        // ── Rotate tokens ──
        const newAccessToken  = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        session.accessToken      = newAccessToken;
        session.refreshToken     = newRefreshToken;
        session.lastActivityAt   = new Date();
        session.expiresAt        = sessionExpiry();
        await session.save();

        res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);

        return res.status(200).json({ success: true, accessToken: newAccessToken });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── UPDATE LAST ACTIVITY ─────────────────────────────────────────────────────

/**
 * PATCH /sessions/ping
 * Call this from the frontend periodically (e.g. every 5 min) to keep
 * the session "lastActivityAt" fresh without issuing new tokens.
 */
const pingSession = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ success: false, message: "No active session" });
        }

        const session = await Session.findOneAndUpdate(
            { refreshToken: token, isActive: true, isRevoked: false },
            { $set: { lastActivityAt: new Date() } },
            { new: true }
        ).select("sessionId lastActivityAt expiresAt");

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found or expired" });
        }

        return res.status(200).json({ success: true, session });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── MARK SESSION SUSPICIOUS (admin use) ─────────────────────────────────────

/**
 * PATCH /sessions/:sessionId/flag
 * Admin can manually flag a session as suspicious.
 */
const flagSessionSuspicious = async (req, res) => {
    try {
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ success: false, message: "Reason is required" });
        }

        const session = await Session.findOneAndUpdate(
            { sessionId: req.params.sessionId },
            {
                $set: {
                    isSuspicious    : true,
                    suspiciousReason: reason,
                },
            },
            { new: true }
        ).select("-refreshToken -accessToken");

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        return res.status(200).json({
            success : true,
            message : "Session flagged as suspicious",
            session,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── GET ALL SUSPICIOUS SESSIONS (admin) ─────────────────────────────────────

/**
 * GET /sessions/admin/suspicious
 * Returns all suspicious sessions across all users (admin only).
 */
const getSuspiciousSessions = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip  = (Number(page) - 1) * Number(limit);
        const total = await Session.countDocuments({ isSuspicious: true });

        const sessions = await Session.find({ isSuspicious: true })
            .populate("userId", "fullName email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select("-refreshToken -accessToken");

        return res.status(200).json({
            success    : true,
            total,
            page       : Number(page),
            totalPages : Math.ceil(total / Number(limit)),
            sessions,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── GET ALL ACTIVE SESSIONS (admin) ─────────────────────────────────────────

/**
 * GET /sessions/admin/active
 * Returns all currently active sessions across all users (admin only).
 */
const getAllActiveSessions = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip  = (Number(page) - 1) * Number(limit);
        const total = await Session.countDocuments({ isActive: true, isRevoked: false });

        const sessions = await Session.find({ isActive: true, isRevoked: false })
            .populate("userId", "fullName email role")
            .sort({ lastActivityAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select("-refreshToken -accessToken");

        return res.status(200).json({
            success    : true,
            total,
            page       : Number(page),
            totalPages : Math.ceil(total / Number(limit)),
            sessions,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── ADMIN: REVOKE ANY SESSION ────────────────────────────────────────────────

/**
 * PATCH /sessions/admin/:sessionId/revoke
 * Admin can forcefully revoke any session.
 */
const adminRevokeSession = async (req, res) => {
    try {
        const { reason } = req.body;

        const session = await Session.findOne({ sessionId: req.params.sessionId });

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        if (session.isRevoked) {
            return res.status(400).json({ success: false, message: "Session is already revoked" });
        }

        session.isActive     = false;
        session.isRevoked    = true;
        session.revokedAt    = new Date();
        session.revokeReason = reason || `Revoked by admin (${req.user._id})`;
        session.logoutAt     = new Date();
        await session.save();

        return res.status(200).json({ success: true, message: "Session revoked by admin" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── ADMIN: REVOKE ALL SESSIONS OF A USER ────────────────────────────────────

/**
 * PATCH /sessions/admin/users/:userId/revoke-all
 * Admin revokes all sessions of a specific user (e.g. after blocking).
 */
const adminRevokeAllUserSessions = async (req, res) => {
    try {
        const { reason } = req.body;
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const result = await Session.updateMany(
            { userId, isRevoked: false },
            {
                $set: {
                    isActive     : false,
                    isRevoked    : true,
                    revokedAt    : new Date(),
                    logoutAt     : new Date(),
                    revokeReason : reason || `All sessions revoked by admin (${req.user._id})`,
                },
            }
        );

        return res.status(200).json({
            success : true,
            message : `${result.modifiedCount} session(s) revoked for user ${user.fullName}`,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── GET SESSION STATS (admin) ────────────────────────────────────────────────

/**
 * GET /sessions/admin/stats
 * Returns aggregated session statistics.
 */
const getSessionStats = async (req, res) => {
    try {
        const [stats] = await Session.aggregate([
            {
                $group: {
                    _id            : null,
                    total          : { $sum: 1 },
                    active         : { $sum: { $cond: ["$isActive", 1, 0] } },
                    revoked        : { $sum: { $cond: ["$isRevoked", 1, 0] } },
                    suspicious     : { $sum: { $cond: ["$isSuspicious", 1, 0] } },
                    mobileUsers    : { $sum: { $cond: [{ $eq: ["$deviceType", "mobile"] }, 1, 0] } },
                    desktopUsers   : { $sum: { $cond: [{ $eq: ["$deviceType", "desktop"] }, 1, 0] } },
                    tabletUsers    : { $sum: { $cond: [{ $eq: ["$deviceType", "tablet"] }, 1, 0] } },
                },
            },
            { $project: { _id: 0 } },
        ]);

        const loginMethodBreakdown = await Session.aggregate([
            { $group: { _id: "$loginMethod", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        const topCountries = await Session.aggregate([
            { $group: { _id: "$location.country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        return res.status(200).json({
            success : true,
            stats   : stats || {},
            loginMethodBreakdown,
            topCountries,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = {
    // Internal helper (used in auth.controller.js loginUser)
    createSession,

    // User-facing
    getMySessions,
    getSessionById,
    revokeSession,
    revokeAllOtherSessions,
    refreshSessionToken,
    pingSession,

    // Admin-facing
    flagSessionSuspicious,
    getSuspiciousSessions,
    getAllActiveSessions,
    adminRevokeSession,
    adminRevokeAllUserSessions,
    getSessionStats,
};