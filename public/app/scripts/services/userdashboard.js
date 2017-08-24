'use strict';

/**
 * @ngdoc service
 * @name webskeletonApp.userdashboard
 * @description
 * # userdashboard
 * Factory in the webskeletonApp.
 */
angular.module('webskeletonApp')
  .factory('userdashboard', function () {
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
