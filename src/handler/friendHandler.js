/**
 * Created by YoungKim on 2014. 9. 1..
 */

'use strict';

var rabbitmq = require('./rabbitmq');
var session = require(SOURCE_ROOT + '/module/userSession/session');

var serviceQueueName = 'requestQueue';

exports.addFriend = function (req, res) {
    var connection = rabbitmq.getConn();

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
            user: result,
            friendList: req.body.phone_numbers,
            time: new Date().getTime(),
            action: 'friendAdd'
        };

        connection.publish(serviceQueueName, message);

        //success
        res.contentType('application/json');
        res.send({result: "SUCCESS"});
    });
};

exports.deleteFriend = function (req, res) {
    var connection = rabbitmq.getConn();

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
            user: result,
            friendList: req.body.phone_numbers,
            time: new Date().getTime(),
            action: 'friendDelete'
        };

        connection.publish(serviceQueueName, message);

        //success
        res.contentType('application/json');
        res.send({result: "SUCCESS"});
    });
};