var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();
//cors is needed here because stripe post request will come from client side
const cors = require("cors")
var mongoose = require('mongoose');
var configurations = require('./config/globals');

//router import
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cartItemsRouter = require('./routes/cartItems');
var cartRouter = require('./routes/carts');

//MONGOOSE SET UP
mongoose.connect(configurations.db,{useNewUrlParser: true, useUnifiedTopology: true})
.then((message)=>{
  console.log("Connection to DataBase was a Success!!");
}).catch((error)=>{
  console.log("Error while connecting to dataBase "+ error);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//setting up links associated with routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cartItems',cartItemsRouter);
app.use('/carts',cartRouter);
app.use(
  cors({
    origin: "*", //lets in any link from any origin
  })
)

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
