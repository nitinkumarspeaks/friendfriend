const multer = require("multer");
const path = require("path")

const storageEngine = multer.diskStorage(
{
    destination: "./public/data/DP",
    
    filename: (req, file, cb)=>{cb(null, `${Date.now()}--${file.originalname}`)}
})

const checkFileName = (file, cb)=>
{
    const fileTypes = /jpeg|jpg|png|sng/; // allowed file extensions

    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimeType)
    if (mimeType && extName) {
            return cb(null, true);
          } else {
            cb("Error: You can Only Upload Images!!");}
}

const uploadImages = multer({storage: storageEngine, limits: {fileSize:100000}, 
    //fileFilter: (req,file,cb)=>{checkFileName}
   
})

module.exports = uploadImages