const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const jwtStrategy = require('passport-jwt').Strategy
const jwtExtract = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const facebookStrategy = require('passport-facebook-token')
const Users = require('./models/users')
const config = require('./config')

exports.local = passport.use(new localStrategy(Users.authenticate()))
passport.serializeUser(Users.serializeUser())
passport.deserializeUser(Users.deserializeUser())

exports.getToken = (user) =>{
    return jwt.sign(user, config.secretKey, {expiresIn:3600})
}

var options = {}

options.secretOrKey = config.secretKey
options.jwtFromRequest = jwtExtract.fromAuthHeaderAsBearerToken(),



exports.jwtPassport = passport.use(new jwtStrategy(options, (jwt_payload, done) =>{
    console.log('jwt payload: ', jwt_payload)
    Users.findById(jwt_payload._id, (err, user) =>{
        if(err){return done(err, false)}
        else if(user){return done(null, user)}
        else{return done(null, false)}
    })
}))

exports.verifyUser = passport.authenticate('jwt', {session: false})

exports.verifyAdmin = (req, res, next) =>{
    if(req.user.admin){
        return next()
    }
    const err = new Error('you are not authorized to do this operation')
    err.status = 403
    next(err)
}

exports.facebookPassport = passport.use(new facebookStrategy({
    clientID: config.facebook.appId,
    clientSecret: config.facebook.appSecret,
}, (accessToken, refreshToken, profile, done) =>{
    Users.findOne({facebookId: profile.id}, (err, user) =>{
        if(err){return done(err, false)}
        if(user != null){return done(null, user)}
        else{
            user = new Users({
                username: profile.displayName,
                facebookId: profile.id,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName
            })
            user.save((err, user) =>{
                if(err){return done(err, false)}
                else{return done(null, user)}
            })
        }
    })
}))