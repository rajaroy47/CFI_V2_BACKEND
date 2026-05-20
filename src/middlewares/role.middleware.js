// ─── role.middleware.js ───────────────────────────────────────────────────────
// Usage:  authorizeRoles("admin")
//         authorizeRoles("admin", "employee")
//         hasPermission("manage_users")
// ─────────────────────────────────────────────────────────────────────────────

const User = require("../models/user.model.js");


// ─── AUTHORIZE BY ROLE ────────────────────────────────────────────────────────

/**
 * Checks that the authenticated user's role is in the allowed list.
 *
 * @example
 * router.get("/admin/stats", verifyAccessToken, authorizeRoles("admin"), getStats);
 * router.get("/reports",     verifyAccessToken, authorizeRoles("admin", "employee"), getReports);
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // req.user is set by auth.middleware.js (isAuthenticated / verifyAccessToken)
            if (!req.user) {
                return res.status(401).json({
                    success : false,
                    message : "Unauthorized — not authenticated",
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success : false,
                    message : `Access denied — required role: [${allowedRoles.join(", ")}], your role: ${req.user.role}`,
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    };
};


// ─── AUTHORIZE BY PERMISSION STRING ──────────────────────────────────────────

/**
 * Checks that the user has a specific permission string stored in their
 * `permission` array field (User model).
 * Fetches a fresh copy from DB so revoked permissions take effect immediately.
 *
 * @example
 * router.delete("/users/:id", verifyAccessToken, hasPermission("delete_user"), deleteUser);
 */
const hasPermission = (...requiredPermissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success : false,
                    message : "Unauthorized — not authenticated",
                });
            }

            // Admins bypass all permission checks
            if (req.user.role === "admin") return next();

            // Fetch fresh permissions from DB (not from JWT — JWT can be stale)
            const user = await User.findById(req.user._id).select("permission role accountStatus");

            if (!user) {
                return res.status(401).json({ success: false, message: "User not found" });
            }

            if (user.accountStatus !== "active") {
                return res.status(403).json({
                    success : false,
                    message : `Account is ${user.accountStatus}`,
                });
            }

            const userPermissions = user.permission || [];
            const missing = requiredPermissions.filter((p) => !userPermissions.includes(p));

            if (missing.length > 0) {
                return res.status(403).json({
                    success : false,
                    message : `Access denied — missing permission(s): [${missing.join(", ")}]`,
                });
            }

            // Attach fresh permissions to req for downstream use
            req.user.permissions = userPermissions;

            next();

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    };
};


// ─── SELF OR ADMIN ────────────────────────────────────────────────────────────

/**
 * Allows access if the requesting user is either:
 *   - an admin, OR
 *   - the owner of the resource (req.user._id === req.params.userId)
 *
 * @example
 * router.get("/users/:userId/profile", verifyAccessToken, isSelfOrAdmin, getProfile);
 */
const isSelfOrAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const isAdmin = req.user.role === "admin";
        const isSelf  = req.user._id?.toString() === req.params.userId?.toString() ||
                        req.user.id?.toString()   === req.params.userId?.toString();

        if (!isAdmin && !isSelf) {
            return res.status(403).json({
                success : false,
                message : "Access denied — you can only access your own resource",
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ─── ADMIN ONLY (shorthand) ───────────────────────────────────────────────────

/**
 * Shorthand for authorizeRoles("admin").
 *
 * @example
 * router.delete("/users/:id", verifyAccessToken, isAdmin, deleteUser);
 */
const isAdmin = authorizeRoles("admin");


// ─── EMPLOYEE OR ADMIN (shorthand) ────────────────────────────────────────────

/**
 * Shorthand for authorizeRoles("admin", "employee").
 *
 * @example
 * router.get("/orders", verifyAccessToken, isEmployeeOrAdmin, getOrders);
 */
const isEmployeeOrAdmin = authorizeRoles("admin", "employee");


// ─── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = {
    authorizeRoles,
    hasPermission,
    isSelfOrAdmin,
    isAdmin,
    isEmployeeOrAdmin,
};