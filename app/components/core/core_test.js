'use strict';

describe('frontierApp.version module', function() {
  beforeEach(module('frontierApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
