const blogModel = require("../models/blog")
const ratingModel = require("../models/rating")
const userModel = require("../models/userModel")
const asyncErrorHandler = require("../Utils/asyncErrorHandler")
const {
    adminDashBoard
} = require("./admincontroller")
const {
    userDashBoard
} = require("./userController")

const postBlog = asyncErrorHandler(async (req, res) => {
    let user = req.user
    const newBlog = await blogModel.create({
        title: req.body.title,
        snippet: req.body.snippet,
        description: req.body.description,
        image: req.file,
        price:req.body.price,
        author: user._id
    })
    res.redirect("/app/v1/blogs/author")
    res.status(201).json({
        status: "success",
        data: {
            newBlog
        }
    })
})



const getBlog = asyncErrorHandler(async (req, res) => {
    let blog = await blogModel.findById(req.params.id).populate("author")
    let ratings = await ratingModel.find({
        blog: blog._id
    }).populate("user")

    if (req.user.role === "user") {
        res.locals.eachBlog = blog
        res.locals.ratings = ratings
        res.render("Blog")
    }
    if (req.user.role === "author") {
        res.locals.eachBlog = blog
        res.locals.ratings = ratings

        res.render("Author/ViewBlog")
    }

    if (req.user.role === "admin") {
        res.locals.eachBlog = blog
        res.locals.ratings = ratings
        res.render("Admin/EachBlog")
    }
})

const postRating = asyncErrorHandler(async (req, res) => {
    let user = req.user._id
    let blogid = req.params.id

    let duplicateRating = await ratingModel.findOne({
        user: user,
        blog: blogid
    })

    if (duplicateRating) {
        duplicateRating.ratings = req.body.ratings;
        await duplicateRating.save()
        return res.redirect("app/v1/blogs/rating/:id")
    }

    await ratingModel.create({
        ratings: req.body.ratings,
        user: user,
        blog: blogid
    })
    res.redirect("/app/v1/blogs/rating/:id")
})

// const getRating = asyncErrorHandler(async (req, res) => {
//     let blogId = req.params.id
//     const ratings = await ratingModel.find({
//         blogId: blogId
//     })
// })



const getBlogs = asyncErrorHandler(async (req, res) => {

    let page = req.query.page * 1 || 1 // *1 to convert string to number.
    let limit = req.query.limit * 1 || 4

    let skip = (page - 1) * limit // logic for skiping the page...

    let author = req.query.author || ""

    let search = req.query.search || "" // if search then value will get stored otherwise store empty string.

    // let sort = req.query.sort * 1 || -1

    let sort = req.query.sort || "rating" // default decending order... // sort=-rating accending order


    // rating,year // rating year

    sort && sort.split(",").join(" ")

    // let all_Blog = await blogModel.find({title:{$regex:search,$options:'i'}}).where("author").in([author]).skip(skip).limit(limit).sort({rating:rating});

    // let all_Blog = await blogModel.find({
    //     title: {
    //         $regex: search,
    //         $options: 'i'
    //     }
    // }).skip(skip).limit(limit).sort({
    //     "rating": sort
    // })

    let your_blogs = await blogModel.find({buyedBy:req.user._id})

    let all_Blog = await blogModel.find({
        title: {
            $regex: search,
            $options: 'i'
        },buyedBy:{
            $ne:req.user._id
        }
    }).populate("author").skip(skip).limit(limit).sort(sort)

    let topEight = await blogModel.find({
        title: {
            $regex: "",
            $options: 'i'
        }
    }).populate("author").limit(8).sort(sort)





    //  search logic...
    //  skip to skip no of items
    //  limit the output or response


    const totalBlog = await blogModel.countDocuments()

    if (req.user.role === "author") {

        let blogs = topEight
        let userBlogs = all_Blog
        res.render("AllBlogs", {
            your_blogs,
            userBlogs,
            blogs,
            page,
            limit,
            totalPages: Math.ceil(totalBlog / limit),
            previous: page - 1,
            next: page + 1
        })
    }

    if (req.user.role === "admin") {

        let blogs = topEight
        let userBlogs = all_Blog
        res.render("AllBlogs", {
            your_blogs,
            userBlogs,
            blogs,
            page,
            limit,
            totalPages: Math.ceil(totalBlog / limit),
            previous: page - 1,
            next: page + 1
        })
    }

    if (req.user.role === "user") {

        let blogs = topEight
        let userBlogs = all_Blog
        res.render("AllBlogs", {
            your_blogs,
            userBlogs,
            blogs,
            page,
            limit,
            totalPages: Math.ceil(totalBlog / limit),
            previous: page - 1,
            next: page + 1
        })
    }
})

const updateBlog = asyncErrorHandler(async (req, res) => {
    console.log(req.body)
    let payload = {
        ...req.body,
        image: req.file

    }

    let id = req.params.id

    const updated_blog = await blogModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    })
    res.redirect("/app/v1/blogs/" + id)

})

const deleteBlog = asyncErrorHandler(async (req, res) => {
    let id = req.params.id
    await blogModel.findByIdAndDelete(id)
    if (req.user.role === "author") {
        res.redirect("/app/v1/blogs/author")
    }
    if (req.user.role === "admin") {
        res.redirect("/app/v1/blogs")
    }

})

const getByAuthor = asyncErrorHandler(async (req, res) => {

    let user = req.user
    let author_Blog = await blogModel.find({
        author: user._id
    }).populate("author")
    res.locals.authorBlog = author_Blog

    res.render("Author/MyBlogs")

    // res.status(200).json({
    //     status: "success",
    //     data: {
    //         author_Blog
    //     }
    // })
})

const findAuthor = asyncErrorHandler(async (req, res) => {
    let authorId = req.params.id
    let authorData = await userModel.findById(authorId)
    res.status(201).json({
        status: "success",
        data: {
            name: authorData.name
        }
    })
})

const blogDashBoard = (req, res) => {
    if (req.user.role === "author") {
        res.render("Author/AuthorDash")
    }
    if (req.user.role === "admin") {
        res.render("Admin/AdminDash")
    }
    if (req.user.role === "user") {
        res.render("User/UserDash")
    }

}


const updatePage = asyncErrorHandler(async (req, res) => {
    let {
        id
    } = req.params
    let blog = await blogModel.findById(id)
    res.render("Author/UpdateBlog", {
        blog
    })
})



module.exports = {
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    postBlog,
    getByAuthor,
    postRating,
    // getRating,
    findAuthor,
    blogDashBoard,
    updatePage
}