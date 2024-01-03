const userModel = require("./userModel")


const {
    model,
    Schema
} = require("mongoose")


const blogSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Title is required"]
    },
    snippet: {
        type: String,
        trim: true,
        required: [true, "Snippet is required"],
    },
    description: {
        type: String,
        trim: true,
        required: [true, "Description is required"]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "author",
        required: [true, "Author is required"]

    },
    image: {
        type: [""],
        default: "https://digitalmarketerschicago.com/wp-content/uploads/2019/07/difference-between-blogs-and-landing-pages.jpg"
    },
    rating: {
        type: Number,
        required: [true, "rating"],
        default: 1,
        min: [1, "please enter above 1"],
        max: [5, "please enter below 5"],
        validator: {
            validate: function (value) {
                if (userModel.role !== "user") {
                    return value >= 1 && value <= 5;
                }
            },
            message: "Rating should be between 1 to 5"
        }
    },
    price: {
        type: Number,
        default: 0,
        max: [199, "Please Enter Below 199 rupees"]
    },
    buyedBy: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }]
})

module.exports = model("blog", blogSchema)