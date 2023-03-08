// importing global modules
const express = require("express");
const app = express();
const Router = express.Router();
const bcrypt = require("bcrypt");

// Importing local modules
const userCollection = require("../models/userSchema");
const uploadDP = require("../config/configMulterForDP")


//Routing
Router.get("/",(req,res)=>{
    res.render("user/index");
})

Router.get("/register",(req,res)=>{
    res.render("user/register");
})

Router.post("/register",uploadDP.single("DP"),async (req,res)=>{
    try{
        const DP  = req.file.filename;
    console.log(DP);
    const userCollectionData = userCollection({
        FirstName: req.body.FName,
        LastName: req.body.LName,
        Email: req.body.Email,
        Password: req.body.Password,
        DisplayPhoto: DP,
    
    })
    
    await userCollectionData.save();

    res.render("user/index");
    }
    catch(error){
        console.log(error);
        res.render("user/register",{errMsg:"Registration Failed"});
    }
    
})

Router.get("/login",(req,res)=>{
    res.render("user/login");
})


Router.post("/login",async (req,res)=>{
    console.log(req.body.Email)
    try {
        
        const userCredentials = await userCollection.findOne({Email: req.body.Email});

    if(!!userCredentials)
    {
        const passMatch = await bcrypt.compare(req.body.password,userCredentials.Password);
        if(passMatch)
        {
            const token = await loginCreds.genAuthToken();
                            //console.log(token);
                            res.cookie("user",token);
            res.render("user/index");
        } else{

            res.status(500).render("user/login",{errMsg:"Invalid password"});
        }

    


    } else
    {
        res.status(500).render("user/login",{errMsg:"Invalid Email"});
    }
        
    } catch (error) {
        console.log(error);
        res.status(500).render("user/login",{errMsg:"coding error"});
    }
    
})
    
module.exports = Router;