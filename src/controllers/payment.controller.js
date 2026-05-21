const crypto = require("crypto");

const Payment = require("../models/payment.model");
const ServiceApplication = require("../models/serviceApplication.model");


// ========================================
// CREATE PAYMENT
// ========================================
const createPayment = async (req, res) => {

    try {

        const {
            applicationId,
            serviceId,
            pricing,
            paymentGateway,
            paymentMethod,
            notes,
            metadata
        } = req.body;

        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: "Application ID is required"
            });
        }

        if (!pricing || !pricing.finalAmount) {
            return res.status(400).json({
                success: false,
                message: "Pricing details are required"
            });
        }

        const paymentId = `PAY-${Date.now()}`;

        const payment = await Payment.create({
            paymentId,
            applicationId,
            clientId: req.user._id,
            serviceId,
            pricing,
            paymentGateway,
            paymentMethod,
            notes,
            metadata,
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        });

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: payment
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create payment"
        });
    }
};


// ========================================
// GET ALL PAYMENTS
// ========================================
const getAllPayments = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 10,
            paymentStatus,
            paymentGateway,
            paymentMethod,
            search
        } = req.query;

        const query = {};

        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        if (paymentGateway) {
            query.paymentGateway = paymentGateway;
        }

        if (paymentMethod) {
            query.paymentMethod = paymentMethod;
        }

        if (search) {
            query.paymentId = {
                $regex: search,
                $options: "i"
            };
        }

        const payments = await Payment.find(query)
            .populate("clientId", "name email phone")
            .populate("applicationId")
            .populate("serviceId", "serviceName")
            .populate("invoiceId")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Payment.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            data: payments
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch payments"
        });
    }
};


// ========================================
// GET SINGLE PAYMENT
// ========================================
const getSinglePayment = async (req, res) => {

    try {

        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId)
            .populate("clientId", "name email phone")
            .populate("applicationId")
            .populate("serviceId")
            .populate("invoiceId");

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: payment
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch payment"
        });
    }
};


// ========================================
// UPDATE PAYMENT
// ========================================
const updatePayment = async (req, res) => {

    try {

        const { paymentId } = req.params;

        const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedPayment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            data: updatedPayment
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update payment"
        });
    }
};


// ========================================
// MARK PAYMENT SUCCESS
// ========================================
const markPaymentSuccess = async (req, res) => {

    try {

        const { paymentId } = req.params;

        const {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            transactionId,
            gatewayResponse
        } = req.body;

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        payment.paymentStatus = "success";
        payment.paymentDate = new Date();

        payment.razorpayPaymentId = razorpayPaymentId;
        payment.razorpayOrderId = razorpayOrderId;
        payment.razorpaySignature = razorpaySignature;

        payment.transactionId = transactionId;
        payment.gatewayResponse = gatewayResponse;

        await payment.save();

        // update application
        await ServiceApplication.findByIdAndUpdate(
            payment.applicationId,
            {
                paymentStatus: "success",
                paymentId: payment._id,
                applicationStatus: "payment-success"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Payment marked as success",
            data: payment
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update payment"
        });
    }
};


// ========================================
// MARK PAYMENT FAILED
// ========================================
const markPaymentFailed = async (req, res) => {

    try {

        const { paymentId } = req.params;

        const { failureReason } = req.body;

        const payment = await Payment.findByIdAndUpdate(
            paymentId,
            {
                paymentStatus: "failed",
                failureReason
            },
            {
                new: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Payment marked as failed",
            data: payment
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to mark payment failed"
        });
    }
};


// ========================================
// VERIFY RAZORPAY SIGNATURE
// ========================================
const verifyRazorpayPayment = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};


// ========================================
// REFUND PAYMENT
// ========================================
const refundPayment = async (req, res) => {

    try {

        const { paymentId } = req.params;

        const {
            refundId,
            refundAmount,
            refundReason
        } = req.body;

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        payment.paymentStatus = "refunded";

        payment.refundDetails = {
            refundId,
            refundAmount,
            refundReason,
            refundedAt: new Date()
        };

        await payment.save();

        return res.status(200).json({
            success: true,
            message: "Payment refunded successfully",
            data: payment
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Refund failed"
        });
    }
};


// ========================================
// DELETE PAYMENT
// ========================================
const deletePayment = async (req, res) => {

    try {

        const { paymentId } = req.params;

        const payment = await Payment.findByIdAndDelete(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete payment"
        });
    }
};



module.exports = {
    createPayment,
    getAllPayments,
    getSinglePayment,
    updatePayment,
    markPaymentSuccess,
    markPaymentFailed,
    verifyRazorpayPayment,
    refundPayment,
    deletePayment
}