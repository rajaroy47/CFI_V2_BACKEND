const { application } = require("express");
const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceApplication",
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    transactionId: {
        type: String
    },
    paymentGateway: {
        type: String,
        enum: [
            "razorpay",
            "stripe",
            "paypal",
            "manual"
        ],
        default: "razorpay"
    },
    paymentMethod: {
        type: String,
        enum: [
            "upi",
            "card",
            "netbanking",
            "wallet",
            "emi",
            "bank-transfer",
            "cash"
        ]
    },
    currency: {
        type: String,
        enum: ["INR", "DOLAR"],
        default: "INR"
    },
    pricing: {
        baseAmount: {
            type: Number,
            required: true
        },
        gstPercentage: {
            type: Number,
            default: 18
        },
        gstAmount: {
            type: Number,
            default: 0
        },
        discountAmount: {
            type: Number,
            default: 0
        },
        finalAmount: {
            type: Number,
            required: true
        }
    },
    paymentStatus: {
        type: String,
        enum: ["created", "pending", "success", "failed", "cancelled", "refunded"],
        default: "created"
    },
    paymentDate: {
        type: Date
    },
    failureReason: {
        type: String
    },
    refundDetails: {
        refundId: String,
        refundAmount: Number,
        refundReason: String,
        refundedAt: Date
    },
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice"
    },
    receiptUrl: {
        type: String
    },
    gatewayResponse: {
        type: Object,
        default: {}
    },
    notes: {
        type: String
    },
    metadata: {
        type: Object,
        default: {}
    },
    isWebHookedVerified: {
        type: Boolean,
        default: false
    },
    ipAddress: {
        type: string
    },
    deviceInfo: {
        type: String
    }
}, { timestamps: true })

// indexing --
paymentSchema.index({
    paymentId: 1
})
paymentSchema.index({
    applicationId: 1
})
paymentSchema.index({
    clientId: 1
})
paymentSchema.index({
    serviceId: 1
})

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = paymentModel;