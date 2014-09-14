/**
 * Created by youngkim on 2014. 9. 13..
 */

'use strict';

var express = require('express'),
    router = express.Router();

var userHandler = require(SOURCE_ROOT + '/handler/userHandler');

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

router.post('/register', function (req, res) {
    userHandler.registerUser(req, res);
});

module.exports = router;