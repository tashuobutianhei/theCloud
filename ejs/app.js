var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var multer = require('multer');
var fs = require('fs')
var cookoeParser = require('cookie-parser')
var cookieSession = require('cookie-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var multipart = require('connect-multiparty');

var app = express();
app.use(cookoeParser());//得先设置cookie
app.use(cookieSession({ //session中间件
    name:'user', //session的名字
    maxAge: 2*3600*1000,
    keys:['aaa','bbb','ccc']//秘钥，循环使用  必选
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
    next()
})

app.use('/index', indexRouter);
app.use('/users', usersRouter);

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
