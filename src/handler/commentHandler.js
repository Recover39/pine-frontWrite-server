/**
 * Created by youngkim on 2014. 9. 11..
 */

'use strict';

var rabbitmq = require('./rabbitmq');
var session = require(SOURCE_ROOT + '/module/userSession/session');

var serviceQueueName = 'requestQueue';

exports.commentRequestHandler = function (action, req, res) {
    var connection = rabbitmq.getConn();

    //set queue name, action name (identifier)
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
            comment_id: req.comment_id,
            user: result,
            time: new Date().getTime(),
            action: mQueryAction
        };

        connection.publish(serviceQueueName, message);

        //success
        res.contentType('application/json');
        res.send({result: "SUCCESS"});
    });
};