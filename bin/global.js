/**
 * Created by YoungKim on 2014. 9. 3..
 */

var path = require('path'),
    debug = require('debug');

if (process.env.WRITE_SERVER_SETTING === 'undefined' || process.env.WRITE_SERVER_SETTING === undefined) {
    throw new Error('export WRITE_SERVER_SETTING (local or development, production) required.');
}

SETTING = {};

PROJECT_ROOT = path.dirname(__dirname);
SOURCE_ROOT = path.join(PROJECT_ROOT, 'src');
TEST_ROOT = path.join(PROJECT_ROOT, 'test');

info = debug('info:');
info.log = console.log.bind(console);
error = debug('error:');
error.log = console.error.bind(console);

(function () {
    var env = process.env.WRITE_SERVER_SETTING;

    var local = {
        flag: 'local',
        ports: [8001, 8002, 8003, 8004],
        rabbitConfig: {
            host: 'localhost', port: 5672,
            login: 'admin', password: 'password',
            authMechanism: 'AMQPLAIN'
        },
        rabbitQueueList: ['requestQueue'],
        redis: {
            host: 'localhost',
            port: 6379
        }
    };

    var development = {
        flag: 'development',
        ports: [8001, 8002, 8003, 8004],
        rabbitConfig: {
            host: 'http://125.209.193.216/', port: 5672,
            login: 'admin', password: 'password',
            authMechanism: 'AMQPLAIN'
        },
        redis: {
            host: 'localhost',
            port: 6379
        }
    };

    var production = {
        flag: 'production',
        ports: [8001, 8002, 8003, 8004],
        rabbitmq: {
            host: 'http://125.209.193.216/', port: 5672,
            login: 'admin', password: 'password',
            authMechanism: 'AMQPLAIN'
        },
        redis: {
            host: 'localhost',
            port: 6379
        }
    };

    switch (env) {
        case 'local' :
            SETTING = local;
            break;
        case 'development' :
            SETTING = development;
            break;
        case 'production' :
            SETTING = production;
            break;
        default :
            throw new Error('export WRITE_SERVER_SETTING (local or development, production) required.');
    }
})();

module.exports = SETTING;

//var session = require(SOURCE_ROOT + '/session/session');
//session.createSession('young', function (err, sessionKey) {
//    session.getUsername(sessionKey, function (err, username) {
//        console.log(sessionKey);
//        console.error(username);
//    });
//});