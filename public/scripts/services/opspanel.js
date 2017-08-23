'use strict';

/**
 * @ngdoc service
 * @name perspecticoApp.opspanel
 * @description
 * # opspanel
 * Factory in the perspecticoApp.
 */
angular.module('perspecticoApp')
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
