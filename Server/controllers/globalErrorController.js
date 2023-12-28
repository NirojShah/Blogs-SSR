const CustomError = require("../Utils/CustomError")

const devError = (req, res, err) => {
    // res.status(err.statusCode).json({
    //     status: err.status,
    //     message: err.message,
    //     error: err,
    //     errorStack: err.stack

    // })
    req.flash("sucess", err.message)
    const referringPage = req.header("Referer") || "/"
    res.redirect(referringPage)
}

const prodError = (req, res, err) => {
    if (err.isOperational === true) {
        // res.status(err.statusCode).json({
        //     status: err.status,
        //     data: {
        //         msg: err.message
        //     }
        // })

        req.flash("error", err.message)
        const referringPage = req.header("Referer") || "/"
        res.redirect(referringPage)

    } else {
        // res.status(err.statusCode).json({
        //     status: "failed",
        //     data: {
        //         msg: "Something went wrong"
        //     }
        // })

        req.flash("error", "Something went wrong. Please try again later.")
    }
}

const validationError = (err) => {
    let errArray = Object.values(err.errors)
    let msgArray = errArray.map(doc => doc.message)
    let msg = msgArray.join(" , ")
    let error = new CustomError(401, msg)
    return error
}

const duplicateErrorHandler = (err) => {
    let email = err.keyValue.email
    let msg = `the ${email} is already present`

    let error = new CustomError(401, msg)
    return error
}

const castError = (err) => {
    let value = err.value
    let error = new CustomError(400, `${value} invalid object id`)
    return error
}

const handleTokenExpiredError = (err) => {
    let msg = `${err.message} at ${err.expiredAt} please log in once again.`
    let error = new CustomError(403, msg)
    return error
}

const handleTypeError= (err)=>{
    console.log("first")
    return ""
}

const handleJsonWebTokenError = (err) => {
    let msg = `${err.message } please login once again`
    let error = new CustomError(403, msg)
    return error
}

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500
    err.status = err.status || "ERROR!!!"

    if (process.env.NODE_ENV === "development") {
        devError(req, res, err)
    }

    if (process.env.NODE_ENV === "production") {
        if (err.name == "ValidationError") {
            err = validationError(err)
        }
        if (err.code === 11000) {
            err = duplicateErrorHandler(err)
        }
        if (err.name === "CastError") {
            err = castError(err)
        }
        if (err.name === "TokenExpiredError") {
            err = handleTokenExpiredError(err)
        }
        if (err.name === "JsonWebTokenError") {
            err = handleJsonWebTokenError(err)
        }
        if(err.name === "TypeError"){
            err = handleTypeError(err)
        }
        prodError(req, res, err)
    }
}