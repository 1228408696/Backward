var crypto = require('crypto');
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

restModule.processPost = function(req, res, next) {
  /*
  res.status(500);
  res.end();
  return;
  */

  var restReq = req.frontierReq;
  var restRes;
  var userData = cache.get(restReq.data.username);
  if (!userData || userData.password !== restReq.data.password) {
    restRes = {
      "status": "NEEDAUTH",
      "status_code": 1,
      "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
      "result": {
        "key": null
      }
    };
  } else {
    var shasum = crypto.createHash('sha1');
    var key = shasum.update(Math.random().toString()).digest('hex');

    cache.put(key, {
      "username": restReq.data.username
    });

    restRes = {
      "status": "SUCCESS",
      "status_code": 0,
      "call_id": Date.parse(new Date()) + parseInt(Math.random()*999),
      "result": {
        "key": key
      }
    };
  }
  res.send(JSON.stringify(restRes));
}

restModule.processGet = function(req, res, next) {

}

restModule.processPut = function(req, res, next) {

}

restModule.processDelete = function(req, res, next) {

}

module.exports = restModule;