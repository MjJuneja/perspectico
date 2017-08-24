'use strict';

describe('Service: library', function () {

  // load the service's module
  beforeEach(module('webskeletonApp'));

  // instantiate service
  var library;
  beforeEach(inject(function (_library_) {
    library = _library_;
  }));

  it('should do something', function () {
    expect(!!library).toBe(true);
  });

});
