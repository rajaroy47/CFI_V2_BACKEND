const express = require("express");
const router  = express.Router();

const {
    createService,
    getAllServices,
    getServiceBySlug,
    getServiceById,
    updateService,
    toggleServiceStatus,
    toggleFeatured,
    togglePopular,
    deleteService,
    getAllCategories,
    getFeaturedServices,
    getPopularServices,
    getServiceStats,
    bulkUpdateStatus,
} = require("../controllers/service.controller.js");

const { verifyAccessToken }  = require("../middlewares/auth.middleware.js");
const { isAdmin }            = require("../middlewares/role.middleware.js");

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES  (no token needed)
// ─────────────────────────────────────────────────────────────────────────────

router.get("/",            getAllServices);       // ?category ?search ?featured ?popular ?minPrice ?maxPrice ?sortBy ?page ?limit
router.get("/featured",    getFeaturedServices);  // ?limit
router.get("/popular",     getPopularServices);   // ?limit
router.get("/categories",  getAllCategories);
router.get("/:slug",       getServiceBySlug);     // full detail by slug

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES  (token + admin role required)
// ─────────────────────────────────────────────────────────────────────────────

router.post  ("/",                        verifyAccessToken, isAdmin, createService);
router.get   ("/admin/stats",             verifyAccessToken, isAdmin, getServiceStats);
router.get   ("/id/:id",                  verifyAccessToken, isAdmin, getServiceById);
router.patch ("/admin/bulk-status",       verifyAccessToken, isAdmin, bulkUpdateStatus);
router.patch ("/:id",                     verifyAccessToken, isAdmin, updateService);
router.patch ("/:id/toggle-status",       verifyAccessToken, isAdmin, toggleServiceStatus);
router.patch ("/:id/toggle-featured",     verifyAccessToken, isAdmin, toggleFeatured);
router.patch ("/:id/toggle-popular",      verifyAccessToken, isAdmin, togglePopular);
router.delete("/:id",                     verifyAccessToken, isAdmin, deleteService);

module.exports = router;