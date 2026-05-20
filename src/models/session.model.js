const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  accessToken: {
    type: String
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  deviceId: {
    type: String
  },
  deviceName: {
    type: String
  },
  deviceType: {
    type: String,

    enum: [
      "mobile",
      "desktop",
      "tablet",
      "unknown"
    ],
    default: "unknown"
  },
  browser: {
    type: String
  },
  operatingSystem: {
    type: String
  },
  ipAddress: {
    type: String
  },
  location: {
    country: String,
    state: String,
    city: String,
    timezone: String
  },
  loginMethod: {
    type: String,
    enum: [
      "email-password",
      "google",
      "otp",
      "admin-login"
    ],
    default: "email-password"
  },
  loginAt: {
    type: Date,
    default: Date.now
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  logoutAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  revokedAt: {
    type: Date
  },
  revokeReason: {
    type: String
  },
  isSuspicious: {
    type: Boolean,
    default: false
  },
  suspiciousReason: {
    type: String
  },
  userAgent: {
    type: String
  },
  metadata: {
    type: Object,
    default: {}
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });


sessionSchema.index({ userId: 1 });
sessionSchema.index({ refreshToken: 1 });
sessionSchema.index({ isActive: 1 });
sessionSchema.index({ isRevoked: 1 });
sessionSchema.index({ expiresAt: 1 });
sessionSchema.index({ createdAt: -1 });


const sessionModel = mongoose.model("Session", sessionSchema);

module.exports = sessionModel;
