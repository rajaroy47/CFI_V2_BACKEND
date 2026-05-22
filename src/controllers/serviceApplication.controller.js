const mongoose = require("mongoose");
const ServiceApplication = require("../models/serviceApplication.model");


// ==============================
// CREATE APPLICATION
// ==============================
exports.createApplication = async (req, res) => {
    try {

        const {
            serviceId,
            pricing,
            submittedData,
            remarks,
            priority,
            expectedDeliveryDate
        } = req.body;

        if (!serviceId) {
            return res.status(400).json({
                success: false,
                message: "Service ID is required"
            });
        }

        console.log("request user: ", req.user);

        if (!pricing || !pricing.basePrice || !pricing.finalAmount) {
            return res.status(400).json({
                success: false,
                message: "Pricing details are required"
            });
        }

        const applicationId = `APP-${Date.now()}`;

        

        const application = await ServiceApplication.create({
            applicationId,
            clientId: req.user._id,
            serviceId,
            pricing,
            submittedData,
            remarks,
            priority,
            expectedDeliveryDate
        });

        return res.status(201).json({
            success: true,
            message: "Application created successfully",
            data: application
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create application"
        });
    }
};


// ==============================
// GET ALL APPLICATIONS
// ==============================
exports.getAllApplications = async (req, res) => {
    try {

        const {
            page = 1,
            limit = 10,
            applicationStatus,
            paymentStatus,
            priority,
            search,
            isArchived
        } = req.query;

        const query = {};

        if (applicationStatus) {
            query.applicationStatus = applicationStatus;
        }

        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        if (priority) {
            query.priority = priority;
        }

        if (isArchived !== undefined) {
            query.isArchived = isArchived;
        }

        if (search) {
            query.applicationId = {
                $regex: search,
                $options: "i"
            };
        }

        const applications = await ServiceApplication
            .find(query)
            .populate("clientId", "name email phone")
            .populate("serviceId", "serviceName")
            .populate("assignedEmployeeId", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await ServiceApplication.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            data: applications
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications"
        });
    }
};


// ==============================
// GET SINGLE APPLICATION
// ==============================
exports.getSingleApplication = async (req, res) => {
    try {

        const { applicationId } = req.params;

        const application = await ServiceApplication
            .findById(applicationId)
            .populate("clientId", "name email phone")
            .populate("serviceId")
            .populate("assignedEmployeeId", "name email")
            .populate("documents")
            .populate("paymentId");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: application
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch application"
        });
    }
};


// ==============================
// UPDATE APPLICATION
// ==============================
exports.updateApplication = async (req, res) => {
    try {

        const { applicationId } = req.params;

        const updatedApplication = await ServiceApplication.findByIdAndUpdate(
            applicationId,
            {
                ...req.body,
                lastStatusUpdateAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedApplication) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application updated successfully",
            data: updatedApplication
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update application"
        });
    }
};


// ==============================
// UPDATE APPLICATION STATUS
// ==============================
exports.updateApplicationStatus = async (req, res) => {
    try {

        const { applicationId } = req.params;
        const { applicationStatus } = req.body;

        const application = await ServiceApplication.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        application.applicationStatus = applicationStatus;
        application.lastStatusUpdateAt = new Date();

        if (applicationStatus === "completed") {
            application.completeAt = new Date();
        }

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: application
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update application status"
        });
    }
};


// ==============================
// ASSIGN EMPLOYEE
// ==============================
exports.assignEmployee = async (req, res) => {
    try {

        const { applicationId } = req.params;
        const { employeeId } = req.body;

        const application = await ServiceApplication.findByIdAndUpdate(
            applicationId,
            {
                assignedEmployeeId: employeeId,
                applicationStatus: "assigned",
                lastStatusUpdateAt: new Date()
            },
            {
                new: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Employee assigned successfully",
            data: application
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to assign employee"
        });
    }
};


// ==============================
// UPDATE PAYMENT STATUS
// ==============================
exports.updatePaymentStatus = async (req, res) => {
    try {

        const { applicationId } = req.params;

        const {
            paymentStatus,
            paymentId
        } = req.body;

        const application = await ServiceApplication.findByIdAndUpdate(
            applicationId,
            {
                paymentStatus,
                paymentId,
                applicationStatus:
                    paymentStatus === "success"
                        ? "payment-success"
                        : "payment-pending"
            },
            {
                new: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            data: application
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update payment"
        });
    }
};


// ==============================
// ARCHIVE APPLICATION
// ==============================
exports.archiveApplication = async (req, res) => {
    try {

        const { applicationId } = req.params;

        const application = await ServiceApplication.findByIdAndUpdate(
            applicationId,
            {
                isArchived: true
            },
            {
                new: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Application archived successfully",
            data: application
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to archive application"
        });
    }
};


// ==============================
// DELETE APPLICATION
// ==============================
exports.deleteApplication = async (req, res) => {
    try {

        const { applicationId } = req.params;

        const application = await ServiceApplication.findByIdAndDelete(applicationId);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete application"
        });
    }
};