const Message = require("../models/message.model");
const Chat = require("../models/chat.model");


// =========================================
// CREATE MESSAGE
// =========================================
const createMessage = async (req, res) => {

    try {

        const {
            chatId,
            senderRole,
            messageType,
            message,
            attachments,
            metadata
        } = req.body;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required"
            });
        }

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        const newMessage = await Message.create({
            senderId: req.user._id,
            senderRole,
            messageType,
            message,
            attachments,
            metadata
        });

        // push message into chat
        chat.messages.push(newMessage._id);

        chat.lastMessage = message;
        chat.lastMessageAt = new Date();
        chat.lastMessageSenderId = req.user._id;

        chat.totalMessages += 1;

        await chat.save();

        return res.status(201).json({
            success: true,
            message: "Message created successfully",
            data: newMessage
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create message"
        });
    }
};


// =========================================
// GET ALL MESSAGES
// =========================================
const getAllMessages = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 20,
            messageType,
            senderRole,
            search
        } = req.query;

        const query = {};

        if (messageType) {
            query.messageType = messageType;
        }

        if (senderRole) {
            query.senderRole = senderRole;
        }

        if (search) {
            query.message = {
                $regex: search,
                $options: "i"
            };
        }

        const messages = await Message.find(query)
            .populate("senderId", "name email profileImage")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Message.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            data: messages
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
};


// =========================================
// GET SINGLE MESSAGE
// =========================================
const getSingleMessage = async (req, res) => {

    try {

        const { messageId } = req.params;

        const message = await Message.findById(messageId)
            .populate("senderId", "name email profileImage")
            .populate("readBy.userId", "name email");

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: message
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch message"
        });
    }
};


// =========================================
// UPDATE MESSAGE
// =========================================
const updateMessage = async (req, res) => {

    try {

        const { messageId } = req.params;

        const {
            message,
            attachments,
            metadata
        } = req.body;

        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            {
                message,
                attachments,
                metadata,
                isEdited: true,
                editedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Message updated successfully",
            data: updatedMessage
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update message"
        });
    }
};


// =========================================
// DELETE MESSAGE
// =========================================
const deleteMessage = async (req, res) => {

    try {

        const { messageId } = req.params;

        const message = await Message.findByIdAndUpdate(
            messageId,
            {
                isDeleted: true,
                deletedAt: new Date(),
                message: "This message was deleted"
            },
            {
                new: true
            }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Message deleted successfully",
            data: message
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete message"
        });
    }
};


// =========================================
// MARK MESSAGE AS READ
// =========================================
const markMessageAsRead = async (req, res) => {

    try {

        const { messageId } = req.params;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        const alreadyRead = message.readBy.find(
            (item) =>
                item.userId.toString() === req.user._id.toString()
        );

        if (!alreadyRead) {

            message.readBy.push({
                userId: req.user._id,
                readAt: new Date()
            });

            await message.save();
        }

        return res.status(200).json({
            success: true,
            message: "Message marked as read",
            data: message
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to mark message as read"
        });
    }
};


// =========================================
// GET UNREAD MESSAGE COUNT
// =========================================
const getUnreadMessageCount = async (req, res) => {

    try {

        const unreadCount = await Message.countDocuments({
            "readBy.userId": {
                $ne: req.user._id
            },
            isDeleted: false
        });

        return res.status(200).json({
            success: true,
            unreadCount
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch unread message count"
        });
    }
};


module.exports = {
    createMessage,
    getAllMessages,
    getSingleMessage,
    updateMessage,
    deleteMessage,
    markMessageAsRead,
    getUnreadMessageCount
}