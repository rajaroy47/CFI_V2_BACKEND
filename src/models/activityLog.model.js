const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userRole: {
    type: String,
    enum: [
      "client",
      "employee",
      "admin"
    ],
    required: true
  },
  activityType: {
    type: String,
    enum: [
      "login",
      "logout",
      "register",
      "password-change",
      "profile-update",
      "service-application",
      "payment-success",
      "payment-failed",
      "document-upload",
      "document-delete",
      "application-status-update",
      "task-assigned",
      "task-completed",
      "invoice-generated",
      "notification-sent",
      "chat-message",
      "security-alert",
      "admin-action",
      "settings-update"
    ],
    required: true
  },
  action: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  relatedApplicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceApplication"
  },
  relatedPaymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment"
  },
  relatedDocumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document"
  },
  relatedInvoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice"
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  oldValues: {
    type: Object,
    default: {}
  },
  newValues: {
    type: Object,
    default: {}
  },
  ipAddress: {
    type: String
  },
  deviceInfo: {
    type: String
  },
  browser: {
    type: String
  },
  operatingSystem: {
    type: String
  },
  requestMethod: {
    type: String
  },
  requestUrl: {
    type: String
  },

  responseStatusCode: {
    type: Number
  },
  severity: {
    type: String,

    enum: [
      "low",
      "medium",
      "high",
      "critical"
    ],
    default: "low"
  },
  status: {
    type: String,
    enum: [
      "success",
      "failed",
      "warning"
    ],
    default: "success"
  },
  metadata: {
    type: Object,
    default: {}
  },
  isSuspicious: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });


activityLogSchema.index({ 
    userId: 1 
})
activityLogSchema.index({ 
    activityType: 1 
})
activityLogSchema.index({ 
    relatedApplicationId: 1 
})
activityLogSchema.index({ 
    severity: 1 
})
activityLogSchema.index({ 
    status: 1 
})
activityLogSchema.index({ 
    createdAt: -1 
})
activityLogSchema.index({ 
    isSuspicious: 1 
})

const ActivityLogModel = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLogModel;