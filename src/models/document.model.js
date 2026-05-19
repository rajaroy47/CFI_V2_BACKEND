const { application } = require("express");
const mongoose = require("mongoose");


const documentSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceApplication",
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    uploaderRole: {
        type: String,
        enum: ["employee", "client", "admin"],
        required: true
    },
    documentType: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    originalFileName: {
        type: String
    },
    fileUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String
    },
    mimeType: {
        type: String,
        required: true
    },
    fileExtention: {
        type: String,
    },
    fileSize: {
        type: Number,
        required: true
    },
    storageProvider: {
        type: String,
        enum: ["cloudinary", "local"],
        default: "local" // use cloudinary in production mode --
    },
    category: {
        type: String,
        enum: [
            "identity-proof",
            "address-proof",
            "gst-document",
            "pan-card",
            "aadhaar-card",
            "bank-statement",
            "invoice",
            "certificate",
            "agreement",
            "other"
        ],
        default: "other"
    },
    visibility: {
        type: String,
        enum: ["private", "client", "employee", "admin", "public"],
        default: "private"
    },
    verificationStatus: {
        type: String,
        enum: ["pending", "verified", "rejected"]
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    verifiedAt: {
        type: Date
    },
    verificationRemark: {
        type: String
    },
    isFinalDocument: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    metadata: {
        type: Object,
        default: {}
    },
    tags: [
        {
            type: String
        }
    ],
    uploadedFromIP: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

// indexing --
documentSchema.index({
    applicationId: 1
})
documentSchema.index({
    uploadedBy: 1
})
documentSchema.index({
    category: 1
})


const documentModel = mongoose.model("Document", documentSchema);

module.exports = documentModel;