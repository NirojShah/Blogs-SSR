const express = require("express")
const {
    signup,
    all_User,
    get_user,
    updateProfile,
    deleteUser,
    getLogin,
    getSignup,
    logout,
    login
} = require("../controllers/userController")


const userRouter = express.Router()


userRouter.get("/signup", getSignup)
userRouter.get("/login", getLogin)

userRouter.post("/signup", signup)
userRouter.post("/login", login)


userRouter.get("/logout",logout)


userRouter.get("/", all_User)
userRouter.get("/:id", get_user)
userRouter.patch("/:id", updateProfile)
userRouter.delete("/:id", deleteUser)


module.exports = userRouter