const {Schema,model} = require("mongoose")

const questionSchema = new Schema({
    question:{
        type:String,
        require:[true,"Question Can't be Empty."],
        trim:true,
        min:[10,"Minimum Character should be 10."],
        max:[100,"Max Charater should be 100"]
    },
    askedBy:{
        type:Schema.Types.ObjectId,
        require:true,
        ref:"user"
    }
})


module.exports = model("questions",questionSchema)