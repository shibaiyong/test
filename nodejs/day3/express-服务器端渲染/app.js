var express = require('express');
var path = require('path'); //node自带的 路径模块
var favicon = require('serve-favicon'); // icon图标插件
var logger = require('morgan'); //logger =>日志插件
var cookieParser = require('cookie-parser'); //cookie插件
var bodyParser = require('body-parser'); // 解析post参数的插件

//index.php?user=2
//index.php 信息主体

//加载路由配置
var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();

// view engine setup  //设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));     //日志插件
app.use(bodyParser.json()); //使用post的参数解析插件
app.use(bodyParser.urlencoded({ extended: false }));//使用post的参数解析插件
app.use(cookieParser());    //使用cookie插件
app.use(express.static(path.join(__dirname, 'public'))); //设置静态目录

//使用路由配置 (routes里面的路径设置是相对于app里面的全局路径)
app.use('/', index);       //  '/'      + '/'
app.use('/users', users);  //  '/users' + '/'
app.use('/api', api);      //  '/api' + '/getGoods'



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
