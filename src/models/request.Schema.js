// Importing Modules
const mongoose = require("mongoose");

// Creating schema
const requestSchema = new mongoose.Schema({

    SentBy: {type: String, required: true},
    Receiver: {type: String, required: true},
    Date: {type: Date, default: Date.now()}
})

// Modeling collection

const requestCollection = mongoose.model("FriendRequest",requestSchema);

// exporting module

module.exports = requestCollection;