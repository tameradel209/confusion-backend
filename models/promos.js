const mongoose = require('mongoose')
const currency = require('mongoose-currency')

const Schema = mongoose.Schema

const PromosSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true
    },
    label:{
        type: String,
        required: true
    },
    price:{
        type: currency,
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

const Promos = mongoose.model('Promo', PromosSchema)

module.exports = Promos