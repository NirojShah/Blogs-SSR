const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport")

const userGoogleModel = require("./Models/User")


passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/google/redirect"
    },
    async function (accessToken, refreshToken, profile, cb) {

        const existingUser = await userGoogleModel.findOne({
            id: profile.id
        })

        if (existingUser) {
            console.log("Existing user",existingUser)
            return cb(null, existingUser)
        }
        const newUser = await userGoogleModel.create({
            name: profile.displayName,
            id: profile.id
        })
        cb(null, newUser)

    }
));


passport.serializeUser(function (user, done) {
    done(null, user.id)
    console.log("Serializeuser",user)
})

// passport.deserializeUser(async function(id,done){
//     console.log(id);
// })

passport.deserializeUser(async function(id ,done){
    console.log("jjfjjf")
})