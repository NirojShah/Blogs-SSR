const asyncErrorHandler = require("../Utils/asyncErrorHandler")
const jwt = require("jsonwebtoken")
const CustomError = require("../Utils/CustomError")

const genToken = async (id) => {
    return await jwt.sign({
        id: id
    }, process.env.JWT_SECRET, {
        expiresIn: 24 * 60 * 60 // one day
        // expiresIn: '1d'
    })
}

let signupWrapper = (Model) => {
    return asyncErrorHandler(async (req, res, next) => {
        // verify whether user is present already...
        const existingUser = await Model.findOne({
            email: req.body.email
        })
        // if (existingUser) {
        // return (
        // res.status(401).json({
        //     status: "failed",
        //     data: {
        //         msg: "user exists already, try logging in."
        //     }
        // })
        // )
        // const err = new CustomError(401, "user exists already, try logging in.")
        // next(err)


        // }
        let new_user = await Model.create(
            req.body
        )
        const token = genToken(new_user._id)

        res.cookie("jwt", token, {
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            httpOnly: true
        })

        res.status(200).json({
            status: "success",
            token,
            data: {
                new_user
            }
        })
    })
}


const loginWrapper = (Model) => {
    return asyncErrorHandler(async (req, res, next) => {
        const existingUser = await Model.findOne({
            email: req.body.email
        })


        if (!existingUser || !await existingUser.comparePassword(req.body.password, existingUser.password)) {
            const err = new CustomError(401, "you are not an existing user, please signup")
            next(err)
        }

        let token = await genToken(existingUser._id)

        res.cookie("jwt", token, {
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            httpOnly: true
        })
        res.status(303).redirect("/app/v1/blogs/dashboard")
    })
}

module.exports = {
    loginWrapper,
    signupWrapper
}