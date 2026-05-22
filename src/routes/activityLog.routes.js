const express = require("express");

const router = express.Router();

const activityLogController = require("../controllers/activityLog.controller");


// =========================================
// CREATE ACTIVITY LOG
// =========================================
router.post(
    "/create",
    activityLogController.createActivityLog
);


// =========================================
// GET ALL ACTIVITY LOGS
// =========================================
router.get(
    "/all",
    activityLogController.getAllActivityLogs
);


// =========================================
// GET USER ACTIVITY LOGS
// =========================================
router.get(
    "/my-activities",
    activityLogController.getUserActivityLogs
);


// =========================================
// GET SINGLE ACTIVITY LOG
// =========================================
router.get(
    "/:activityLogId",
    activityLogController.getSingleActivityLog
);


// =========================================
// UPDATE ACTIVITY LOG
// =========================================
router.put(
    "/update/:activityLogId",
    activityLogController.updateActivityLog
);


// =========================================
// MARK ACTIVITY AS SUSPICIOUS
// =========================================
router.patch(
    "/suspicious/:activityLogId",
    activityLogController.markActivityAsSuspicious
);


// =========================================
// GET SUSPICIOUS ACTIVITIES
// =========================================
router.get(
    "/suspicious/all",
    activityLogController.getSuspiciousActivities
);


// =========================================
// DELETE ACTIVITY LOG
// =========================================
router.delete(
    "/delete/:activityLogId",
    activityLogController.deleteActivityLog
);


module.exports = router;