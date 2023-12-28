const {Schema,model} = require("mongoose")
const UserModel = require("./userModel")
const blogModel = require("./blog")

let ratingSchema = new Schema({
    ratings:{
        type:Number,
        min:[1,"please provide rating above 1"],
        max:[5,"please provide rating below 5"],
        default:1
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"user" // collection name where userId will stored
    },
    blog:{
        type:Schema.Types.ObjectId,
        ref:"blog" // collection name where blogId will stored
    },
    date:{
        type:Date,
        default:Date.now()
    }
})


module.exports = model("rating",ratingSchema)