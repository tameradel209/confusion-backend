const express = require('express')
const bodyParser = require('body-parser')
const Comments = require('../models/comments')
const cors  = require('./cors')
const authentication = require('../authentication')

const commentRouter = express.Router()

commentRouter.use(bodyParser.json())

commentRouter.route('/')

.get(cors.corsWithOptions, (req, res, next) =>{
    Comments.find(req.query).populate('author')
    .then(comments =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(comments)
    }).catch(err => next(err))
})

.post(cors.corsWithOptions, authentication.verifyUser, (req, res, next) =>{
    req.body.author = req.user._id
    Comments.create(req.body)
    .then(comment =>{
        Comments.findById(comment._id).populate('author')
        .then(comment =>{
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(comment)
        })
    }).catch(err => next(err))
})

.put(cors.corsWithOptions, authentication.verifyUser, (req, res, next) =>{
    res.statusCode = 403;
    res.end('PUT operation not supported')
})

.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Comments.remove({})
    .then(resp =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }).catch(err => next(err))
})

commentRouter.route('/:commentId')

.get(cors.corsWithOptions, (req, res, next) =>{
    Comments.findById(req.params.commentId).populate('author')
    .then(comment =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(comment)
    }).catch(err => next(err))
})

.post(cors.corsWithOptions, authentication.verifyUser, (req, res, next) =>{
    const err = new Error('POST operation is not supported')
    err.status = 403
    next(err)
})

.put(cors.corsWithOptions, authentication.verifyUser, (req, res, next) =>{
    Comments.findById(req.params.commentId)
    .then(comment =>{
        if(req.user._id.equals(comment.author)){
            Comments.findByIdAndUpdate(req.body)
            .then(resp =>{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            })
        }
        else{
            const err = new Error('you are not authorized to update this comment')
            err.status = 401
            next(err)
        }
    }).catch(err => next(err))
    
})

.delete(cors.corsWithOptions, authentication.verifyUser, (req, res, next) =>{
    Comments.findById(req.params.commentId)
    .then(comment =>{
        if(req.user._id.equals(comment.author)){
            Comments.findByIdAndDelete(req.params.commentId)
            .then(resp =>{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }) 
        }
        else{
            const err = new Error('you are not authorized to delete this comment')
            err.status = 401
            next(err)
        }
    }).catch(err => next(err))
    
})

module.exports = commentRouter