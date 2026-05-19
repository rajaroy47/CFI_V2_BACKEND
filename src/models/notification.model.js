const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

})


const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports = notificationModel;