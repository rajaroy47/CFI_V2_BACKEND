const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chat.controller");


// =========================================
// CREATE CHAT
// =========================================
router.post(
    "/create",
    chatController.createChat
);


// =========================================
// GET ALL CHATS
// =========================================
router.get(
    "/all",
    chatController.getAllChats
);


// =========================================
// GET SINGLE CHAT
// =========================================
router.get(
    "/:chatId",
    chatController.getSingleChat
);


// =========================================
// SEND MESSAGE
// =========================================
router.post(
    "/send-message/:chatId",
    chatController.sendMessage
);


// =========================================
// GET CHAT MESSAGES
// =========================================
router.get(
    "/messages/:chatId",
    chatController.getChatMessages
);


// =========================================
// ARCHIVE CHAT
// =========================================
router.patch(
    "/archive/:chatId",
    chatController.archiveChat
);


// =========================================
// BLOCK CHAT
// =========================================
router.patch(
    "/block/:chatId",
    chatController.blockChat
);


// =========================================
// UNBLOCK CHAT
// =========================================
router.patch(
    "/unblock/:chatId",
    chatController.unblockChat
);


// =========================================
// DELETE CHAT
// =========================================
router.delete(
    "/delete/:chatId",
    chatController.deleteChat
);


module.exports = router;