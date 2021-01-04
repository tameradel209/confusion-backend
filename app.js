var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var session = require('express-session')
var fileStore = require('session-file-store')(session)
var passport = require('passport')

var indexRouter = require('./routes/index');
var UsersRouter = require('./routes/users');
var dishesRouter = require('./routes/dishesRouter')
var leadersRouter = require('./routes/leadersRouter')
var promosRouter = require('./routes/promosRouter'); 
var uploadImageRouter = require('./routes/uploadImageRouter')
var favoriteDishes = require('./routes/favoriteDishesRouter')
var commentsRouter = require('./routes/commentsRouter')
var authentication = require('./authentication')
var config = require('./config');
const commentRouter = require('./routes/commentsRouter');

const url = config.mongoUrl

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName:'confusion'
})
.then(db => console.log('connected successfully to the server...'))
.catch(err => console.log('Error:'+ err.message))

var app = express();

//secure traffic only
app.all('*', (req, res, next) =>{
  if(req.secure){return next()}
  res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(cookieParser('12345-67890-09876-54321'));
/*
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new fileStore()
}))
*/
//initialize and handle the session for us
app.use(passport.initialize())
//app.use(passport.session())

app.use('/', indexRouter);
app.use('/users', UsersRouter);
/*
const auth = (req, res, next) =>{
  console.log(req.user)
  if(req.user){
    return next()
  }
  const err = new Error('you are not authanticated !!!')
  err.status = 401
  next(err)
}

app.use(auth)
*/

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishesRouter)
app.use('/leaders', leadersRouter)
app.use('/promotions', promosRouter)
app.use('/uploadimage', uploadImageRouter)
app.use('/favorites', favoriteDishes)
app.use('/comments', commentsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
