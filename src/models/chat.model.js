const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  senderRole: {
    type: String,
    enum: [
      "client",
      "employee",
      "admin"
    ],
    required: true
  },
  messageType: {
    type: String,
    enum: [
      "text",
      "image",
      "file",
      "audio",
      "system"
    ],
    default: "text"
  },

  message: {
    type: String,
    trim: true
  },
  attachments: [
    {
      fileName: String,
      fileUrl: String,
      publicId: String,
      mimeType: String,
      fileSize: Number
    }
  ],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  readBy: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      readAt: {
        type: Date
      }
    }
  ],
  metadata: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

const chatSchema = new mongoose.Schema({

  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceApplication",
    required: true
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  chatType: {
    type: String,
    enum: [
      "application-support",
      "internal",
      "group"
    ],
    default: "application-support"
  },
  messages: [messageSchema],
  lastMessage: {
    type: String
  },
  lastMessageAt: {
    type: Date
  },
  lastMessageSenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  totalMessages: {
    type: Number,
    default: 0
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  blockedReason: {
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


chatSchema.index({ applicationId: 1 });
chatSchema.index({ participants: 1 });
chatSchema.index({ chatType: 1 });
chatSchema.index({ lastMessageAt: -1 });
chatSchema.index({ createdAt: -1 });


const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;