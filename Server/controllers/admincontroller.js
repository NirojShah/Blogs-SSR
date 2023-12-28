const {loginWrapper,signupWrapper} = require("../Utils/auth")
const adminModel = require("../models/adminModel")


const login = loginWrapper(adminModel)

const signup = signupWrapper(adminModel)

const getLogin = (req,res)=>{
    res.render("Admin/loginAdmin")
}
const getSignup = (req,res)=>{
    res.render("Admin/adminSignup")
}

const logout = (req,res)=>{
    res.cookie("jwt","",{
        maxAge:1
    })
    res.status(303).redirect("/app/v1/admin/login")
}


module.exports = {
    login,
    signup,
    getLogin,
    getSignup,
    logout
}