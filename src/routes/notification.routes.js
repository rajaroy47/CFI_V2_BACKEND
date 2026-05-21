const express = require("express");
const router  = express.Router();

const {
    createNotification,
    getAllNotifications,
    getUserNotifications,
    getSingleNotification,
    updateNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadNotificationCount
} = require("../controllers/notification.controller.js");


// =========================================
// CREATE NOTIFICATION
// =========================================
router.post("/create", createNotification);


// =========================================
// GET ALL NOTIFICATIONS
// =========================================
router.get("/all", getAllNotifications);


// =========================================
// GET USER NOTIFICATIONS
// =========================================
router.get("/my-notifications", getUserNotifications);


// =========================================
// GET SINGLE NOTIFICATION
// =========================================
router.get("/:notificationId", getSingleNotification);


// =========================================
// UPDATE NOTIFICATION
// =========================================
router.put("/update/:notificationId", updateNotification);


// =========================================
// MARK NOTIFICATION AS READ
// =========================================
router.patch("/read/:notificationId", markNotificationAsRead);


// =========================================
// MARK ALL NOTIFICATIONS AS READ
// =========================================
router.patch("/read-all", markAllNotificationsAsRead);


// =========================================
// DELETE NOTIFICATION
// =========================================
router.delete("/delete/:notificationId", deleteNotification);


// =========================================
// GET UNREAD NOTIFICATION COUNT
// =========================================
router.get("/unread/count", getUnreadNotificationCount);


module.exports = router;