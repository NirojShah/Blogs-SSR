const express = require("express")
let app = express()
const userRouter = require("./routes/userRoutes")
const blogRouter = require("./routes/blogRoute")
const globalErrorController = require("./controllers/globalErrorController")
const CustomError = require("./Utils/CustomError")
const cors = require("cors")
const authorRouter = require("./routes/authorRoute")
const adminRouter = require("./routes/adminRoute")
const stripeRouter = require("./routes/stripeRoutes")
const bodyParser = require("body-parser")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const cookieSession = require("cookie-session")
const methodOverride = require("method-override")


// const auth = require("./middlewares/authMiddleware")


app.use(cookieParser())


// Register template engine
app.set("view engine","ejs")

app.use(
    cookieSession({
        name:"session",
        keys:["your-secret-key"],
        maxAge: 24*60*60*1000, // 24 hours
    })
)

app.use(bodyParser.urlencoded({extended:false}))

app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")[0]
    res.locals.error = req.flash("error")[0]
    next()
})

app.use(express.json())




// app.get("/add-cookies",(req,res)=>{
//     res.cookie("token","1057984443",{
//         maxAge:60*1000,
//         secure:true
//     })
//     res.end("hello")
// })

// app.get("/get-cookies",(req,res)=>{
//     res.send(req.cookies.token)
// })

// app.get("/delete-cookies",(req,res)=>{
//     res.cookie("token","",{
//         maxAge:1
//     })
//     res.send("deleted")
// })



app.get("/app/v1/welcome",(req,res)=>{
    res.render("welcome")
})

app.use(express.static("public"))


app.use(cors())



app.use(methodOverride("_method"))


// app.use(express.json())


app.use("/app/v1/user", userRouter)
app.use("/app/v1/author",authorRouter)
app.use("/app/v1/admin",adminRouter)

app.use("/app/v1/payment",stripeRouter)


// app.use("/app/v1/profile",auth,blogRoute) ==> we can pass here also
app.use("/app/v1/blogs", blogRouter)


// Exept above route any other route will throw error...

app.all("*", (req, res, next) => {

    // Inbuilt Error class.
    // let error = new Error("PAGE NOT FOUND") // PAGE NOT FOUND - is message. 
    // error.statusCode=404,
    // error.status = "FAILED"

    // next(error)  // used to throw errro..

    // Custom error class.
    let err = new CustomError(404, "PAGE NOT FOUND")
    next(err)

})


// GLOBAL ERROR Controller
app.use(globalErrorController)

module.exports = app