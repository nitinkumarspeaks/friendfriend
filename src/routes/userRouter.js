// importing global modules
const express = require("express");
const app = express();
const Router = express.Router();
const bcrypt = require("bcrypt");


// Importing local modules
const userCollection = require("../models/userSchema");
const uploadDP = require("../config/configMulterForDP"); // Multer configuration to upload files
const auth = require("../middleware/auth") // Authentication middleware. user can not visit without logging in
const requestCollection = require("../models/request.Schema");


//Routing
Router.get("/",auth, (req,res)=>{
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
        const passMatch = await bcrypt.compare(req.body.Password,userCredentials.Password);
        if(passMatch)
        {
            const token = await userCredentials.genAuthToken();
            console.log(token)
            res.cookie("user",token)
                            //console.log(token);
                            res.cookie("user",token);
            res.redirect("/");
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

Router.get("/search", (req,res)=>{
    res.render("user/search");

})

Router.post("/search", auth, async (req,res)=>{
    try {
        
        const searchFriendsData =await  userCollection.find({$or: [{FirstName:{$regex: req.body.searchKey, $options:'i'}},
                                                         {LastName:{$regex: req.body.searchKey, $options:'i'}}
                                                        ]});
        //searchFriendsData = searchFriendsData.filter( req.user);
        const searchFriendsDataMinusCurrentUser = [];
        console.log(searchFriendsData.length)
        for(var i=0;i<searchFriendsData.length; i++)
        {
            console.log(i)
            if(searchFriendsData[i]._id != req.user.id)
            {
                searchFriendsDataMinusCurrentUser[i] = searchFriendsData[i];
            }

        }
        
        
    res.render("user/search", {searchdata: searchFriendsDataMinusCurrentUser});                                                 
        
    } catch (error) {
        res.send(error);
    }

})

Router.get("/otherProfile/:uid",auth, async (req,res)=>{
    try {
        const userId = req.params.uid;
        const loggedInUser = req.user.id;
        let  friendButtonValue = "" ;
        let  actionPageValue= "";
        
        
    const userData = await userCollection.findOne({_id:userId})
    //console.log(userData)
        if(!!userData){
            // checking the 3 conditions if the loggedin user is friend with other profile user 
            //a) already friend b) request pending c) send a request
            
            
            if(await userCollection.findOne({ $and: [{id:loggedInUser},{Followers:userId}]}))
            {
                friendButtonValue = "Already Friend/ unfriend";
                actionPageValue = "unFriend";
                
            } else if((await requestCollection.findOne({$and: [{SentBy:loggedInUser},{Receiver:userId}]})))
                {
                    friendButtonValue = "Request Pending/ Delete Request";
                    actionPageValue = "deleteRequest";
                } else { friendButtonValue = "Sent a friend request";
                        actionPageValue = "addRequest";
            }


            res.render("user/otherProfile",{userData,friendButtonValue,actionPageValue})
        } else
        {
            res.render("user/otherProfile",{errMsg: "User Not Found"})
        }
    
        
    } catch (error) {
        console.log(error)
        res.render("user/otherProfile",{errMsg: "error 404"})
    }
    
})

Router.post("/addRequest/:uid",auth, async (req,res)=>{
    try {
        const sendrequestTo = req.params.uid;

        const requestData = new requestCollection({
            SentBy: req.user.id,
            Receiver: sendrequestTo
        });
        await requestData.save();
        res.redirect("/otherProfile/"+sendrequestTo)
    
    
        
    } catch (error) {
        console.log(error)
    }
    
})
    
Router.post("/deleteRequest/:uid",auth, async (req,res)=>{
    try {
        const uid = req.params.uid;
        const loggedinUser = req.user._id;
        const deletedRequest = await requestCollection.deleteOne({$and: [{SentBy:loggedinUser},{Receiver:uid}]})

        
        res.redirect("/otherProfile/"+uid)
    
    
        
    } catch (error) {
        console.log(error)
    }
    
})
module.exports = Router;