// importing global modules
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");


//importing local modules
require("./config/dbConnection");
const userRouter = require("./routes/userRouter");


//variables
const PORT = process.env.PORT || 3000;

//midleware
const publicPath = path.join(__dirname,"../public")
app.use(express.static(publicPath));
app.set("view engine", "hbs"); // declaration of using handle bar view engine
app.set("views","src/templates/views"); // settign the path of view engine root folder
app.use(express.urlencoded({extended: true}));
app.use(express.json());
hbs.registerPartials(path.join(__dirname,"./templates/partials"))
app.use(cookieParser())

app.use((req,res,next)=>{
     
        if(!!req.cookies.user)
        {
        //console.log("hello from middlewae")
        res.locals.is_authenticated = !!req.cookies.user;
        }
       else
       {
       res.locals.is_authenticated = false;
       }
        next();
     
    //console.log(res.locals)
   // res.locals.is_authenticated = !!req.cookies.jwt;
    
})


app.use("/",userRouter);
app.use((req,res)=>{
    res.status(404).send("<h1>page not found</h1>")
}) 


//content

app.listen(PORT,()=>{
    console.log(`connecteed to the port:${PORT}`)
})
