const express = require("express");

const { isAuthenticated } = require("../middlewares/auth.middleware.js");

const router  = express.Router();

const {
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
} = require("../controllers/auth.controller.js");


// ─── PUBLIC ROUTES (no token needed) ─────────────────────────────────────────

router.post("/register",        registerUser);
router.post("/login",           loginUser);
router.post("/refresh-token",   refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",  resetPassword);

// ─── PROTECTED ROUTES (valid access token required) ───────────────────────────

router.post  ("/logout",          isAuthenticated, logoutUser);
router.get   ("/me",              isAuthenticated, getMyProfile);
router.patch ("/me",              isAuthenticated, updateProfile);
router.patch ("/change-password", isAuthenticated, changePassword);
router.delete("/me",              isAuthenticated, deleteAccount);

module.exports = router;