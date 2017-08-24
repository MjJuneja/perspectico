'use strict';

describe('Controller: OpspanelCtrl', function () {

  // load the controller's module
  beforeEach(module('webskeletonApp'));

  var OpspanelCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OpspanelCtrl = $controller('OpspanelCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OpspanelCtrl.awesomeThings.length).toBe(3);
  });
});
