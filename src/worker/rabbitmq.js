/**
 * Created by YoungKim on 2014. 9. 1..
 */

'use strict';

var rabbitmq = (function () {
    //rabbitMQ setting
    var rabbit = require('amqp');
    var connection = rabbit.createConnection(SETTING.rabbitConfig);

    var getConn = function () {
        return connection;
    };

    return {
        getConn: getConn
    };
})();

module.exports = rabbitmq;