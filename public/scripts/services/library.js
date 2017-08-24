'use strict';

/**
 * @ngdoc service
 * @name perspecticoApp.library
 * @description
 * # library
 * Factory in the perspecticoApp.
 */
angular.module('perspecticoApp')
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
