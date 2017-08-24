'use strict';

/**
 * @ngdoc service
 * @name webskeletonApp.opspanel
 * @description
 * # opspanel
 * Factory in the webskeletonApp.
 */
angular.module('webskeletonApp')
  .factory('opspanel', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
