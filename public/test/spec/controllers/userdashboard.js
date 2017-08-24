'use strict';

describe('Controller: UserdashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('webskeletonApp'));

  var UserdashboardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserdashboardCtrl = $controller('UserdashboardCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UserdashboardCtrl.awesomeThings.length).toBe(3);
  });
});
