var cache = require('memory-cache');
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

restModule.processPost = function(req, res, next) {console.log('post')
  var restReq = req.frontierReq;
  var restRes = {};
  var keyData = cache.get(restReq.key);
  console.log('key: ' + restReq.key);
  console.log('keyData: ' + keyData.captcha);
  console.log('reqData: ' + restReq.data.captcha);
  if(!keyData || keyData.captcha != restReq.data.captcha) {
    restRes = {
      "status": "SUCCESS",
      "status_code": 3,
      "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
      "message": "",
      "result": {
        "message": "验证码输入错误"
      }
    }
    res.send(JSON.stringify(restRes));
    return;
  }
  var user = cache.get(restReq.data.username);
  if(user == null) {
    var userId = cache.get('nextUserId');
    cache.put('nextUserId', userId+1);
    restReq.data.status = "VERIFYING";
    restReq.data.user_id = userId;
    restReq.data.create_time = Date.parse(new Date())/1000;
    cache.put(restReq.data.username, restReq.data);

    restRes = {
      "status": "SUCCESS",
      "status_code": 0,
      "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
      "message": "",
      "result": {
        "user_id": restReq.data.user_id,
        "username": restReq.data.username,
        "create_time": restReq.data.create_time,
        "status": restReq.data.status
      }
    }
  } else {
    restRes = {
      "status": "SUCCESS",
      "status_code": 4,
      "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
      "message": "",
      "result": {
        "message": "用户名已经被占用!"
      }
    }
  }
  res.send(JSON.stringify(restRes));
}

restModule.processGet = function(req, res, next) {
  var restReq = req.frontierReq;
  var restRes = {};
  if(restReq.action == "check-username") {
    var user = cache.get(restReq.username);
    if(user === null) {
      restRes = {
        "status": "SUCCESS",
        "status_code": 0,
        "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
        "message": "",
        "result": null
      }
    } else {
      restRes = {
        "status": "SUCCESS",
        "status_code": 0,
        "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
        "message": "",
        "result": {
          "username": user.username,
          "status": user.status
        }
      }
    }
  }
  res.send(JSON.stringify(restRes));
}

restModule.processPut = function(req, res, next) {

}

restModule.processDelete = function(req, res, next) {

}

module.exports = restModule;