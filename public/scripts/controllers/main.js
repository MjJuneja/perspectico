'use strict';

/**
 * @ngdoc function
 * @name perspecticoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the perspecticoApp
 */
angular.module('perspecticoApp')
  .controller('MainCtrl', function ($scope, requrl, webindex) {

    $scope.main = {
      topPods: [],
    };

    $scope.loginFirst=true;
    $scope.currentClicked = false;

    $scope.loadTopPods = function () {
      var myPod = {
        type: 'top',
        count: 0
      };

      var promise = webindex.loadPods(myPod);
      promise.then(function (data) {

        if (data.data.length > 0) {
          for (var i = 0; i < data.data.length; i++) {
            data.data[i].coverUrl = requrl + '/Covers/' + data.data[i].coverUrl;
          }
          $scope.main.topPods = data.data;
          webindex.playlist = data.data;
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

    $scope.mainPlaying = "";
    $scope.playThis = function (link) {
      if (link) {
        $scope.mainPlaying = link;
        // link = requrl + '/Podcasts/' + link;
        webindex.currentPod = link;
      }
      else if(!webindex.user){
        $scope.loginFirst=false;
      }
    };

  });
