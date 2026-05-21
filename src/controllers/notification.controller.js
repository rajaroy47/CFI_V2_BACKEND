const Notification = require("../models/notification.model");


// =========================================
// CREATE NOTIFICATION
// =========================================
const createNotification = async (req, res) => {

    try {

        const {
            receiverId,
            title,
            message,
            notificationType,
            priority,
            relatedApplicationId,
            relatedPaymentId,
            relatedDocumentId,
            relatedInvoiceId,
            redirectUrl,
            deliveryChannels,
            metadata,
            expiresAt
        } = req.body;

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required"
            });
        }

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "Title and message are required"
            });
        }

        const notification = await Notification.create({
            receiverId,
            senderId: req.user?._id,
            title,
            message,
            notificationType,
            priority,
            relatedApplicationId,
            relatedPaymentId,
            relatedDocumentId,
            relatedInvoiceId,
            redirectUrl,
            deliveryChannels,
            metadata,
            expiresAt,
            createdBy: req.user?._id
        });

        return res.status(201).json({
            success: true,
            message: "Notification created successfully",
            data: notification
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create notification"
        });
    }
};


// =========================================
// GET ALL NOTIFICATIONS
// =========================================
const getAllNotifications = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 10,
            notificationType,
            priority,
            isRead,
            deliveryStatus
        } = req.query;

        const query = {
            isDeleted: false
        };

        if (notificationType) {
            query.notificationType = notificationType;
        }

        if (priority) {
            query.priority = priority;
        }

        if (isRead !== undefined) {
            query.isRead = isRead;
        }

        if (deliveryStatus) {
            query.deliveryStatus = deliveryStatus;
        }

        const notifications = await Notification.find(query)
            .populate("receiverId", "name email")
            .populate("senderId", "name email")
            .populate("relatedApplicationId")
            .populate("relatedPaymentId")
            .populate("relatedDocumentId")
            .populate("relatedInvoiceId")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Notification.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            data: notifications
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};


// =========================================
// GET USER NOTIFICATIONS
// =========================================
const getUserNotifications = async (req, res) => {

    try {

        const notifications = await Notification.find({
            receiverId: req.user._id,
            isDeleted: false
        })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: notifications.length,
            data: notifications
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user notifications"
        });
    }
};


// =========================================
// GET SINGLE NOTIFICATION
// =========================================
const getSingleNotification = async (req, res) => {

    try {

        const { notificationId } = req.params;

        const notification = await Notification.findById(notificationId)
            .populate("receiverId", "name email")
            .populate("senderId", "name email");

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: notification
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notification"
        });
    }
};


// =========================================
// UPDATE NOTIFICATION
// =========================================
const updateNotification = async (req, res) => {

    try {

        const { notificationId } = req.params;

        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedNotification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification updated successfully",
            data: updatedNotification
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update notification"
        });
    }
};


// =========================================
// MARK NOTIFICATION AS READ
// =========================================
const markNotificationAsRead = async (req, res) => {

    try {

        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            {
                isRead: true,
                readAt: new Date()
            },
            {
                new: true
            }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to mark notification as read"
        });
    }
};


// =========================================
// MARK ALL NOTIFICATIONS AS READ
// =========================================
const markAllNotificationsAsRead = async (req, res) => {

    try {

        await Notification.updateMany(
            {
                receiverId: req.user._id,
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to mark notifications as read"
        });
    }
};


// =========================================
// DELETE NOTIFICATION
// =========================================
const deleteNotification = async (req, res) => {

    try {

        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            {
                isDeleted: true,
                deletedAt: new Date()
            },
            {
                new: true
            }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete notification"
        });
    }
};


// =========================================
// GET UNREAD NOTIFICATION COUNT
// =========================================
const getUnreadNotificationCount = async (req, res) => {

    try {

        const unreadCount = await Notification.countDocuments({
            receiverId: req.user._id,
            isRead: false,
            isDeleted: false
        });

        return res.status(200).json({
            success: true,
            unreadCount
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch unread notification count"
        });
    }
};



module.exports = {
    createNotification,
    getAllNotifications,
    getUserNotifications,
    getSingleNotification,
    updateNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadNotificationCount
}