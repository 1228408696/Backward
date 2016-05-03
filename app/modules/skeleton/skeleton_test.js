'use strict';

describe('frontierApp.skeleton module', function() {
  var rootScope, scope, resource, location, restUrlObj, restServiceObj;
  var controllerFactory;

  beforeEach(function() {
    module('frontierApp');
    module('frontierApp.skeleton');
    inject(function($controller, $injector) {
      controllerFactory = $controller;
      rootScope = $injector.get('$rootScope');
      scope = rootScope.$new();
      resource = $injector.get('$resource');
      location = $injector.get('$location');
      restUrlObj = $injector.get('restUrl');
      restServiceObj = $injector.get('restService');
    });
  });

  describe('login controller', function(){

    it('should ....', function() {
      var SkeletonController = controllerFactory('SkeletonController', {
        '$rootScope': rootScope,
        '$scope': scope,
        '$resource': resource,
        '$location': location,
        'restUrl': restUrlObj,
        'restService': restServiceObj
      });
      expect(SkeletonController).toBeDefined();
      // other test stuff...
    });

  });
});