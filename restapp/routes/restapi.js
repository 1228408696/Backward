/**
 * Created by zhouhua on 15/6/21.
 */

var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var url = require('url');

var processFunc = function(req, res, next) {
  var currentUrl = req.url;console.log(currentUrl);
  var pathArr = url.parse(currentUrl).pathname.split('/');
  if(req.query && req.query.data) {
    req.frontierReq = JSON.parse(req.query.data);
    if(req.cookie && req.cookie.cmssId) {
      req.frontierReq.key = req.cookie.cmssId;
    } else if(req.query.key) {
      req.frontierReq.key = req.query.key;
    } else {
      req.frontierReq.key = null;
    }
  } else {
    req.frontierReq = req.body;
    if(req.cookie && req.cookie.cmssId) {
      req.frontierReq.key = req.cookie.cmssId;
    }
  }
  console.log(req.frontierReq);
  var baseIndex = 0;
  if(pathArr[0] === '') {
    baseIndex = 1;
  }
  var module = pathArr[baseIndex];
  console.log("module:" + module);
  res.header('Content-type', 'application/json;charset=utf-8');
  var modulePath = __dirname + '/../resource/' + module + '.js';

  fs.exists(modulePath, function(exists) {
    if(exists) {
      var handler = require(modulePath);
      handler.process(req, res, next);
    } else {
      var err = new Error('Resource module \'' + module + '\' Not Found');
      err.status = 404;
      next(err);
    }
  });
};

var endFunc = function(req, res, next) {
  if(res.restRes) {
    res.restRes.callId = Date.parse(new Date()) + parseInt(Math.random() * 999);
    res.send(JSON.stringify(res.restRes));
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('{ version: "v1" }');
});

router.get('/*', processFunc);
router.post('/*', processFunc);
router.put('/*', processFunc);
router.delete('/*', processFunc);

router.get('/*', endFunc);
router.post('/*', endFunc);
router.put('/*', endFunc);
router.delete('/*', endFunc);

module.exports = router;
