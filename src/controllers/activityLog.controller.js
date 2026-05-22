const ActivityLog = require("../models/activityLog.model");


// =========================================
// CREATE ACTIVITY LOG
// =========================================
exports.createActivityLog = async (req, res) => {

    try {

        const {
            userRole,
            activityType,
            action,
            description,
            relatedApplicationId,
            relatedPaymentId,
            relatedDocumentId,
            relatedInvoiceId,
            targetUserId,
            oldValues,
            newValues,
            severity,
            status,
            metadata,
            isSuspicious
        } = req.body;

        if (!activityType || !action) {
            return res.status(400).json({
                success: false,
                message: "Activity type and action are required"
            });
        }

        const activityLog = await ActivityLog.create({
            userId: req.user._id,
            userRole,
            activityType,
            action,
            description,
            relatedApplicationId,
            relatedPaymentId,
            relatedDocumentId,
            relatedInvoiceId,
            targetUserId,
            oldValues,
            newValues,
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"],
            browser: req.headers["sec-ch-ua"],
            operatingSystem: req.headers["sec-ch-ua-platform"],
            requestMethod: req.method,
            requestUrl: req.originalUrl,
            responseStatusCode: 200,
            severity,
            status,
            metadata,
            isSuspicious,
            createdBy: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Activity log created successfully",
            data: activityLog
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create activity log"
        });
    }
};


// =========================================
// GET ALL ACTIVITY LOGS
// =========================================
exports.getAllActivityLogs = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 10,
            activityType,
            severity,
            status,
            isSuspicious,
            userRole
        } = req.query;

        const query = {};

        if (activityType) {
            query.activityType = activityType;
        }

        if (severity) {
            query.severity = severity;
        }

        if (status) {
            query.status = status;
        }

        if (userRole) {
            query.userRole = userRole;
        }

        if (isSuspicious !== undefined) {
            query.isSuspicious = isSuspicious;
        }

        const activityLogs = await ActivityLog.find(query)
            .populate("userId", "name email")
            .populate("targetUserId", "name email")
            .populate("relatedApplicationId")
            .populate("relatedPaymentId")
            .populate("relatedDocumentId")
            .populate("relatedInvoiceId")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await ActivityLog.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            data: activityLogs
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch activity logs"
        });
    }
};


// =========================================
// GET USER ACTIVITY LOGS
// =========================================
exports.getUserActivityLogs = async (req, res) => {

    try {

        const logs = await ActivityLog.find({
            userId: req.user._id
        })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: logs.length,
            data: logs
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user activity logs"
        });
    }
};


// =========================================
// GET SINGLE ACTIVITY LOG
// =========================================
exports.getSingleActivityLog = async (req, res) => {

    try {

        const { activityLogId } = req.params;

        const activityLog = await ActivityLog.findById(activityLogId)
            .populate("userId", "name email")
            .populate("targetUserId", "name email");

        if (!activityLog) {
            return res.status(404).json({
                success: false,
                message: "Activity log not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: activityLog
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch activity log"
        });
    }
};


// =========================================
// UPDATE ACTIVITY LOG
// =========================================
exports.updateActivityLog = async (req, res) => {

    try {

        const { activityLogId } = req.params;

        const updatedLog = await ActivityLog.findByIdAndUpdate(
            activityLogId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedLog) {
            return res.status(404).json({
                success: false,
                message: "Activity log not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Activity log updated successfully",
            data: updatedLog
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update activity log"
        });
    }
};


// =========================================
// MARK ACTIVITY AS SUSPICIOUS
// =========================================
exports.markActivityAsSuspicious = async (req, res) => {

    try {

        const { activityLogId } = req.params;

        const activityLog = await ActivityLog.findByIdAndUpdate(
            activityLogId,
            {
                isSuspicious: true,
                severity: "critical"
            },
            {
                new: true
            }
        );

        if (!activityLog) {
            return res.status(404).json({
                success: false,
                message: "Activity log not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Activity marked as suspicious",
            data: activityLog
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to mark activity suspicious"
        });
    }
};


// =========================================
// DELETE ACTIVITY LOG
// =========================================
exports.deleteActivityLog = async (req, res) => {

    try {

        const { activityLogId } = req.params;

        const deletedLog = await ActivityLog.findByIdAndDelete(activityLogId);

        if (!deletedLog) {
            return res.status(404).json({
                success: false,
                message: "Activity log not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Activity log deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete activity log"
        });
    }
};


// =========================================
// GET SUSPICIOUS ACTIVITIES
// =========================================
exports.getSuspiciousActivities = async (req, res) => {

    try {

        const suspiciousLogs = await ActivityLog.find({
            isSuspicious: true
        })
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: suspiciousLogs.length,
            data: suspiciousLogs
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch suspicious activities"
        });
    }
};