//-1---------------------------------------------------
require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const expressValidator = require('express-validator');
// mongodb connection

// 2. --------------------------------------------
global.db = require('./models')
//---------------------------------------------------
const { authentication, logIpOfRequest, validations } = require('./common/middlewares');
global.validation = validations;

const CommonFunctions = require('./common/functions');
global.commonFn = new CommonFunctions();
console.log();

const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const addressBookRouter = require('./routes/addressBook')
const orderRouter = require('./routes/orders')
// 1. passport authentication
const passport = require('passport');


// load passport local for login process
require('./auth/auth');

const app = express();
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      const namespace = param.split(".");
      const root = namespace.shift();
      let formParam = root;
      while (namespace.length) {
        formParam += `[${namespace.shift()}]`;
      }
      return {
        param: formParam,
        msg: msg
      };
    }
  })
);

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
