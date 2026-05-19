const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({

})


const invoiceModel = mongoose.model("Invoice", invoiceSchema);

module.exports = invoiceModel;