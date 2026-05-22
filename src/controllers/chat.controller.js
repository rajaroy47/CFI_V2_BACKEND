const Chat = require("../models/chat.model");


// =========================================
// CREATE CHAT
// =========================================
const createChat = async (req, res) => {

    try {

        const {
            applicationId,
            participants,
            chatType,
            metadata
        } = req.body;

        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: "Application ID is required"
            });
        }

        const existingChat = await Chat.findOne({
            applicationId
        });

        if (existingChat) {
            return res.status(400).json({
                success: false,
                message: "Chat already exists for this application"
            });
        }

        const chat = await Chat.create({
            applicationId,
            participants,
            chatType,
            metadata,
            createdBy: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Chat created successfully",
            data: chat
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create chat"
        });
    }
};


// =========================================
// GET ALL CHATS
// =========================================
const getAllChats = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 10,
            chatType,
            isArchived,
            search
        } = req.query;

        const query = {};

        if (chatType) {
            query.chatType = chatType;
        }

        if (isArchived !== undefined) {
            query.isArchived = isArchived;
        }

        if (search) {
            query.lastMessage = {
                $regex: search,
                $options: "i"
            };
        }

        const chats = await Chat.find(query)
            .populate("applicationId")
            .populate("participants", "name email")
            .populate("lastMessageSenderId", "name email")
            .populate("createdBy", "name email")
            .sort({ lastMessageAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Chat.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            data: chats
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch chats"
        });
    }
};

// =========================================
// GET SINGLE CHAT
// =========================================
const getSingleChat = async (req, res) => {

    try {

        const { chatId } = req.params;

        const chat = await Chat.findById(chatId)
            .populate("applicationId")
            .populate("participants", "name email profileImage")
            .populate("lastMessageSenderId", "name email")
            .populate("createdBy", "name email");

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: chat
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch chat"
        });
    }
};


// =========================================
// SEND MESSAGE
// =========================================
const sendMessage = async (req, res) => {

    try {

        const { chatId } = req.params;

        const {
            message,
            messageType,
            attachments,
            metadata
        } = req.body;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        const newMessage = {
            senderId: req.user._id,
            message,
            messageType,
            attachments,
            metadata,
            createdAt: new Date()
        };

        chat.messages.push(newMessage);

        chat.lastMessage = message;
        chat.lastMessageAt = new Date();
        chat.lastMessageSenderId = req.user._id;

        chat.totalMessages += 1;

        await chat.save();

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
};


// =========================================
// GET CHAT MESSAGES
// =========================================
const getChatMessages = async (req, res) => {

    try {

        const { chatId } = req.params;

        const chat = await Chat.findById(chatId)
            .populate("messages.senderId", "name email");

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        return res.status(200).json({
            success: true,
            totalMessages: chat.totalMessages,
            data: chat.messages
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
// ARCHIVE CHAT
// =========================================
const archiveChat = async (req, res) => {

    try {

        const { chatId } = req.params;

        const chat = await Chat.findByIdAndUpdate(
            chatId,
            {
                isArchived: true,
                archivedAt: new Date()
            },
            {
                new: true
            }
        );

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chat archived successfully",
            data: chat
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to archive chat"
        });
    }
};


// =========================================
// BLOCK CHAT
// =========================================
const blockChat = async (req, res) => {

    try {

        const { chatId } = req.params;

        const { blockedReason } = req.body;

        const chat = await Chat.findByIdAndUpdate(
            chatId,
            {
                isBlocked: true,
                blockedBy: req.user._id,
                blockedReason
            },
            {
                new: true
            }
        );

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chat blocked successfully",
            data: chat
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to block chat"
        });
    }
};


// =========================================
// UNBLOCK CHAT
// =========================================
const unblockChat = async (req, res) => {

    try {

        const { chatId } = req.params;

        const chat = await Chat.findByIdAndUpdate(
            chatId,
            {
                isBlocked: false,
                blockedBy: null,
                blockedReason: null
            },
            {
                new: true
            }
        );

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chat unblocked successfully",
            data: chat
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to unblock chat"
        });
    }
};


// =========================================
// DELETE CHAT
// =========================================
const deleteChat = async (req, res) => {

    try {

        const { chatId } = req.params;

        const chat = await Chat.findByIdAndDelete(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete chat"
        });
    }
};


module.exports = {
    createChat,
    getAllChats,
    getSingleChat,
    sendMessage,
    getChatMessages,
    archiveChat,
    blockChat,
    unblockChat,
    deleteChat
}