const express = require('express')
const bodyParser = require('body-parser')
const Promos = require('../models/promos')
const authentication = require('../authentication')
const cors = require('./cors')

const promosRouter = express.Router()

promosRouter.use(bodyParser.json())

promosRouter.route('/')
.options(cors.corsWithOptions, (req, res) =>{res.sendStatus(200)})

.get(cors.cors, (req, res, next) =>{
    Promos.find({})
    .then(promos =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promos)
    }, err => next(err))
    .then(err => next(err))
})

.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Promos.create(req.body)
    .then(resp =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, err => next(err))
    .then(err => next(err))
})

.put(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    res.statusCode = 403
    res.end('Put operation not allowed !')
})

.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Promos.remove({})
    .then(resp =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, err => next(err))
    .then(err => next(err))
})

promosRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) =>{res.sendStatus(200)})

.get(cors.cors, (req, res, next) =>{
    Promos.findById(req.params.promoId)
    .then(promo =>{
        if(promo != null){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(promo)            
        }
        else{
            const err = new Error('promo with id: '+ req.params.promoId+ ' not found')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .then(err => next(err))
})

.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    res.statusCode = 403
    res.end('Post operation not allowed !')
})

.put(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Promos.findByIdAndUpdate(req.params.promoId, {$set: req.body}, {new: true})
    .then(promo =>{
        if(promo){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(promo)            
        }
        else{
            const err = new Error('promo with id: '+ req.params.promoId+ ' not found')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .then(err => next(err))
})

.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Promos.findByIdAndDelete(req.params.promoId)
    .then(resp =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, err => next(err))
    .then(err => next(err))
})

module.exports = promosRouter