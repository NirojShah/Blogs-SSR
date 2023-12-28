const {loginWrapper,signupWrapper} = require("../Utils/auth")
const authorModel = require("../models/authorModel")


const login = loginWrapper(authorModel)

const signup = signupWrapper(authorModel)

const getLogin = (req,res)=>{
    res.render("Author/loginAuthor")
}

const getSignup = (req,res)=>{
    res.render("Author/authorSignup")
}

const logout = (req,res)=>{
    res.cookie("jwt","",{
        maxAge:1
    })
    res.status(303).redirect("/app/v1/author/login")
}


module.exports = {
    login,
    signup,
    getSignup,
    getLogin,
    logout
}
