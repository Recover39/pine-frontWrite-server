/**
 * Created by youngkim on 2014. 9. 11..
 */

'use strict';

var express = require('express'),
    router = express.Router();

var threadHandler = require(SOURCE_ROOT + '/handler/threadHandler');

router.use(function (req, res, next) {
    var contentType = req.get('Content-Type');

    if (contentType === 'application/json')
        next();
    else if (/multipart\/form-data;+/.test(contentType))
        next();
    else {
        //fail
        res.contentType('application/json');
        res.send({result: "FAIL", message: 'error message'});
    }
});

router.post('/', function (req, res) {
    threadHandler.textOnlyNewCardQuery(req, res);
});

router.param('thread_id', function (req, res, next, thread_id) {
    if (!/^\d+$/.test(thread_id)) {
        //fail
        res.contentType('application/json');
        res.send({result: "FAIL", message: 'invaild thread id'});
    }
    req.thread_id = thread_id;
    next();
});

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

router.post('/:thread_id/like', function (req, res) {
    threadHandler.threadRequestHandler('threadLike', req, res);
});

router.post('/:thread_id/comments', function (req, res) {
    threadHandler.addComment(req, res);
});

router.post('/:thread_id/unlike', function (req, res) {
    threadHandler.threadRequestHandler('threadUnlike', req, res);
});

router.post('/:thread_id/report', function (req, res) {
    threadHandler.threadRequestHandler('threadReport', req, res);
});

router.post('/:thread_id/block', function (req, res) {
    threadHandler.threadRequestHandler('threadBlock', req, res);
});

router.post('/:thread_id/hide', function (req, res) {
    threadHandler.threadRequestHandler('threadHide', req, res);
});

module.exports = router;