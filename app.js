var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');

var index = require('./routes/index');
var front = require('./routes/front/index');
var users = require('./routes/front/users');
//var users = require('./routes/admin/users');
var customers = require('./routes/admin/customers');
var countries = require('./routes/admin/countries');
var menus = require('./routes/admin/menus');

var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var moment = require('moment');

var connection  = require('express-myconnection'); 
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var token;
var app = express();
process.env.SECRET_KEY = "Rudresh04thakur";
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:"secretpass123456"}));
app.use(flash());
app.use(expressValidator());
app.use(methodOverride(function(req, res){
 if (req.body && typeof req.body == 'object' && '_method' in req.body) 
  { 
      var method = req.body._method;
      delete req.body._method;
      return method;
    } 
  }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/
app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'root', // your mysql user
        password : '', // your mysql password
        port : 3306, //port mysql
        database:'scoreboard' // your database name
    },'pool') //or single

);

//app.get('/' ,function(req, res,next){
//  res.render('/front/index');
//});
app.use('/', index);//TypeError: Cannot read property 'query' of undefined
app.use('/front', front);
app.use('/customers', customers);
app.use('/users', users);
app.use('/countries',countries);
app.use('/menus',menus);


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
