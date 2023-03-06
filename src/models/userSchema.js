// importing Modules
const mongoose = require("mongoose");

// creating schema/ table structure
const userSchema = new mongoose.Schema({
    FirstName: {type: String, required:true},
    LastName: {type: String, required: true},
    Email: {type: String, required: true, unique},
    Password: {type: String, required: true},
    DisplayPhoto: {type: String, },
    DOJ: {type: Date, default: Date.now()}

})