const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user.model.js");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken.js");

// const { sendEmail } = require("../utils/sendEmail.js");

// ─── HELPERS ────────────────────────────────────────────────────────────────

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS    = 15 * 60 * 1000; // 15 minutes

const COOKIE_OPTIONS = {
    httpOnly : true,
    secure   : process.env.NODE_ENV === "production",
    sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge   : 7 * 24 * 60 * 60 * 1000   // 7 days
};

/** Strip sensitive fields before sending a user object in a response */
const sanitizeUser = (user) => ({
    id        : user._id,
    fullName  : user.fullName,
    email     : user.email,
    phone     : user.phone,
    role      : user.role,
    profileImage  : user.profileImage  || null,
    companyName   : user.companyName   || null,
    accountStatus : user.accountStatus,
    isEmailVeryfied : user.isEmailVeryfied,
    isPhoneVeryfied : user.isPhoneVeryfied,
    lastLogin : user.lastLogin         || null,
    createdAt : user.createdAt,
});


// ─── REGISTER ───────────────────────────────────────────────────────────────

/**
 * POST /auth/register
 * Body: fullName, email, phone, password, role?, companyName?,
 *       aadhaarNumber?, panNumber?, gstNumber?, address?
 */
const registerUser = async (req, res) => {
    try {
        const {
            fullName, email, phone, password, role,
            companyName, aadhaarNumber, panNumber, gstNumber, address,
        } = req.body;

        // ── Basic field validation ──
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({
                success : false,
                message : "fullName, email, phone and password are required",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success : false,
                message : "Password must be at least 8 characters",
            });
        }

        // ── Duplicate check ──
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            const field = existingUser.email === email.toLowerCase() ? "email" : "phone";
            return res.status(409).json({
                success : false,
                message : `An account with this ${field} already exists`,
            });
        }

        // ── Hash password ──
        const hashedPassword = await bcrypt.hash(password, 12);

        // ── Create user ──
        const user = await User.create({
            fullName,
            email,
            phone,
            password : hashedPassword,
            role     : role || "client",
            companyName,
            aadhaarNumber,
            panNumber,
            gstNumber,
            address,
        });

        return res.status(201).json({
            success : true,
            message : "User registered successfully",
            user    : sanitizeUser(user),
        });

    } catch (error) {
        // MongoDB duplicate-key race condition
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || "field";
            return res.status(409).json({ success: false, message: `Duplicate ${field}` });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── LOGIN ───────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Body: email, password
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // ── Find user ──
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Same message as wrong-password to prevent user enumeration
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // ── Account status ──
        if (user.accountStatus === "blocked") {
            return res.status(403).json({ success: false, message: "Account has been blocked. Contact support." });
        }
        if (user.accountStatus === "suspended") {
            return res.status(403).json({ success: false, message: "Account is suspended. Contact support." });
        }

        // ── Lockout check ──
        if (user.lockUntil && user.lockUntil > new Date()) {
            const remainingMs  = user.lockUntil - Date.now();
            const remainingMin = Math.ceil(remainingMs / 60000);
            return res.status(429).json({
                success : false,
                message : `Account temporarily locked. Try again in ${remainingMin} minute(s).`,
            });
        }

        // ── Password check ──
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
                user.lockUntil             = new Date(Date.now() + LOCK_DURATION_MS);
                user.failedLoginAttempts   = 0;
                await user.save();
                return res.status(429).json({
                    success : false,
                    message : `Too many failed attempts. Account locked for 15 minutes.`,
                });
            }

            await user.save();
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // ── Clear lock / failed attempts ──
        user.failedLoginAttempts = 0;
        user.lockUntil           = undefined;
        user.lastLogin           = new Date();

        // ── Tokens ──
        const accessToken  = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

        return res.status(200).json({
            success      : true,
            message      : "Login successful",
            accessToken,
            user         : sanitizeUser(user),
        });

        // sendEmail("fortestingpurpose698@gmail.com", "Login Successfull", "<h1>Login success</h1>");

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── LOGOUT ──────────────────────────────────────────────────────────────────

/**
 * POST /auth/logout
 * Requires: refreshToken cookie
 */
const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            // Invalidate on DB — silently skip if token not found
            await User.findOneAndUpdate(
                { refreshToken: token },
                { $set: { refreshToken: "" } }
            );
        }

        res.clearCookie("refreshToken", {
            httpOnly : true,
            secure   : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── REFRESH ACCESS TOKEN ────────────────────────────────────────────────────

/**
 * POST /auth/refresh-token
 * Requires: refreshToken cookie
 */
const refreshAccessToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({ success: false, message: "Refresh token missing" });
        }

        // ── Verify signature & expiry ──
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            // Expired or tampered → clear cookie
            res.clearCookie("refreshToken");
            return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
        }

        // ── Match DB record ──
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            res.clearCookie("refreshToken");
            return res.status(403).json({ success: false, message: "Refresh token reuse detected" });
        }

        // ── Rotate tokens (refresh-token rotation) ──
        const newAccessToken  = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);

        return res.status(200).json({ success: true, accessToken: newAccessToken });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── GET MY PROFILE ──────────────────────────────────────────────────────────

/**
 * GET /auth/me
 * Requires: valid access token (auth middleware sets req.user)
 */
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password -refreshToken")
            .lean();

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────

/**
 * PATCH /auth/me
 * Body: any updatable fields (sensitive fields are blocked)
 */
const updateProfile = async (req, res) => {
    try {
        // ── Blacklist fields that must never be updated via this route ──
        const BLOCKED_FIELDS = [
            "password", "role", "refreshToken", "accountStatus",
            "failedLoginAttempts", "lockUntil", "isEmailVeryfied", "isPhoneVeryfied",
            "passwordChangedAt", "permission",
        ];

        const updateData = { ...req.body };
        BLOCKED_FIELDS.forEach((field) => delete updateData[field]);

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: "No valid fields to update" });
        }

        // ── Email uniqueness check if email is being changed ──
        if (updateData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updateData.email)) {
                return res.status(400).json({ success: false, message: "Invalid email format" });
            }
            const existing = await User.findOne({
                email : updateData.email,
                _id   : { $ne: req.user._id },
            });
            if (existing) {
                return res.status(409).json({ success: false, message: "Email already in use" });
            }
            // Re-verify email on change
            updateData.isEmailVeryfied = false;
        }

        // ── Phone uniqueness check ──
        if (updateData.phone) {
            const existing = await User.findOne({
                phone : updateData.phone,
                _id   : { $ne: req.user._id },
            });
            if (existing) {
                return res.status(409).json({ success: false, message: "Phone already in use" });
            }
            updateData.isPhoneVeryfied = false;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password -refreshToken");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success : true,
            message : "Profile updated successfully",
            user    : updatedUser,
        });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || "field";
            return res.status(409).json({ success: false, message: `Duplicate ${field}` });
        }
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(", ") });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── CHANGE PASSWORD ─────────────────────────────────────────────────────────

/**
 * PATCH /auth/change-password
 * Body: oldPassword, newPassword, confirmNewPassword
 */
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success : false,
                message : "oldPassword, newPassword and confirmNewPassword are required",
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ success: false, message: "New passwords do not match" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success : false,
                message : "New password must be at least 8 characters",
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                success : false,
                message : "New password must differ from old password",
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ── Verify old password ──
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        user.password          = await bcrypt.hash(newPassword, 12);
        user.passwordChangedAt = new Date();
        // Invalidate all existing refresh tokens → force re-login on other devices
        user.refreshToken      = "";
        await user.save();

        // Clear cookie on current device too
        res.clearCookie("refreshToken", {
            httpOnly : true,
            secure   : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        return res.status(200).json({
            success : true,
            message : "Password changed successfully. Please log in again.",
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────

/**
 * POST /auth/forgot-password
 * Body: email
 * Generates a reset token and (in production) emails it to the user.
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        // Always return 200 to prevent user enumeration
        if (!user) {
            return res.status(200).json({
                success : true,
                message : "If an account with that email exists, a reset link has been sent.",
            });
        }

        // ── Generate cryptographically random token ──
        const rawToken    = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.passwordResetToken   = hashedToken;
        user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        await user.save({ validateBeforeSave: false });

        // ── TODO: Send email with rawToken ──
        // e.g. sendResetEmail(user.email, rawToken);
        // The reset link should look like: https://yourapp.com/reset-password?token=<rawToken>

        // During development — expose token for testing
        const devPayload = process.env.NODE_ENV !== "production" ? { resetToken: rawToken } : {};

        console.log("devPayload: ", devPayload);

        return res.status(200).json({
            success : true,
            message : "If an account with that email exists, a reset link has been sent.",
            ...devPayload,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── RESET PASSWORD ───────────────────────────────────────────────────────────

/**
 * POST /auth/reset-password
 * Body: token (raw, from email link), newPassword, confirmNewPassword
 */
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmNewPassword } = req.body;

        if (!token || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success : false,
                message : "token, newPassword and confirmNewPassword are required",
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success : false,
                message : "Password must be at least 8 characters",
            });
        }

        // ── Hash incoming token and look it up ──
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            passwordResetToken   : hashedToken,
            passwordResetExpires : { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Token is invalid or has expired" });
        }

        user.password              = await bcrypt.hash(newPassword, 12);
        user.passwordChangedAt     = new Date();
        user.passwordResetToken    = undefined;
        user.passwordResetExpires  = undefined;
        user.refreshToken          = ""; // invalidate all sessions
        user.failedLoginAttempts   = 0;
        user.lockUntil             = undefined;
        await user.save();

        return res.status(200).json({
            success : true,
            message : "Password reset successful. Please log in with your new password.",
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── DELETE ACCOUNT ───────────────────────────────────────────────────────────

/**
 * DELETE /auth/me
 * Body: password  (confirmation)
 */
const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: "Password confirmation is required" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password is incorrect" });
        }

        await User.findByIdAndDelete(req.user._id);

        res.clearCookie("refreshToken", {
            httpOnly : true,
            secure   : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        return res.status(200).json({ success: true, message: "Account deleted successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── EXPORTS ─────────────────────────────────────────────────────────────────

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getMyProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    deleteAccount,
};