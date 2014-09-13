/**
 * Created by YoungKim on 2014. 9. 3
 */

'use strict';

var env = process.env.WRITE_SERVER_SETTING || 'development';

//set basic express module
var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', PROJECT_ROOT + '/views');
app.set('view engine', 'jade');
app.use(express.static(PROJECT_ROOT + '/public'));

app.set('env', env);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/test', function (req, res) {
    res.render('test');
});

var threadRouter = require(SOURCE_ROOT + '/middleware/threadRouter'),
    commentRouter = require(SOURCE_ROOT + '/middleware/commentRouter'),
    friendRouter = require(SOURCE_ROOT + '/middleware/friendRouter');

app.use('/threads', threadRouter);
app.use('/comments', commentRouter);
app.use('/friends', friendRouter);

//404 error
app.use(function (req, res, next) {
    res.contentType('application/json');
    res.send({result: "FAIL", message: 'route error'});
});

//500 error
app.use(function (err, req, res, next) {
    res.contentType('application/json');
    res.send({result: "FAIL", message: 'server error'});
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'local') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
