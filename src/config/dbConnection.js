//Importing modules
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/friendfriend",{
    useUnifiedTopology: true,
    useNewUrlParser: true
}); //passing the connection string

// checking the status of connection
const db = mongoose.connection
db.on("failed",()=>{
    console.log("could not connect to database");
}) 

db.once("connected",()=>{
    console.log("connected to database");
})
