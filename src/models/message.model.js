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

messageSchema.index({
    messageType: 1
})

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;