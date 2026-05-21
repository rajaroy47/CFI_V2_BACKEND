const express = require("express");
const router = express.Router();

const {
    createMessage,
    getAllMessages,
    getSingleMessage,
    updateMessage,
    deleteMessage,
    markMessageAsRead,
    getUnreadMessageCount

} = require("../controllers/message.controller.js");


// =========================================
// CREATE MESSAGE
// =========================================
router.post("/create", createMessage);


// =========================================
// GET ALL MESSAGES
// =========================================
router.get("/all", getAllMessages);


// =========================================
// GET SINGLE MESSAGE
// =========================================
router.get("/:messageId", getSingleMessage);


// =========================================
// UPDATE MESSAGE
// =========================================
router.put("/update/:messageId", updateMessage);


// =========================================
// DELETE MESSAGE
// =========================================
router.delete("/delete/:messageId", deleteMessage);


// =========================================
// MARK MESSAGE AS READ
// =========================================
router.patch("/read/:messageId", markMessageAsRead);


// =========================================
// GET UNREAD MESSAGE COUNT
// =========================================
router.get("/unread/count", getUnreadMessageCount);


module.exports = router;