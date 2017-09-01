'use strict';

/**
 * @ngdoc function
 * @name perspecticoApp.controller:LibraryCtrl
 * @description
 * # LibraryCtrl
 * Controller of the perspecticoApp
 */
angular.module('perspecticoApp')
  .controller('LibraryCtrl', function ($scope, webindex, requrl, library, $window) {

    $scope.isLiked = [];
    $scope.isWished = [];
    $scope.library = {
      allPods: [],
      showPods: [],
      search: "",
      podType:"All"
    };

    $scope.loginFirst = true;

    var financePods = [],
      marketingPods = [],
      eprPods = [],
      consultingPods = [];

    $scope.loadAllPods = function (myPod) {
      financePods = [],
      marketingPods = [],
      eprPods = [],
      consultingPods = [];
      var promise = webindex.loadPods(myPod);
      promise.then(function (data) {
        if (data.data.message === "none") {
          $scope.allPodsResult = "No podcasts uploaded yet! Coming soon.";
        }
        else if (data.data.length > 0) {
          for (var i = 0; i < data.data.length; i++) {
            data.data[i].coverUrl = requrl + '/Covers/' + data.data[i].coverUrl;
            data.data[i].liked=(data.data[i].likedBy[0] === 'true');
            data.data[i].wished=(data.data[i].wishedBy[0] === 'true');
            if (data.data[i].liked) {
              $scope.isLiked.push(data.data[i].podId);
            }
            if (data.data[i].wished) {
              $scope.isWished.push(data.data[i].podId);
              webindex.isWished.push(data.data[i].podId);
            }
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
      $scope.library.podType=type;
      switch (type) {
        case 'all': $scope.library.showPods = $scope.library.allPods; break;
        case 'marketing': $scope.library.showPods = marketingPods; break;
        case 'finance': $scope.library.showPods = financePods; break;
        case 'entrepreneurship': $scope.library.showPods = eprPods; break;
        case 'consulting': $scope.library.showPods = consultingPods; break;
      }
    };

    ////Search in library
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

    ////////Play podcast
    $scope.playThis = function (link) {
      if (link) {
        link = requrl + '/Podcasts/' + link;
        webindex.currentPod = link;
      }
      else if (!webindex.user) {
        $scope.loginFirst = false;
      }
    };

    ////////Like this
    $scope.likeThis = function (podId, pindex) {
      if (!webindex.userData.useremail) {
        $scope.loginFirst = false;
      }
      else if ($scope.isLiked.indexOf(podId)===-1) {
        var pod = {
          podId: podId
        };
        var promise = library.likePod(pod);
        promise.then(function (data) {
          if (data.data.message === "unknown") {
            $window.location.reload();
          }
          else {
            $scope.isLiked.push(podId);
            $scope.library.allPods[pindex].likes = $scope.library.allPods[pindex].likes + 1;
          }
        }, function (error) {
          $scope.isLiked.push(podId);
          $scope.library.allPods[pindex].likes = $scope.library.allPods[pindex].likes + 1;
        });
      }
    }

        ////////Wishlist this
    $scope.wishThis = function (podId, pindex) {
      if (!webindex.userData.useremail) {
        $scope.loginFirst = false;
      }
      else{
        var pod = {
          podId: podId
        };
        var promise = library.wishPod(pod);
        promise.then(function (data) {
          if (data.data.message === "unknown") {
            $window.location.reload();
          }
          else if(data.data.message==='wished') {
            $scope.isWished.push(podId);
            webindex.isWished.push(podId);
          }
          else{
            var i=$scope.isWished.indexOf(podId);
            $scope.isWished.splice(i,1);
            webindex.isWished.splice(i,1);
          }
        }, function (error) {
          $scope.isWished.push(podId);
        });
      }
    }

  });
