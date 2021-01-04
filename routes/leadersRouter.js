const express = require('express')
const bodyParser = require('body-parser')
const Leaders = require('../models/leaders')
const authentication = require('../authentication')
const cors = require('./cors')

const leadersRouter = express.Router()

leadersRouter.use(bodyParser.json())

leadersRouter.route('/')
.options(cors.corsWithOptions, (req, res) =>{res.sendStatus(200)})

.get(cors.cors, (req, res, next) =>{
    Leaders.find({})
    .then(leader =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
    }, err => next(err))
    .then(err => next(err))
})

.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Leaders.create(req.body)
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
    Leaders.remove({})
    .then(resp =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, err => next(err))
    .then(err => next(err))
})

leadersRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) =>{res.sendStatus(200)})

.get(cors.cors, (req, res, next) =>{
    Leaders.findById(req.params.leaderId)
    .then(leader =>{
        if(leader != null){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(leader)            
        }
        else{
            const err = new Error('leader with id: '+ req.params.leaderId+ ' not found')
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
    Leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new: true})
    .then(leader =>{
        if(leader){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(leader)            
        }
        else{
            const err = new Error('leader with id: '+ req.params.leaderId+ ' not found')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .then(err => next(err))
})

.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then(resp =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, err => next(err))
    .then(err => next(err))
})
module.exports = leadersRouter