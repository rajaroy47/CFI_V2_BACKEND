const express = require("express");
const router  = express.Router();

const {
    getMySessions,
    getSessionById,
    revokeSession,
    revokeAllOtherSessions,
    refreshSessionToken,
    pingSession,
    flagSessionSuspicious,
    getSuspiciousSessions,
    getAllActiveSessions,
    adminRevokeSession,
    adminRevokeAllUserSessions,
    getSessionStats,
} = require("../controllers/session.controller.js");

const { verifyAccessToken } = require("../middlewares/auth.middleware.js");
const { authorizeRoles }    = require("../middlewares/role.middleware.js");   // your role guard

// ─── USER ROUTES (any authenticated user) ────────────────────────────────────
router.get   ("/",                    verifyAccessToken, getMySessions);
router.get   ("/:sessionId",          verifyAccessToken, getSessionById);
router.patch ("/:sessionId/revoke",   verifyAccessToken, revokeSession);
router.patch ("/revoke-all-others",   verifyAccessToken, revokeAllOtherSessions);
router.post  ("/refresh-token",       refreshSessionToken);          // no auth — uses cookie
router.patch ("/ping",                verifyAccessToken, pingSession);

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────
router.get   ("/admin/active",                        verifyAccessToken, authorizeRoles("admin"), getAllActiveSessions);
router.get   ("/admin/suspicious",                    verifyAccessToken, authorizeRoles("admin"), getSuspiciousSessions);
router.get   ("/admin/stats",                         verifyAccessToken, authorizeRoles("admin"), getSessionStats);
router.patch ("/admin/:sessionId/revoke",             verifyAccessToken, authorizeRoles("admin"), adminRevokeSession);
router.patch ("/admin/:sessionId/flag",               verifyAccessToken, authorizeRoles("admin"), flagSessionSuspicious);
router.patch ("/admin/users/:userId/revoke-all",      verifyAccessToken, authorizeRoles("admin"), adminRevokeAllUserSessions);

module.exports = router;