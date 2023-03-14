const jwt = require("jsonwebtoken");
const userCollection = require("../models/userSchema");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const Auth = async (req, res, next)=>
{
    try
    {
        const token = req.cookies.user;

        if(!token) {
            return res.redirect('login');
        }

        const verifyUser = jwt.verify(token,process.env.SECERET_KEY)
        //console.log("auth page")
        //console.log(verifyUser)
        //console.log(token)
        const userData = await userCollection.findById({_id:verifyUser.id})
        //console.log(userData)
        req.token = token
        req.user = userData
        next()
    }
    catch(e) {console.log(e)
    res.redirect("login")}
}


module.exports = Auth;

