const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LeadersSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true
    },
    designation:{
        type: String,
        required: true
    },
    abbr:{
        type: Number,
        required: true
    },
    featured:{
        type: Boolean,
        default: false,
    },
    description:{
        type: String,
        required: true
    }
}, {timestamps: true})

const Leaders = mongoose.model('Leader', LeadersSchema)

module.exports = Leaders