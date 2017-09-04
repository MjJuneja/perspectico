'use strict';

/**
 * @ngdoc function
 * @name perspecticoApp.controller:ModulesCtrl
 * @description
 * # ModulesCtrl
 * Controller of the perspecticoApp
 */
angular.module('perspecticoApp')
  .controller('ModulesCtrl', function ($scope, $location, $anchorScroll) {
    $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
   }
  });
