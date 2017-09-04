'use strict';

/**
 * @ngdoc function
 * @name perspecticoApp.controller:WebindexCtrl
 * @description
 * # WebindexCtrl
 * Controller of the perspecticoApp
 */
angular.module('perspecticoApp')
  .controller('WebindexCtrl', function ($scope, webindex, requrl, $window, $timeout, $rootScope, $location, ngAudio, library) {

    $scope.loading_screen = pleaseWait({
      logo: "../images/Loading_Text.png",
      backgroundColor: '#ffffff',
      //loadingHtml: "<div class='sk-wandering-cubes'><div class='sk-cube sk-cube1'></div><div class='sk-cube sk-cube2'></div></div>"
      loadingHtml: "<div class='sk-wave'><div class='sk-rect sk-rect1'></div><div class='sk-rect sk-rect2'></div><div class='sk-rect sk-rect3'></div><div class='sk-rect sk-rect4'></div><div class='sk-rect sk-rect5'></div></div>"
      //look in spinkit.css for more loading animations
    });

    $scope.redirect = function () {
      if (webindex.loaded === true && webindex.loggedIn === true) {
        if ($location.path() === '/login' || $location.path() === '/signup') {
          $scope.hideHF = false;
          $window.location.assign(requrl + '/#/');
        }
      }
      else if (webindex.loaded === true && webindex.loggedIn != true) {
        if ($location.path() === '/profile' || $location.path() === '/admin' || $location.path() === '/addmember') {
          $window.location.assign(requrl + '/#/login');
        }
      }
    };

    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
      if ($location.path() === '/login' || $location.path() === '/signup') {
        $scope.hideHF = true;
      }
      else {
        $scope.hideHF = false;
      }
      $scope.redirect();
    });


    $scope.loginStatus = "Login/SignUp";
    $scope.ActivationStatus = true;
    $scope.LoginButton = false;
    $scope.SignupButton = false;
    $scope.ProfileButton = true;
    $scope.LogoutButton = true;
    $scope.hideHF = false;
    $scope.loginFirst = true;
    $scope.initiated = false;

    $scope.ActivationMessage = undefined;

    $scope.loadData = function () {
      var promise = webindex.checkStatus();
      $scope.loadTopPods();
      promise.then(function (data) {
        if (data.data.message === "fail") {
          $scope.loginStatus = "Login/SignUp";
        }
        else if (data.data.Message != undefined) {
          $scope.loginStatus = data.data.Message;
          webindex.userData = data.data.userData;

          if (data.data.Email != undefined && data.data.ActivationStatus === false) {
            $scope.Status = "Your Email address " + data.data.Email + " is not Verified";
            $scope.ActivationStatus = false;

          }
          webindex.loggedIn = true;
          $scope.LoginButton = true;
          $scope.SignupButton = true;
          $scope.ProfileButton = false;
          $scope.LogoutButton = false;
          $scope.loadwishedPods();
        }
        else {
          $scope.loginStatus = "Login/SignUp";
        }
        webindex.needReload = false;
        webindex.loaded = true;
        $scope.redirect();
      });
    };

    $scope.$watch(function () { return webindex.needReload }, function (newValue, oldValue) {
      if (webindex.needReload === true) {
        $scope.loadData();
      }
    }, true);

    ////////////////////////////
    $scope.sendLinkButton = false;

    $scope.SendActivationLink = function () {
      var promise = webindex.sendActivationLink();
      promise.then(function (data) {
        if (data.data.message === "success") {
          $scope.ActivationMessage = "Link Sent. Wait for 1 minute to send new link";
          $scope.sendLinkButton = true;
          $timeout(function () {
            $scope.sendLinkButton = false;
            $scope.ActivationMessage = undefined;
          }, 60000);
        }
        else if (data.data.message === "unknown") {
          $window.location.reload();
        }
        else {
          $scope.ActivationMessage = "Error,Try again Later";
        }
      }, function (error) {
        $scope.ActivationMessage = "Error,Try again Later";
      });
    };

    ///////////////////////////////
    $scope.Logout = function () {
      var promise = webindex.logout();
      promise.then(function (data) {
        $window.location.reload();
      }, function (error) {
        $scope.LogoutMessage = "Error,Try again Later";
      });
    };

    ///Load top 10
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
          $scope.playlistPods = data.data;
          console.log($scope.playlistPods);
        }
        else {
          console.log("Error loading! Try again later.");
        }
      }, function (error) {
        console.log("Error loading! Try again later.");
      });
    };

    //////Load wishlisted

    $scope.loadwishedPods = function () {
      var myPod = {
        type: 'wished',
        count: 0
      };

      var promise = webindex.loadPods(myPod);
      promise.then(function (data) {

        if (data.data.length > 0) {
          for (var i = 0; i < data.data.length; i++) {
            data.data[i].coverUrl = requrl + '/Covers/' + data.data[i].coverUrl;
          }
          $scope.wishedPods = data.data;
          webindex.wishedPods = data.data;
        }
        else {
          $scope.wishedPods = [];
          webindex.wishedPods = [];
          console.log("Error loading! Try again later.");
        }
      }, function (error) {
        console.log("Error loading! Try again later.");
      });
    };

    $scope.unwishThis = function (podId) {
      var Pod = {
        podId: podId
      };

      var promise = library.wishPod(Pod);
      promise.then(function (data) {
        var indexOfobj = $scope.wishedPods.findIndex(i => i.podId === podId);
        $scope.wishedPods.splice(indexOfobj, 1);
        webindex.wishedPods.splice(indexOfobj, 1);

      }, function (error) {
        console.log("Error loading! Try again later.");
      });
    };


    $scope.currentPlaying = "";
    $scope.playlistPlay = function (link) {
      if (link) {
        // link = requrl + '/Podcasts/' + link;
        webindex.currentPod = link;
      } else {
        $scope.loginFirst = false;
      }
    };

    $scope.$watch(function () { return webindex.isWished }, function (newValue, oldValue) {
      if ($scope.wishedPods && webindex.isWished.length !== $scope.wishedPods.length) {
        $scope.loadwishedPods();
      }
    }, true);


    //////////////Audio Player
    $scope.played = [];

    $scope.$watch(function () { return webindex.currentPod }, function (newValue, oldValue) {
      if (webindex.currentPod) {
        $scope.playThis(webindex.currentPod);
      }
    }, true);

    $scope.playThis = function (link) {
      $scope.currentPlaying = link;
      if (!$scope.previousPlay) {
        $scope.played.push(link);
      }
      else {
        $scope.previousPlay = false;
      }

      $scope.initiated = true;

      link = requrl + '/Podcasts/' + link;

      try {
        $scope.audio = ngAudio.load(link);
        $scope.audio.play();
      }
      catch (error) {
      }
    };
    $scope.audio={progress:0};
    $scope.player={progress:0};

    var myEl = angular.element( document.querySelector( '#seekBar' ) );
    $scope.$watch(function () { return $scope.audio.progress }, function (newValue, oldValue) {
      // console.log(typeof($scope.audio.progress),$scope.audio.progress);
      $scope.player.progress=Number($scope.audio.progress);
      var val = $scope.player.progress * 100;
      var buf = ((100 - val) / 4) + parseInt(val);
      myEl.css(
        'background',
        'linear-gradient(to right, #4cb6cb 0%, #4cb6cb ' + val + '%, #777 ' + val + '%, #777 ' + buf + '%, #444 ' + buf + '%, #444 100%)'
      );
    }, true);

    $scope.previousPlay = false;
    $scope.playPrevious = function () {
      if ($scope.played.length > 1) {
        $scope.previousPlay = true;
        if(webindex.currentPod===$scope.played[$scope.played.length - 2]){
          if($scope.counter>0){
            $scope.counter--;
          }
          $scope.playNext();
        }else{
          webindex.currentPod = $scope.played[$scope.played.length - 2];
        }
      }
    };

    $scope.counter = 0
    $scope.playNext = function () {

      if ($scope.counter>-1 && $scope.counter < $scope.playlistPods.length) {
        webindex.currentPod = $scope.playlistPods[$scope.counter].fileUrl;
        $scope.counter++;
      }
      else{
        $scope.counter=0;
      }
    };

  });
