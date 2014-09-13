/**
 * Created by YoungKim on 2014. 7. 7..
 */

'use strict';

var rabbitmq = require('./rabbitmq');
var session = require(SOURCE_ROOT + '/module/userSession/session');

var serviceQueueName = 'requestQueue';

exports.postNewThread = function (req, res) {
    //is_public field error detection
    if (req.body.is_public === 'true') {
        var connection = rabbitmq.getConn();

        session.getUsername(req.cookies.sessionId, function (err, result) {
            if (err) throw err;

            if (!result) {
                //fail
                res.contentType('application/json');
                res.send({result: "FAIL", message: 'error message'});
                return;
            }

            var image_url = "";
            if (req.body.url === 'null') {
                image_url = "";
            }
            else {
                image_url = req.body.url;
            }

            //data to send
            var message = {
                author: result,
                is_public: req.body.is_public,
                content: req.body.content,
                image_url: image_url,
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

exports.addComment = function (req, res) {
    var connection = rabbitmq.getConn();

    //set queue name, action name (identifier)
    var mQueryAction = 'commentAdd';

    session.getUsername(req.cookies.sessionId, function (err, result) {
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

    session.getUsername(req.cookies.sessionId, function (err, result) {
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