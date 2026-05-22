const { application } = require("express");
const mongoose = require("mongoose");

const serviceApplicationSchema = new mongoose.Schema({
    applicationId: {
        type: String,
        required: true,
        unique: true
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
    assignedEmployeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    applicationStatus: {
        type: String,
        enum: [
            "applied",
            "payment-pending",
            "payment-success",
            "documents-pending",
            "under-review",
            "assigned",
            "processing",
            "completed",
            "rejected",
            "cancelled"
        ],
        default: "applied"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed", "refunded"],
        default: "pending"
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    },
    documents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document"
        }
    ],
    pricing: {
        basePrice: {
            type: String,
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
    submittedData: {
        type: Object,
        default: {}
    },
    remarks: {
        type: String
    },
    rejectedReason: {
        type: String
    },
    adminNotes: {
        type: String
    },
    employeeNotes: {
        type: String
    },
    expectedDeliveryDate: {
        type: Date
    },
    completeAt: {
        type: Date
    },
    lastStatusUpdateAt: {
        type: Date,
        default: Date.now
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    activityCount: {
        type: Number,
        default: 0
    },
    totalDocument: {
        type: Number,
        default: 0
    },
    totalMessage: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

serviceApplicationSchema.index({
    serviceId: 1
})
serviceApplicationSchema.index({
    paymentStatus: 1
})
serviceApplicationSchema.index({
    priority: 1
})

const serviceApplicationModel = mongoose.model("ServiceApplication", serviceApplicationSchema);
 
module.exports = serviceApplicationModel;

