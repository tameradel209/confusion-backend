const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstname:{
        type: String,
        default: ''
    },
    lastname:{
        type: String,
        default: ''
    },
    facebookId:{
        type: String,
    },
    admin:{
        type: Boolean,
        default: false
    }
})

//this will create username and password in encrypted form
UserSchema.plugin(passportLocalMongoose)

const Users = mongoose.model('User', UserSchema)

module.exports = Users