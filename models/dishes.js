const mongoose = require('mongoose')

const Schema = mongoose.Schema

const DishSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    label:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true
    },
    featured:{
        type: Boolean,
        default: false
    },
    description:{
        type: String,
        required: true
    }
}, {
    timestamps: true
})

var Dishes = mongoose.model('Dish', DishSchema)
module.exports = Dishes