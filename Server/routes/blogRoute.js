const express = require("express")
const {
    auth,
    verifyRole
} = require("../middlewares/authMiddleware")
const blogModel = require("../models/blog")
const {
    deleteBlog,
    getBlog,
    postBlog,
    updateBlog,
    getBlogs,
    getByAuthor,
    postRating,
    findAuthor,
    blogDashBoard,
    updatePage
} = require("../controllers/blogController")

const multer = require("multer")
const storage = require("../middlewares/multer")

const upload = multer({
    storage: storage
})



let blogRouter = express.Router()

blogRouter.get("/dashboard", auth, verifyRole(["user", "admin", "author"]), blogDashBoard)


blogRouter.get("/author", auth, getByAuthor)
blogRouter.post("/", auth, verifyRole(["author", "admin"]),upload.single("image"), postBlog)


blogRouter.get("/", auth, getBlogs)

blogRouter.get("/:id", auth, getBlog)

blogRouter.get("/update/:id",auth,verifyRole(["author"]),updatePage)
blogRouter.patch("/:id", auth, verifyRole(["author"]),upload.single("image"), updateBlog)

blogRouter.post("/rating/:id", auth, verifyRole(["user"]), postRating)
// blogRouter.get("/rating/:id", auth, verifyRole(["author", "user", "admin"]), getRating)
blogRouter.delete("/:id", auth, verifyRole(["admin", "author"]), deleteBlog)
blogRouter.get("/author/:id", auth, findAuthor)
module.exports = blogRouter