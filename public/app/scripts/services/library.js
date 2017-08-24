'use strict';

/**
 * @ngdoc service
 * @name webskeletonApp.library
 * @description
 * # library
 * Factory in the webskeletonApp.
 */
angular.module('webskeletonApp')
  .factory('library', function () {
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
