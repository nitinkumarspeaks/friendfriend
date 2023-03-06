// importing global modules
const express = require("express");
const app = express();
const Router = express.Router();


//Routing
Router.get("/",(req,res)=>{
    res.render("user/index");
})

Router.get("/register",(req,res)=>{
    res.render("user/register");
})

Router.post("/register",(req,res)=>{
    //res.render("user/index");
})

Router.get("/login",(req,res)=>{
    res.render("user/login");
})


module.exports = Router;