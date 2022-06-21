var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var dotenv = require('dotenv').config();
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('express-flash');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/users');
var chatRouter = require('./routes/chats');
var msgRouter = require('./routes/messages');
const connect = mongoose.connect(process.env.MONGO_LATER_URL);

connect.then((db) => {
  console.log('connected to the server');
}, (err) => {
  console.log(err);
});


var app = express();



////////////////////////////////////////////

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
   secret: process.env.SECRET_KEY, //session secret key
   resave: true,                  //dont want to resave if nothing changes
   saveUninitialized: true ,  //dont save if there is no value
   cookie: {
    signed:true,
    httpOnly: true,
    maxAge: 30000000000
}       
  }));
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); // persistent login sessions
app.use(cors('*'));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth',authRouter);
app.use('/chats',chatRouter);
app.use('/messages',msgRouter);

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
