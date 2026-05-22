const mongoose = require("mongoose");

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

    // store only message ids
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ],

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


// ================= INDEXES =================

chatSchema.index({
    applicationId: 1
});

chatSchema.index({
    participants: 1
});

chatSchema.index({
    chatType: 1
});

chatSchema.index({
    lastMessageAt: -1
});

chatSchema.index({
    createdAt: -1
});


const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;