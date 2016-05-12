/**
 *
 * @type {exports}
 */

// required modules
// var cache = require('memory-cache');

var restModule = {};

restModule.process = function(req, res, next) {
  switch (req.method) {
    case 'POST':
      return this.processPost(req, res, next);
    case 'GET':
      return this.processGet(req, res, next);
    case 'PUT':
      return this.processPut(req, res, next);
    case 'DELETE':
      return this.processDelete(req, res, next);
  }
}

restModule.processGet = function(req, res, next) {
  // req.frontierReq is the request JSON object
  var restReq = req.frontierReq;

  var restRes = {
    "status": "SUCCESS",
    "userStatus": 0,
    "message": "",
    "result": {
    }
  }
  switch(restReq.data.action) {
    case "action1": {
      // do something on action2...
      break;
    }
    case "action2": {
      // do something on action2...
      break;
    }
  }

  // Do not change the following code!
  res.restReq = restReq;
  next();
}

restModule.processPost = function(req, res, next) {
  // req.frontierReq is the request JSON object
  var restReq = req.frontierReq;

  // customized process code goes here
  var restRes = {
    "status": "SUCCESS",
    "status_code": 0,
    "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
    "message": "",
    "result": {
    }
  }

  // Do not change the following code!
  res.restReq = restReq;
  next();
}

restModule.processPut = function(req, res, next) {
  // req.frontierReq is the request JSON object
  var restReq = req.frontierReq;

  // customized process code goes here
  var restRes = {
    "status": "SUCCESS",
    "status_code": 0,
    "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
    "message": "",
    "result": {
    }
  }

  // Do not change the following code!
  res.restReq = restReq;
  next();
}

restModule.processDelete = function(req, res, next) {
  // req.frontierReq is the request JSON object
  var restReq = req.frontierReq;

  // customized process code goes here
  var restRes = {
    "status": "SUCCESS",
    "status_code": 0,
    "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
    "message": "",
    "result": {
    }
  }

  // Do not change the following code!
  res.restReq = restReq;
  next();
}

module.exports = restModule;