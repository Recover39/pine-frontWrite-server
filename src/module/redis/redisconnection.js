'use strict';

var redis = require('redis');
var customError = require('./_error');

var redisconnection = {};

var client = redis.createClient(SETTING.redis.port, SETTING.redis.host);
var connected = true;
var errorCount = 0;

client.on('error', function (err) {
    connected = false;
    error('Redis connection ' + ++errorCount + ' error: ' + err);
    error('Trying to reconnect...');
    setTimeout(function () {
        if (errorCount > 10) throw new customError.RedisConnectionError('Error: Can not connect redis.');
        client = redis.createClient(SETTING.redis.port, SETTING.redis.host);
    }, 1000);
});

client.on('connect', function () {
    console.log('Redis connected: ' + new Date() + '\n');
    connected = true;
});

redisconnection.getConnection = function () {
    return client;
};

module.exports = redisconnection;