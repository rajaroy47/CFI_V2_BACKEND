const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  notificationType: {
    type: String,
    enum: [
      "application",
      "payment",
      "document",
      "task",
      "chat",
      "system",
      "security",
      "invoice",
      "reminder"
    ],
    default: "system"
  },
  priority: {
    type: String,
    enum: [
      "low",
      "medium",
      "high",
      "urgent"
    ],
    default: "medium"
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
  redirectUrl: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deliveryStatus: {
    type: String,
    enum: [
      "pending",
      "sent",
      "delivered",
      "failed"
    ],
    default: "pending"
  },
  deliveryChannels: [
    {
      type: String,
      enum: [
        "in-app",
        "email",
        "sms",
        "push"
      ]
    }
  ],
  metadata: {
    type: Object,
    default: {}
  },
  expiresAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

notificationSchema.index({ receiverId: 1 });
notificationSchema.index({ senderId: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ notificationType: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ deliveryStatus: 1 });

const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports = notificationModel;