'use strict';

describe('Service: userdashboard', function () {

  // load the service's module
  beforeEach(module('webskeletonApp'));

  // instantiate service
  var userdashboard;
  beforeEach(inject(function (_userdashboard_) {
    userdashboard = _userdashboard_;
  }));

  it('should do something', function () {
    expect(!!userdashboard).toBe(true);
  });

});
