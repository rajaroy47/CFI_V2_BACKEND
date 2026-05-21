const express = require("express");

const router = express.Router();

const paymentController = require("../controllers/payment.controller");


// ========================================
// CREATE PAYMENT
// ========================================
router.post(
    "/create",
    paymentController.createPayment
);


// ========================================
// GET ALL PAYMENTS
// ========================================
router.get(
    "/all",
    paymentController.getAllPayments
);


// ========================================
// GET SINGLE PAYMENT
// ========================================
router.get(
    "/:paymentId",
    paymentController.getSinglePayment
);


// ========================================
// UPDATE PAYMENT
// ========================================
router.put(
    "/update/:paymentId",
    paymentController.updatePayment
);


// ========================================
// MARK PAYMENT SUCCESS
// ========================================
router.patch(
    "/success/:paymentId",
    paymentController.markPaymentSuccess
);


// ========================================
// MARK PAYMENT FAILED
// ========================================
router.patch(
    "/failed/:paymentId",
    paymentController.markPaymentFailed
);


// ========================================
// VERIFY RAZORPAY PAYMENT
// ========================================
router.post(
    "/verify-razorpay-payment",
    paymentController.verifyRazorpayPayment
);


// ========================================
// REFUND PAYMENT
// ========================================
router.patch(
    "/refund/:paymentId",
    paymentController.refundPayment
);


// ========================================
// DELETE PAYMENT
// ========================================
router.delete(
    "/delete/:paymentId",
    paymentController.deletePayment
);


module.exports = router;