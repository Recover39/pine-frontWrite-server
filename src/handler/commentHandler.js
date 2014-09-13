/**
 * Created by youngkim on 2014. 9. 11..
 */

'use strict';

var rabbitmq = require('./rabbitmq');
var session = require(SOURCE_ROOT + '/module/userSession/session');

var serviceQueueName = 'requestQueue';

exports.commentRequestHandler = function (action, queueName, req, res) {
    var reqContentType = req.get('Content-Type');

    if (reqContentType === 'application/json') {
        var connection = rabbitmq.getConn();

        //set queue name, action name (identifier)
        var mQueryAction = String(action);

        session.getUsername(req.body.user, function (err, result) {
            if (err) throw err;

            //data to send
            var message = {
                comment_id: req.comment_id,
                user: result,
                time: new Date().getTime(),
                action: mQueryAction
            };

            connection.on('ready', function () {
                connection.publish(serviceQueueName, message);
            });

            //success
            res.contentType('application/json');
            res.send({result: "SUCCESS"});
        });
    }
    //Content-Type error
    else {
        //fail
        res.contentType('application/json');
        res.send({result: "FAIL", message: 'error message'});
    }
};