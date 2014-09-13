/**
 * Created by youngkim on 2014. 9. 11..
 */

'use strict';

var express = require('express'),
    router = express.Router();

var commentHandler = require(SOURCE_ROOT + '/handler/commentHandler');

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

router.param('comment_id', function (req, res, next, comment_id) {
    if (!/^\d+$/.test(comment_id)) {
        //fail
        res.contentType('application/json');
        res.send({result: "FAIL", message: 'error message'});
    }
    req.comment_id = comment_id;
    next();
});

router.post('/:comment_id/like', function (req, res) {
    commentHandler.commentRequestHandler('commentLike', commentHandler.serviceQueueName, req, res);
});

router.post('/:comment_id/unlike', function (req, res) {
    commentHandler.commentRequestHandler('commentUnlike', commentHandler.serviceQueueName, req, res);
});

router.post('/:comment_id/report', function (req, res) {
    commentHandler.commentRequestHandler('commentReport', commentHandler.serviceQueueName, req, res);
});

router.post('/:comment_id/block', function (req, res) {
    commentHandler.commentRequestHandler('commentBlock', commentHandler.serviceQueueName, req, res);
});