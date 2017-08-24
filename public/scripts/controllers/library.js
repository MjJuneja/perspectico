'use strict';

/**
 * @ngdoc function
 * @name perspecticoApp.controller:LibraryCtrl
 * @description
 * # LibraryCtrl
 * Controller of the perspecticoApp
 */
angular.module('perspecticoApp')
  .controller('LibraryCtrl', function ($scope, webindex, requrl) {

    $scope.library = {
      allPods: [],
      showPods: [],
      search: ""
    };

    var financePods = [],
      marketingPods = [],
      eprPods = [],
      consultingPods = [];

    $scope.loadAllPods = function (myPod) {
      var promise = webindex.loadPods(myPod);
      promise.then(function (data) {
        if (data.data.message === "none") {
          $scope.allPodsResult = "No podcasts uploaded yet! Coming soon.";
        }
        else if (data.data.length > 0) {
          for (var i = 0; i < data.data.length; i++) {
            data.data[i].coverUrl = requrl + '/Covers/' + data.data[i].coverUrl;
            if (data.data[i].type === 'finance') {
              financePods.push(data.data[i]);
            }
            else if (data.data[i].type === 'marketing') {
              marketingPods.push(data.data[i]);
            }
            else if (data.data[i].type === 'entrepreneurship') {
              eprPods.push(data.data[i]);
            }
            else if (data.data[i].type === 'consulting') {
              consultingPods.push(data.data[i]);
            }
          }
          $scope.library.allPods = data.data;
          $scope.library.showPods = data.data;
          console.log($scope.library.allPods);
        }
        else {
          $scope.allPodsResult = "Error loading! Try again later.";
        }
      }, function (error) {
        $scope.allPodsResult = "Error Loading! Try again later.";
      });

    };

    var loadAllObject = {
      type: 'search',
      count: 0
    }
    $scope.loadAllPods(loadAllObject);

    $scope.showThese = function (type) {
      switch (type) {
        case 'all': $scope.library.showPods = $scope.library.allPods; break;
        case 'marketing': $scope.library.showPods = marketingPods; break;
        case 'finance': $scope.library.showPods = financePods; break;
        case 'entrepreneurship': $scope.library.showPods = eprPods; break;
        case 'consulting': $scope.library.showPods = consultingPods; break;
      }
    };

    $scope.search = function () {
      var searchObj = {
        type: 'search',
        count: 0,
        filters: {
          search: $scope.library.search,
        },
      }
      $scope.loadAllPods(searchObj);
    };

  });
