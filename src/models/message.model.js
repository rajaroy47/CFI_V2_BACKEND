const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },

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


// ================= INDEXES =================

messageSchema.index({
    chatId: 1
});

messageSchema.index({
    senderId: 1
});

messageSchema.index({
    messageType: 1
});

messageSchema.index({
    createdAt: -1
});


const Message = mongoose.model("Message", messageSchema);

module.exports = Message;