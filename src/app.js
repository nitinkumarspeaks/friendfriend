// importing global modules
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const hbs = require("hbs");


//importing local modules
require("./config/dbConnection");
const userRouter = require("./routes/userRouter");
const { hasSubscribers } = require("diagnostics_channel");

//variables
const PORT = process.env.PORT || 3000;

//midleware
const publicPath = path.join(__dirname,"../public")
console.log(publicPath)
app.use(express.static(publicPath));
app.set("view engine", "hbs"); // declaration of using handle bar view engine
app.set("views","src/templates/views"); // settign the path of view engine root folder
hbs.registerPartials(path.join(__dirname,"./templates/partials"))

app.use("/",userRouter)

//content

app.listen(PORT,()=>{
    console.log(`connecteed to the port:${PORT}`)
})
