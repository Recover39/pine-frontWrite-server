/**
 * Created by YoungKim on 2014. 7. 7..
 */

'use strict';

var rabbitmq = require('./rabbitmq');
var session = require(SOURCE_ROOT + '/module/userSession/session');

var serviceQueueName = 'requestQueue';

//send card info without photo to queue
exports.textOnlyNewCardQuery = function (req, res) {
    //is_public field error detection
    if (req.body.is_public === 'true') {
        var connection = rabbitmq.getConn();

        session.getUsername(req.body.author, function (err, result) {
            if (err) throw err;

            if (!result) {
                //fail
                res.contentType('application/json');
                res.send({result: "FAIL", message: 'error message'});
                return;
            }

            //data to send
            var message = {
                author: result,
                is_public: req.body.is_public,
                content: req.body.content,
                pub_date: new Date().getTime(),
                action: 'newThread_textOnly'
            };

            connection.publish(serviceQueueName, message);

            //success
            res.contentType('application/json');
            res.send({result: "SUCCESS"});
        });
    }
    //is_public field data error occurred
    else {
        //fail
        res.contentType('application/json');
        res.send({result: "FAIL", message: 'error message'});
    }
};

//send card info with photo to queue
var newCardQuery = function (request, response) {

    //is_public 에러 감지
    //if (request.body.is_public === 'true' || request.body.is_public === 'false') {
    var message = {
        author: request.body.author,
        is_public: request.body.is_public,
        content: request.body.content,
        time: new Date(),
        action: 'newThread'
    };

    //use rabbitMQ
    connection.on('ready', function () {
        //open queue (createQueue)
        connection.queue('newCardQueue', {autoDelete: false, durable: true}, function () {
            //insert queue
            connection.publish('newCardQueue', message);
        });
    });

    //success
    response.contentType('application/json');
    response.send({result: "SUCCESS"});
//    }
//    else {
//        //fail
//        response.contentType('application/json');
//        response.send({result: "FAIL", message: 'error message'});
//    }
};

exports.postNewCard = function (req, res) {
    var reqContentType = req.get('Content-Type');

    if (reqContentType === 'application/json') {
        textOnlyNewCardQuery(req, res);
    }
    else if (/multipart\/form-data;+/.test(reqContentType)) {

    }
    //Content-Type error
    else {
        //fail
        res.contentType('application/json');
        res.send({result: "FAIL", message: 'error message'});
    }
};

exports.addComment = function (req, res) {
    var connection = rabbitmq.getConn();

    //set queue name, action name (identifier)
    var mQueryAction = 'commentAdd';

    session.getUsername(req.body.user, function (err, result) {
        if (err) throw err;

        if (!result) {
            //fail
            res.contentType('application/json');
            res.send({result: "FAIL", message: 'error message'});
            return;
        }

        //data to send
        var message = {
            thread_id: req.thread_id,
            author: result,
            content: req.body.content,
            pub_date: new Date().getTime(),
            action: mQueryAction
        };

        connection.publish(serviceQueueName, message);

        //success
        res.contentType('application/json');
        res.send({result: "SUCCESS"});
    });
};

exports.threadRequestHandler = function (action, req, res) {
    var connection = rabbitmq.getConn();

    //set action name (identifier)
    var mQueryAction = String(action);

    session.getUsername(req.body.user, function (err, result) {
        if (err) throw err;

        if (!result) {
            //fail
            res.contentType('application/json');
            res.send({result: "FAIL", message: 'error message'});
            return;
        }

        //data to send
        var message = {
            thread_id: req.thread_id,
            user: result,
            time: new Date().getTime(),
            action: mQueryAction
        };

        connection.publish(serviceQueueName, message);

        //success
        res.contentType('application/json');
        res.send({result: "SUCCESS", message: message});
    });
};