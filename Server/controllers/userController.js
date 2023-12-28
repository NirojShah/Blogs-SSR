const userModel = require("../models/userModel")
const asyncErrorHandler = require("../Utils/asyncErrorHandler")
const jwt = require("jsonwebtoken")
const CustomError = require("../Utils/CustomError")
const {
    loginWrapper,
    signupWrapper
} = require("../Utils/auth")

const genToken = async (id) => {
    return await jwt.sign({
        id: id
    }, process.env.JWT_SECRET, {
        expiresIn: 24 * 60 * 60 // one day
        // expiresIn: '1d'
    })
}

// let signup = asyncErrorHandler(async (req, res, next) => {
//     // verify whether user is present already...
//     const existingUser = await userModel.findOne({
//         email: req.body.email
//     })
//     // if (existingUser) {
//         // return (
//         // res.status(401).json({
//         //     status: "failed",
//         //     data: {
//         //         msg: "user exists already, try logging in."
//         //     }
//         // })
//         // )
//         // const err = new CustomError(401, "user exists already, try logging in.")
//         // next(err)


//     // }

//     let new_user = await userModel.create(
//         req.body
//     )
//     const token = genToken(new_user._id)
//     res.status(200).json({
//         status: "success",
//         token,
//         data: {
//             new_user
//         }
//     })
// })


// const login = asyncErrorHandler(async (req, res, next) => {
//     const existingUser = await userModel.findOne({
//         email: req.body.email
//     })

//     if (!existingUser || !await existingUser.comparePassword(req.body.password, existingUser.password)) {
//         // return res.status(400).json({
//         //     status: "failed",
//         //     data: {
//         //         msg: "you are not an existing user, please signup"
//         //     }
//         // })

//         const err = new CustomError(401, "you are not an existing user, please signup")
//         next(err)
//     }

//     let token = await genToken(existingUser._id)

//     res.status(200).json({
//         status: "success",
//         token,
//         data: {
//             existingUser
//         }
//     })
// })


const login = loginWrapper(userModel)
const signup = signupWrapper(userModel)


const getLogin = (req, res) => {
    res.render("User/loginUser")
}

const getSignup = (req, res) => {
    res.render("User/userSignup")
}

const logout = (req, res) => {
    res.cookie("jwt", "", {
        maxAge: 1
    })
    res.status(303).redirect("/app/v1/user/login")
}



const all_User = (async (req, res) => {
    try {
        let allUser = await userModel.find()
        res.status(200).json({
            status: "success",
            data: {
                allUser
            }
        })

    } catch (err) {
        res.status(400).json({
            status: "failed",
            data: {
                msg: err.message
            }
        })
    }
})

const get_user = async (req, res) => {
    try {
        let user = await userModel.findById(req.params.id)
        res.status(200).json({
            status: "success",
            data: {
                user
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "failed",
            data: {
                msg: err.message
            }
        })
    }
}

let updateProfile = async (req, res) => {
    try {

        let updated_profile = await userModel.findByIdAndUpdate(req.params.id, {
            ...req.body
        }, {
            new: true
        })
        res.status(200).json({
            status: "success",
            data: {
                updated_profile
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "failed",
            data: {
                msg: err.message
            }
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: "success",
            data: null
        })
    } catch (err) {
        res.status(400).json({
            status: "failed",
            data: {
                msg: err.message
            }
        })
    }
}



module.exports = {
    signup,
    all_User,
    get_user,
    updateProfile,
    deleteUser,
    login,
    getSignup,
    getLogin,
    logout
}