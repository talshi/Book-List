'use strict';

describe('myApp.Home module', function() {

  beforeEach(module('myApp.Home'));

  describe('Home controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view1Ctrl = $controller('View1Ctrl');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});