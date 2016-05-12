process.env.PORT = 6699;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var restapi = require('./routes/restapi');

var cache = require('memory-cache');

var app = express();

/**
 * Launch server with command line, the first argument is environment;
 *
 * For example:
 *
 * ```
 * node ./bin/www product
 * ```
 * Environment is 'product'
 *
 * default environment is development.
 *
 */
var env = 'development';
if(process.argv.length > 2) {console.log(process)
  env = process.argv[2];
}
console.log('Running under environment: ' + env);
app.set('env', env);

// view engine setup
app.set('modules', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.normalize(path.join(__dirname, '/../app'))));

app.use('/restapi', restapi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(JSON.stringify({
      status: err.status,
      message: err.message,
      stack: err.stack
    }));
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(JSON.stringify({
    status: err.status,
    message: err.message
  }));
});

cache.put('nextUserId', 0);

module.exports = app;
