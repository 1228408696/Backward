/**
 *
 * @type {exports}
 */

// required modules
var crypto = require('crypto');
var cache = require('memory-cache');
var captchapng = require('captchapng');
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
  var restReq = req.frontierReq;
  var restRes = null;
  var captchaId = restReq.captchaId;
  var cacheData = cache.get(captchaId);
  var captchaCode = cacheData.captchaCode;
  var restRes = {
    "status": "SUCCESS",
    "userStatus": null,
    "message": "",
    "result": null
  }
  if(!captchaCode || captchaCode != restReq.captchaCode.toLowerCase()) {
    restRes.result = null;
  } else {
    restRes.result = {
      "captchaId": captchaId,
      "captchaCode": captchaCode
    }
  }
  res.restRes = restRes;
  next();
}

restModule.processPost = function(req, res, next) {
  var restReq = req.frontierReq;
  var restRes = null;

  var newKey = function() {
    var shasum = crypto.createHash('sha1');
    return shasum.update(Math.random().toString()).digest('hex');
  }

  // just for test
  var captchaCode = parseInt(Math.random()*9000+1000);
  var captchaId = newKey();

  var keyData = {};
  keyData.captchaCode = captchaCode.toString().toLowerCase();
  keyData.captchaId = captchaId;
  cache.put(captchaId, keyData);

  var p = new captchapng(80, 30, captchaCode); // 宽,高,数字验证码
  p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
  p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

  var imageBase64 = p.getBase64();

  restRes = {
    "status": "SUCCESS",
    "userStatus": null,
    "message": "",
    "result": {
      "captchaId": captchaId,
      "imageBase64": imageBase64
    }
  }
  res.restRes = restRes;
  next();
}

restModule.processPut = function(req, res, next) {
  var restReq = req.frontierReq;
  var restRes = {
    "status": "SUCCESS",
    "status_code": 0,
    "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
    "message": "",
    "result": {
    }
  }
  res.send(JSON.stringify(restRes));
}

restModule.processDelete = function(req, res, next) {
  var restReq = req.frontierReq;
  var restRes = {
    "status": "SUCCESS",
    "status_code": 0,
    "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
    "message": "",
    "result": {
    }
  }
  res.send(JSON.stringify(restRes));
}

module.exports = restModule;