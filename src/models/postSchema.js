// Importing Modules
const mongoose = require("mongoose");

// creating schema
const postSchema = new mongoose.schema({
    Content: {type: String, required: true},
    Creater: {type: String, required: true},
    DOC: {type: Date, dafault: Date.now()}
})


//modeling collection
const postCollection = mongoose.model("post",postSchema);

// exporting module

module.exports = postCollection;