const express = require("express");
const {login,signup,logout, getLogin, getSignup} = require("../controllers/admincontroller")


const adminRoute = express.Router()


adminRoute.get("/login",getLogin)
adminRoute.get("/signup",getSignup)

adminRoute.post("/login",login)
adminRoute.post("/signup",signup)

adminRoute.get("/logout",logout)




module.exports = adminRoute