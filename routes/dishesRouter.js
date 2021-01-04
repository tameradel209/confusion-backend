const express = require('express')
const bodyParser = require('body-parser')
const Dishes = require('../models/dishes')
const authentication = require('../authentication')
const cors = require('./cors')

const dishesRouter = express.Router()

dishesRouter.use(bodyParser.json())


dishesRouter.route('/')
.options(cors.corsWithOptions, (req, res) =>{res.sendStatus(200)})

.get(cors.cors, (req, res, next) =>{
    Dishes.find({}).populate('comments.author')
    .then(dishes =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    }, err => next(err))
    .catch(err => next(err))
})

.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Dishes.create(req.body)
    .then(resp =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, err => next(err))
    .catch(err => next(err))
})

.put(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    res.statusCode = 403
    res.end('Put operation not allowed !')
})

.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Dishes.remove({})
    .then(resp =>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, err = next(err))
    .then(err => next(err))
})

dishesRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) =>{res.sendStatus(200)})

.get(cors.cors, (req, res, next) =>{
    Dishes.findById(req.params.dishId).populate('comments.author')
    .then(dish =>{
        if(dish != null){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }
        else{
            const err = new Error('dish with id: '+req.params.dishId+' not found')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
})

.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    res.statusCode = 403
    res.end('Post operation not supported')
})

.put(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Dishes.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new: true})
    .then(dish =>{
        if(dish){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)            
        }
        else{
            const err = new Error('dish with id: '+req.params.dishId+' not found')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
})

.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Dishes.findByIdAndDelete(req.params.dishId)
    .then(resp =>{
        if(resp){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)            
        }
        else{
            const err = new Error('dish with id: '+req.params.dishId+' not found')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
})

dishesRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) =>{res.sendStatus(200)})

.get(cors.cors, (req, res, next) =>{
    Dishes.findById(req.params.dishId).populate('comments.author')
    .then(dish =>{
        if(dish != null){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish.comments)
        }
        else{
            err = new Error('dish with id: '+req.params.dishId+' not found ')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .then(err => next(err))
})

.post(cors.corsWithOptions, authentication.verifyUser, (req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .then(dish =>{
        if(dish != null){
            req.body.author = req.user._id
            dish.comments.push(req.body)
            dish.save()
            .then(dish =>{
                Dishes.findById(dish._id).populate('comments.author')
                .then(dish =>{
                    console.log(dish)
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish.comments)
                })
            })
        }
        else{
            err = new Error('dish with id: '+req.params.dishId+' not found ')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
})

.put(cors.corsWithOptions, authentication.verifyUser, (req, res, next) =>{
    res.statusCode = 403
    res.end('put operation is not supported!!!')
})

.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .then(dish =>{
        if(dish != null){
            for(i=(dish.comments.length-1); i>=0; i--){
                dish.comments.id(dish.comments[i]._id).remove()
            }
            dish.save()
            .then(resp =>{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            })
            .catch(err => next(err))
        }
        else{
            err = new Error('dish with id: '+req.params.dishId+' not found ')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
})

dishesRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) =>{res.sendStatus(200)})

.get(cors.cors, (req, res, next) =>{
    Dishes.findById(req.params.dishId).populate('comments.author')
    .then(dish =>{
        if(dish != null){
            const comment = dish.comments.id(req.params.commentId)
            if(comment != null){
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(comment)
            }
            else{
                err = new Error('comment with id: '+req.params.commentId+' not found ')
                err.status = 404
                return next(err)
            }
        }
        else{
            err = new Error('dish with id: '+req.params.dishId+' not found ')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
})

.post(cors.corsWithOptions, authentication.verifyUser, (req, res, next) =>{
    res.statusCode = 200
    res.end('post operation is not supported !!!')
})

.put(cors.corsWithOptions, authentication.verifyUser, (req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .then(dish =>{
        if(dish != null){
            const comment = dish.comments.id(req.params.commentId)
            if(!req.user._id.equals(comment.author)){
                err = new Error('you are not authorized to do this operation')
                err.status = 403
                return next(err)
            }
            if(comment != null){
                if(req.body.rating){dish.comments.id(req.params.commentId).rating = req.body.rating}
                if(req.body.comment){dish.comments.id(req.params.commentId).comment = req.body.comment}
                dish.save()
                .then(dish =>{
                    Dishes.findById(dish._id).populate('comments.author')
                    .then(dish =>{
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(dish)                        
                    })
                })
                .catch(err => next(err))
            }
            else{
                err = new Error('comment with id: '+req.params.commentId+' not found ')
                err.status = 404
                return next(err)
            }
        }
        else{
            err = new Error('dish with id: '+req.params.dishId+' not found ')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
})

.delete(cors.corsWithOptions, authentication.verifyUser, (req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .then(dish =>{
        if(dish != null){
            const comment = dish.comments.id(req.params.commentId)
            if(!req.user._id.equals(comment.author)){
                err = new Error('you are not authorized to do this operation')
                err.status = 403
                return next(err)
            }
            if(comment != null){
                dish.comments.id(req.params.commentId).remove()
                dish.save()
                .then(dish =>{
                    Dishes.findById(dish._id).populate('comments.author')
                    .then(dish =>{
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(dish)                        
                    })
                })
                .catch(err => next(err))
            }
            else{
                err = new Error('comment with id: '+req.params.commentId+' not found ')
                err.status = 404
                return next(err)
            }
        }
        else{
            err = new Error('dish with id: '+req.params.dishId+' not found ')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = dishesRouter