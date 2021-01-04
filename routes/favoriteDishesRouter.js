const express = require('express')
const bodyParser = require('body-parser')
const authentication = require('../authentication')
const FavoriteDishes = require('../models/favorites')
const Dishes = require('../models/dishes')
const favoriteDishRouter = express.Router()

favoriteDishRouter.use(bodyParser.json())

favoriteDishRouter.route('/')

.get(authentication.verifyUser, (req, res, next) =>{
    FavoriteDishes.find({user: req.user._id}).populate(['user', 'dishes'])
    .then(favorites =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(favorites)
    })
    .catch(err => next(err))
})

.post(authentication.verifyUser, (req, res, next) =>{
    FavoriteDishes.findOne({user: req.user._id})
    .then(favorite =>{
        if(favorite){
            req.body.map(dish => {
                if(favorite.dishes.inexOf(dish) == -1){
                    favorite.dishes.push(dish)
                }
            })
            favorite.save()
            .then(resp =>{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            })
        }
        else{
            FavoriteDishes.create({
                user: req.user._id
            })
            .then(favorite =>{
                req.body.map(dish => {
                    if(favorite.dishes.inexOf(dish) == -1){
                        favorite.dishes.push(dish)
                    }
                })
                favorite.save()
                .then(resp =>{
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(resp)
                })
            })
        }
    }).catch(err => next(err))
})

.put(authentication.verifyUser, (req, res, next) =>{
    const err = new Error('PUT operation is not supported')
    err.status = 403
    next(err)
})

.delete(authentication.verifyUser, (req, res, next) =>{
    FavoriteDishes.findOneAndRemove({user:req.user._id})
    .then(resp =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    })
    .catch(err => next(err))
})


favoriteDishRouter.route('/:dishId')

.get(authentication.verifyUser, (req, res, next) =>{
    const err = new Error('PUT operation is not supported')
    err.status = 403
    next(err)
})

.post(authentication.verifyUser, (req, res, next) =>{
    FavoriteDishes.findById(req.params.dishId)
    .then(favorite =>{
        if(favorite){
            favorite.dishes.push(req.params.dishId)
            favorite.save()
            .then(resp =>{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            })
        }
        else{
            FavoriteDishes.create({
                user: req.user._id
            })
            .then(favorite =>{
                favorite.dishes.push(req.params.dishId)
                favorite.save()
                .then(resp =>{
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(resp)
                })
            })
        }
    }).catch(err => next(err))
})

.put(authentication.verifyUser, (req, res, next) =>{
    const err = new Error('PUT operation is not supported')
    err.status = 403
    next(err)
})

.delete(authentication.verifyUser, (req, res, next) =>{
    FavoriteDishes.findByIdAndDelete(req.params.dishId)
    .then(resp =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    })
    .catch(err => next(err))
})
module.exports = favoriteDishRouter