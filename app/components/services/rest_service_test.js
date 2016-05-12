'use strict';

describe('frontierApp restService Service', function() {
  var rootScope, location;

  var testService;

  beforeEach(function() {
    module('frontierApp');
    inject(function($controller, $injector) {
      rootScope = $injector.get('$rootScope');
      location = $injector.get('$location');

      testService = $injector.get('testService');
    });
  });

  describe('restService Service', function(){

    describe('Handle status "ERROR"', function(){

      beforeEach(function(){
        var resData = {
          "status": "ERROR",
          "userStatus": null,
          "callId": 3992833,
          "message": "test error!",
          "result": null
        };
        testService.simulateRequest(true, 'GET', '/test', null, null, 200, resData, null);
      });

      it('result should be false, error message should be set and location should be /error', function() {
        expect(rootScope.frontierTest.testResult).toBe(false);
        expect(rootScope.errorTitle).toBeDefined();
        expect(rootScope.errorMessage).toMatch(/test error! \[调用编码：[0-9]+\]/i);
        expect(location.path()).toBe('/error');
      });
    });

    describe('Handle user status', function() {
      beforeEach(function(){
        rootScope.userStatusConf = {
          'testUserStatus': {
            'message': 'test message!',
            'redirectTo': '/testurl'
          }
        };

        var resData = {
          "status": "SUCCESS",
          "userStatus": "testUserStatus",
          "callId": 3992833,
          "message": "",
          "result": null
        };
        testService.simulateRequest(true, 'GET', '/test', null, null, 200, resData, null);
      });

      it('result should be false, message should be set and location should be /testurl', function() {
        expect(rootScope.frontierTest.testResult).toBe(false);
        expect(rootScope.errorTitle).toBeUndefined();
        expect(rootScope.errorMessage).toBeUndefined();
        expect(rootScope.message).toBe(rootScope.userStatusConf.testUserStatus.message);
        expect(location.path()).toBe(rootScope.userStatusConf.testUserStatus.redirectTo);
      });
    });

    describe('Handle success normal response', function() {
      beforeEach(function(){
        var resData = {
          "status": "SUCCESS",
          "userStatus": null,
          "callId": 3992833,
          "message": "",
          "result": {
            'uid': 1000
          }
        };
        testService.simulateRequest(true, 'GET', '/test', null, null, 200, resData, null);
      });

      it('result should be set to the responsed JSON', function() {
        expect(rootScope.frontierTest.testResult.uid).toBe(1000);
      });
    });

    describe('Handle success normal response with request body', function() {
      it('result should be set to the responsed JSON', function() {
        var resData = {
          "status": "SUCCESS",
          "userStatus": null,
          "callId": 3992833,
          "message": "",
          "result": {
            'uid': 1000
          }
        };
        var reqData = {
          "uid": 1000,
          "username": "testuser"
        };
        testService.simulateRequest(true, 'GET', '/test', reqData, null, 200, resData, null);
        expect(rootScope.frontierTest.testResult.uid).toBe(1000);
      });

      it('result should be processed by callback', function() {
        var resData = {
          "status": "SUCCESS",
          "userStatus": null,
          "callId": 3992833,
          "message": "",
          "result": {
            'uid': 1000
          }
        };
        var reqData = {
          "uid": 1000,
          "username": "testuser"
        };

        var callback = function(result) {
          result.uid += 1;
        };
        testService.simulateRequest(true, 'GET', '/test', reqData, null, 200, resData, callback);
        expect(rootScope.frontierTest.testResult.uid).toBe(1001);
      });
    });
  });
});