const multer = require("multer")

let storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"public/uploads")
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname)
    }
})

module.exports = storage