/**
 * Created by zhouhua on 15/9/7.
 */

describe('frontierApp restService Service', function() {
  var rootScope, location, compile;
  var testService;
  var elm;

  beforeEach(function() {
    module('frontierApp');
    inject(function($controller, $injector) {
      rootScope = $injector.get('$rootScope');
      location = $injector.get('$location');
      testService = $injector.get('testService');
      compile = $injector.get('$compile');
    });
  });

  describe('Get captcha from server', function() {

    it('request should be sent to server and captcha image element src should be set with result.imageBase64', function() {
      var resData = {
        "status": "SUCCESS",
        "userStatus": null,
        "callId": 3992833,
        "message": "",
        "result": {captchaId: 1000, imageBase64: "test-base64"}
      };

      testService.expectRequest('POST', '/restapi/captcha', null, null, 200, resData);
      elm = angular.element('<div captcha captcha-model="formCaptcha"></div>');
      var aaa = compile(elm)(rootScope);
      testService.expectRequestEnd();
      expect(elm.find('img').attr('src')).toBe("data:image/png;base64," + resData.result.imageBase64);
      expect(rootScope.formCaptcha.captchaId).toBe(1000);

      resData.imageBase64 = "another-test-base64";
      testService.expectRequest('POST', '/restapi/captcha', null, null, 200, resData);
      rootScope.formCaptcha.createCaptcha();
      testService.expectRequestEnd();
      expect(elm.find('img').attr('src')).toBe("data:image/png;base64," + resData.result.imageBase64);

    });
  });

  describe('Check correct captcha input by server', function() {

    beforeEach(function() {
      var resData = {
        "status": "SUCCESS",
        "userStatus": null,
        "callId": 3992833,
        "message": "",
        "result": {captchaId: 1000, imageBase64: "test-base64"}
      };

      testService.expectRequest('POST', '/restapi/captcha', null, null, 200, resData);
      elm = angular.element('<div captcha captcha-model="formCaptcha"></div>');
      compile(elm)(rootScope);
      testService.expectRequestEnd();
    });

    it('request should be sent to server and captcha check element class should be changed to "captcha-check-ok"', function() {
      var reqData, resData;

      reqData = {
        captchaId: 1000,
        captchaCode: "1234"
      };
      resData = {
        "status": "SUCCESS",
        "userStatus": null,
        "callId": 3992833,
        "message": "",
        "result": {captchaId: 1000, captchaCode: "1234"}
      };
      testService.expectRequest('GET', '/restapi/captcha', reqData, null, 200, resData);
      elm.find('input').val('1234');
      rootScope.formCaptcha.checkCaptcha();
      testService.expectRequestEnd();
      expect(elm.find('div').attr('class')).toBe("captcha-check-ok");
      expect(rootScope.formCaptcha.checkResult).toBe(true);
    });
  });

  describe('Check incorrect captcha input by server', function() {

    beforeEach(function() {
      var resData = {
        "status": "SUCCESS",
        "userStatus": null,
        "callId": 3992833,
        "message": "",
        "result": {captchaId: 1000, imageBase64: "test-base64"}
      };

      testService.expectRequest('POST', '/restapi/captcha', null, null, 200, resData);
      elm = angular.element('<div captcha captcha-model="formCaptcha"></div>');
      compile(elm)(rootScope);
      testService.expectRequestEnd();
    });

    it('request should be sent to server and captcha check element class should be changed to "captcha-check-ok"', function() {
      var reqData, resData;

      reqData = {
        captchaId: 1000,
        captchaCode: "not1234"
      };
      resData = {
        "status": "SUCCESS",
        "userStatus": null,
        "callId": 3992833,
        "message": "",
        "result": null
      };
      testService.expectRequest('GET', '/restapi/captcha', reqData, null, 200, resData);
      elm.find('input').val('not1234');
      rootScope.formCaptcha.checkCaptcha();
      testService.expectRequestEnd();
      expect(elm.find('div').attr('class')).toBe("captcha-check-failed");
      expect(rootScope.formCaptcha.checkResult).toBe(false);
    });
  });

  describe('Initial input value', function() {

    beforeEach(function() {
      var resData = {
        "status": "SUCCESS",
        "userStatus": null,
        "callId": 3992833,
        "message": "",
        "result": {captchaId: 1000, imageBase64: "test-base64"}
      };

      testService.expectRequest('POST', '/restapi/captcha', null, null, 200, resData);
      rootScope.formCaptcha = {
        input: "abc"
      };
      elm = angular.element('<div captcha captcha-model="formCaptcha"></div>');
      compile(elm)(rootScope);
      testService.expectRequestEnd();
    });

    it('Input value should be initialed by scope.formCaptcha.input', function() {
      expect(elm.find('input').val()).toBe("abc");
    });
  });

  describe('Call function before and after captcha checking', function() {

    beforeEach(function() {
      var resData = {
        "status": "SUCCESS",
        "userStatus": null,
        "callId": 3992833,
        "message": "",
        "result": {captchaId: 1000, imageBase64: "test-base64"}
      };

      testService.expectRequest('POST', '/restapi/captcha', null, null, 200, resData);
      rootScope.formCaptcha = {
        input: "",
        beforeCheckCaptcha: function() {
          rootScope.checkStarted = true;
        },
        afterCheckCaptcha: function() {
          rootScope.checkEnded = true;
        }
      };
      elm = angular.element('<div captcha captcha-model="formCaptcha"></div>');
      compile(elm)(rootScope);
      testService.expectRequestEnd();
    });

    it('should call beforeCheckCaptcha and afterCheckCaptcha', function() {
      var reqData, resData;

      reqData = {
        captchaId: 1000,
        captchaCode: "not1234"
      };
      resData = {
        "status": "SUCCESS",
        "userStatus": null,
        "callId": 3992833,
        "message": "",
        "result": null
      };
      testService.expectRequest('GET', '/restapi/captcha', reqData, null, 200, resData);
      elm.find('input').val('not1234');
      rootScope.formCaptcha.checkCaptcha();
      testService.expectRequestEnd();

      expect(rootScope.checkStarted).toBe(true);
      expect(rootScope.checkEnded).toBe(true);
    });
  });
});