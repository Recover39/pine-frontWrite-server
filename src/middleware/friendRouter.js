/**
 * Created by youngkim on 2014. 9. 11..
 */

'use strict';

var express = require('express'),
    router = express.Router();

var userHandler = require(SOURCE_ROOT + '/handler/friendHandler');

router.use(function (req, res, next) {
    var contentType = req.get('Content-Type');

    if (contentType === 'application/json')
        next();
    else {
        //fail
        res.contentType('application/json');
        res.send({result: "FAIL", message: 'error message'});
    }
});

router.post('/create', function (req, res) {
    userHandler.addFriend(req, res);
});

router.post('/destroy', function (req, res) {
    userHandler.deleteFriend(req, res);
});

module.exports = router;