const http = require("http")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = require("./app")

dotenv.config({
    path: ".env"
})

let PORT = process.env.PORT
let MONGOLOCAL_URL = process.env.MONGOLOCAL_URL

mongoose.connect(MONGOLOCAL_URL).then(() => {
    console.log("DB CONNECTED..")
}).catch((err) => {
    console.log(err)
})

//some

const server = http.createServer(app)

server.listen(PORT, (err) => {
    if (err) console.log(err)
    console.log("STARTED AT PORT NO. : " + PORT)
})