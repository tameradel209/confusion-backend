var express = require('express');
var bodyParser = require('body-parser')
var Users = require('../models/users')
var passport = require('passport')
var authentication = require('../authentication')
const cors = require('./cors')

var UsersRouter = express.Router();
UsersRouter.use(bodyParser.json())

/* GET users listing. */
.options('*', cors.corsWithOptions, (req, res) => {res.sendStatus(200)})

UsersRouter.get('/', cors.corsWithOptions, authentication.verifyUser,authentication.verifyAdmin, (req, res, next) =>{
  
  Users.find({})
  .then(users =>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(users)
  })
  .catch(err => next(err))
});

UsersRouter.route('/signup')

.post(cors.corsWithOptions, (req, res, next) =>{
  Users.register(new Users({username: req.body.username}), req.body.password, (err, user) => {
  if(err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({err: err});
  }
  else {
    if (req.body.firstname){user.firstname = req.body.firstname}
    if (req.body.lastname){user.lastname = req.body.lastname}
    user.save((err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
        return ;
      }
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      })
    })
  }
})
})

UsersRouter.route('/signin')
//passport will try to authenticate if fail will handle the error
.post(cors.corsWithOptions, passport.authenticate('local'), (req, res) =>{
  console.log(req)
  const token = authentication.getToken({_id: req.user._id})
  console.log(token)
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({success: true, token: token, status:'you are loggedin successfully'})
})

UsersRouter.route('/logout')

.get(cors.corsWithOptions, (req, res, next) =>{
  if(req.session){
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else{
    const err = new Error('you are not logedin !!!')
    err.status = 403
    return next(err)
  }
})

UsersRouter.route('/facebook/token')
.get(passport.authenticate('facebook-token'), (req, res) =>{
  if(req.user){
    const token = authentication.getToken({_id: req.user._id})
    res.sendStatus = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({success: true, token: token, status: 'you logged in with facebook successfully'})    
  }
})

UsersRouter.route('/checkjwt')
.get(cors.corsWithOptions, (req, res) =>{
  passport.authenticate('jwt', {session: false}, (err, user, info) =>{
    if(err){
      return next(err)
    }
    else if(!user){
      res.sendStatus = 401
      res.setHeader('Content-Type', 'application/json')
      res.json({status: 'invalid token', success: false, error: info})
    }
    else {
      res.sendStatus = 200
      res.setHeader('Content-Type', 'application/json')
      res.json({status: 'valid token', success: true, user: user})
    }
  })(req, res)
})

module.exports = UsersRouter;
