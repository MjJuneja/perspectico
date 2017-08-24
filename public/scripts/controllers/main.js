'use strict';

/**
 * @ngdoc function
 * @name perspecticoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the perspecticoApp
 */
angular.module('perspecticoApp')
  .controller('MainCtrl', function ($scope,requrl,webindex) {

    $scope.main={
      topPods:[],
    };

    $scope.loadTopPods = function () {
      var myPod = {
        type: 'top',
        count: 0
      };

      var promise = webindex.loadPods(myPod);
      promise.then(function (data) {

        if (data.data.length > 0) {
          for(var i=0;i<data.data.length;i++){
            data.data[i].coverUrl=requrl+'/Covers/'+data.data[i].coverUrl;
          }
          $scope.main.topPods = data.data;
          console.log($scope.main.topPods);
        }
        else {
          $scope.topPodsResult = "Error loading! Try again later.";
        }
      }, function (error) {
        $scope.topPodsResult = "Error Loading! Try again later.";
      });
    };

    $scope.loadTopPods();


  });
