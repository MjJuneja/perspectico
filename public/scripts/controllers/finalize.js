'use strict';

/**
 * @ngdoc function
 * @name perspecticoApp.controller:FinalizeCtrl
 * @description
 * # FinalizeCtrl
 * Controller of the perspecticoApp
 */
angular.module('perspecticoApp')
  .controller('FinalizeCtrl', function ($timeout,$scope) {
  $scope.loading_screen.finish();
});


