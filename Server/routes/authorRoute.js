const express = require("express")
const {login,signup,getLogin,getSignup, logout} = require("../controllers/authorController")

const authorRouter = express.Router()

authorRouter.get("/signup",getSignup)
authorRouter.get("/login",getLogin)

authorRouter.post("/login",login)
authorRouter.post("/signup",signup)

authorRouter.get("/writeBlog",(req,res)=>{
    res.render("Author/PostBlog")
})

authorRouter.get("/logout",logout)


module.exports = authorRouter;