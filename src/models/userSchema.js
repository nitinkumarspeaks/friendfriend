// importing Modules
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// creating schema/ table structure
const userSchema = new mongoose.Schema({
    FirstName: {type: String, required:true},
    LastName: {type: String, required: true},
    Email: {type: String, required: true, unique:true},
    Password: {type: String, required: true},
    DisplayPhoto: {type: String, },
    DOJ: {type: Date, default: Date.now()},
    Followers: [{type: String}],
    Following: [{type: String}],
    tokens: [{type:String}]

})



// generating token

userSchema.methods.genAuthToken = async function()
{
    try {

        const token =  jwt.sign({id:this._id.toString()},process.env.SECERET_KEY);
        this.tokens = this.tokens.concat(token);
        await this.save();
        return token;
        
    } catch (error) {
        console.log(error)
        
    }
    
}

// hashing password
userSchema.pre("save",async function (next)
{
    if (!this.isModified('Password')) {
        next();
        return;
      }
        const hashPassword = await  bcrypt.hash(this.Password,10);
        this.Password = hashPassword;

        next();
})

const userCollection = mongoose.model("user",userSchema);

module.exports = userCollection;