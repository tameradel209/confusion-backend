const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FavoriteDishSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[{
        type: Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {timestamps: true})

const Favorites = mongoose.model('Favorite', FavoriteDishSchema)

module.exports = Favorites