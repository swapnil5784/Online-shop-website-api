//-1---------------------------------------------------
require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

// mongodb connection

// 2. --------------------------------------------
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
console.log(process.env.MONGO_URL)
db.on('error', (error) => {
  console.log(error)
});
db.once('open', () => {
  console.log('mongodb connected of online-website!')
})
//---------------------------------------------------

var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products');
var usersRouter = require('./routes/users');
var addressBookRouter = require('./routes/addressBook')
var orderRouter = require('./routes/orders')
// 1. passport authentication
const passport = require('passport');
const { authentication, logIpOfRequest, addTwo } = require('./comman/middlewares');
// load passport local for login process
require('./auth/auth');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: '*'
}));

// app.use(function (req, res, next) {
//   console.log("-- > > ----------------------------------------- > > ip ", req.ip);
//   next()
// })

// addTwo(1, 2)
app.use(logIpOfRequest)
app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use(authentication)
app.use('/address', addressBookRouter)
app.use('/orders', orderRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
