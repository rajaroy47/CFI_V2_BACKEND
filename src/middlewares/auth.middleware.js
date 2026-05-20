// ─── auth.middleware.js ───────────────────────────────────────────────────────

const jwt  = require("jsonwebtoken");
const User = require("../models/user.model.js");

/**
 * Verifies the Bearer access token from the Authorization header.
 * Sets req.user = decoded JWT payload on success.
 */
const verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success : false,
                message : "Unauthorized — no token provided",
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            const message = err.name === "TokenExpiredError"
                ? "Token expired — please refresh"
                : "Invalid token";
            return res.status(401).json({ success: false, message });
        }

        console.log(decoded)

        // Optional: verify user still exists & is active (adds 1 DB call but safer)
        const user = await User.findById(decoded._id).select("_id role accountStatus permission");

        if (!user) {
            return res.status(401).json({ success: false, message: "User no longer exists" });
        }

        if (user.accountStatus !== "active") {
            return res.status(403).json({
                success : false,
                message : `Account is ${user.accountStatus}`,
            });
        }

        // Attach full safe user object to request
        req.user = {
            _id        : user._id,
            id         : user._id.toString(),
            role       : user.role,
            permission : user.permission,
        };

        next();

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Keep isAuthenticated as an alias for backward compatibility
const isAuthenticated = verifyAccessToken;

module.exports = {
    verifyAccessToken,
    isAuthenticated,
};