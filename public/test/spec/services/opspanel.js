'use strict';

describe('Service: opspanel', function () {

  // load the service's module
  beforeEach(module('webskeletonApp'));

  // instantiate service
  var opspanel;
  beforeEach(inject(function (_opspanel_) {
    opspanel = _opspanel_;
  }));

  it('should do something', function () {
    expect(!!opspanel).toBe(true);
  });

});
