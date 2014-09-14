/**
 * Created by youngkim on 2014. 9. 13..
 */

'use strict';

var rabbitmq = require('./rabbitmq');
var session = require(SOURCE_ROOT + '/module/userSession/session');

var serviceQueueName = 'requestQueue';

exports.registerUser = function (req, res) {
    var connection = rabbitmq.getConn();

    if (req.body.breast === 'C-CUP') {

        //data to send
        var message = {
            Id : req.body.userName,
            registerDate : new Date().getTime(),
            action : 'userRegister'
        };

        connection.publish(serviceQueueName, message);

        //success
        res.contentType('application/json');
        res.send({result: "SUCCESS"});
    }
    else {
        //fail
        res.contentType('application/json');
        res.send({result: "FAIL", message: 'error message'});
    }
};