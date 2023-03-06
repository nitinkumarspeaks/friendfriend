// importing global modules
const express = require("express");
const app = express();
const Router = express.Router();


//Routing
Router.get("/",(req,res)=>{
    res.render("user/index");
})


module.exports = Router;