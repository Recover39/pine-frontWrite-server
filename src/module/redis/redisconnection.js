'use strict';

var redis = require('redis');
var customError = require('./_error');

var redisconnection = {};

var client = redis.createClient(SETTING.redis.port, SETTING.redis.host);
var connected = true;
var errorCount = 0;

client.on('error', function (err) {
    connected = false;
    if (errorCount % 3 === 0 && errorCount != 0) {
        error('fail to connect Redis ' + ++errorCount + ' times, ' + err);
        error('Trying to reconnect...');
    }
    setTimeout(function () {
        if (errorCount > 10) throw new customError.RedisConnectionError('Error: Can not connect redis.');
        client = redis.createClient(SETTING.redis.port, SETTING.redis.host);
    }, 1000);
});

client.on('connect', function () {
    info('Redis connected: ' + new Date());
    connected = true;
});

redisconnection.getConnection = function () {
    return client;
};

module.exports = redisconnection;