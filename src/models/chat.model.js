const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema({

})


const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;