const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["client", "employee", "admin"],
        default: "client"
    },
    profileImage: {
        type: String
    },
    companyName: {
        type: String
    },
    aadhaarNumber: {
        type: String
    },
    panNumber: {
        type: String
    },
    gstNumber: {
        type: String
    },
    address: {
        country: String,
        city: String,
        pinCode: String,
        fullAddress: String
    },
    employeeDetails: {
        employeeId: String,
        designation: String,
        salary: Number,
        joiningDate: Date,
        assignedService: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service"
            }
        ]
    },
    permission: [String],
    accountStatus: {
        type: String,
        enum: ["active", "blocked", "suspended"],
        default: "active"
    },
    isEmailVeryfied: {
        type: Boolean,
        default: false
    },
    isPhoneVeryfied: {
        type: Boolean,
        default: false
    },
    refreshToken: String,
    lastLogin: Date,
    passwordChangedAt: Date,
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date
}, { timestamps: true })


userSchema.index({
    email: 1
})
userSchema.index({
    phone: 1
})
userSchema.index({
    role: 1
})


const userModel = mongoose.model("User", userSchema)
module.exports = userModel;