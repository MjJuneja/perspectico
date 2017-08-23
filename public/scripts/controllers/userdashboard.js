'use strict';

/**
 * @ngdoc function
 * @name perspecticoApp.controller:UserdashboardCtrl
 * @description
 * # UserdashboardCtrl
 * Controller of the perspecticoApp
 */
angular.module('perspecticoApp')
  .controller('UserdashboardCtrl', function ($scope, Upload, requrl, userdashboard, $location, $route, $window) {

    $scope.userdashboard = {
      newPodcastForm: false,
      myPodcasts: false,
      uploadCoverForm: false,
      mypods: [],
      title: "",
      sub: "",
      description: "",
      type: "",
      podcast: "",
      cover: "",
      selectedPod: "",
    };


    $scope.loadMyPods = function () {
      var myPod = {
        type: 'userPods',
        count: 0
      };

      var promise = userdashboard.loadMyPods(myPod);
      promise.then(function (data) {
        if (data.data.message === "unknown") {
          $scope.myPodsResult = "Not LoggedIn";
          $window.location.reload();
        }
        if (data.data.message === "none") {
          $scope.myPodsResult = "No podcasts uploaded yet!";
          $scope.userdashboard.uploadCoverForm = true;
        }
        else if (data.data.length > 0) {
          $scope.userdashboard.mypods = data.data;
          console.log($scope.userdashboard.mypods);
        }
        else {
          $scope.myPodsResult = "Error loading! Try again later.";
        }
      }, function (error) {
        $scope.myPodsResult = "Error Loading! Try again later.";
      });
    };

    $scope.loadMyPods();


    $scope.submitPodForm = function (form) {
      if (form.$valid && $scope.podForm.file.$valid && $scope.userdashboard.podcast) {
        $scope.postResult = "Uploading";
        $scope.postPod();
      }
      else {
        $scope.postResult = "Invalid info/file, check before posting.";
      }
    };

    $scope.postPod = function () {
      var pod = {
        title: $scope.userdashboard.title,
        subtext: $scope.userdashboard.sub,
        description: $scope.userdashboard.description,
        type: $scope.userdashboard.type
      };

      Upload.upload({
        url: requrl + '/userdashboard/postPod', //webAPI exposed to upload the file
        data: {
          file: $scope.userdashboard.podcast,
          // pod:{
          //   title:$scope.userdashboard.title,
          //   subtext:$scope.userdashboard.sub,
          //   description:$scope.userdashboard.description,
          //   type:$scope.userdashboard.type
          // }
        },           //pass file as data, should be user ng-model
      }).then(function (data) {
        if (data.data.message === "success") {
          $scope.sendFormData(pod);
        }
        else if (data.data.message === "unknown") {
          $scope.postResult = "Not LoggedIn";
          $window.location.reload();
        }
        else {
          $scope.postResult = "Posting failed! Try again later.";
        }
      }, function (error) {
        $scope.postResult = "Posting failed! Try again later.";
      });
    };

    $scope.sendFormData = function (pod) {
      var promise = userdashboard.postPod(pod);
      promise.then(function (data) {
        if (data.data.message === "success") {
          $scope.postResult = undefined;
          $route.reload();
        }
        else if (data.data.message === "unknown") {
          $scope.postResult = "Not LoggedIn";
          $window.location.reload();
        }
        else {
          $scope.postResult = "Posting failed! Try again later.";
        }
      }, function (error) {
        $scope.postResult = "Posting failed! Try again later.";
      });
    };

    ///Delete podcast
    $scope.deleteThis = function (podId, pindex) {
      $scope.userdashboard.selectedPod="";
      var pod = {
        podId: podId
      };
      var promise = userdashboard.deletePod(pod);
      promise.then(function (data) {
        $scope.userdashboard.selectedPod="";
        if (data.data.message === "unknown") {
          $scope.postResult = "Not LoggedIn";
          $window.location.reload();
        }
        else {
          $scope.userdashboard.mypods.splice(pindex, 1);
        }
      }, function (error) {
        //Do nothing
      });
    };

    ///// Select Podcast
    $scope.selectPod = function (podId) {
      console.log(podId);
      $scope.userdashboard.selectedPod = podId;
    };

    ////////////// Cover pic upload //////////////
    $scope.checkCover = function () {
      if (!$scope.userdashboard.selectedPod) {
        $scope.picMessage = "Select a podcast first!";
      }
      else if ($scope.coverForm.file.$valid && $scope.userdashboard.cover && $scope.userdashboard.selectedPod) {
        $scope.uploadCover($scope.userdashboard.cover);
        $scope.picMessage = "Uploading..";
      }
      else {
        $scope.picMessage = "Invalid image";
      }
    }

    $scope.uploadCover = function (file) {
      var callurl=requrl + '/userdashboard/uploadCover?podId='+$scope.userdashboard.selectedPod;
      Upload.upload({
        url: callurl, //webAPI exposed to upload the file
        data:{
          file: file,
        }         //pass file as data, should be user ng-model
      }).then(function (data) {
        if (data.data.message === "success") {
          $scope.picMessage = "Upload successfull";
          // var random = (new Date()).toString();
          // $scope.profileUrl = $scope.profileUrl + "?cb=" + random;
          $scope.picMessage = undefined;
        }
        else if (data.data.message === "unknown") {
          $scope.picMessage = "Not LoggedIn";
          $window.location.reload();
        }
        else {
          $scope.picMessage = "Upload fail";
        }
      }, function (error) {
        $scope.picMessage = "Upload fail";
      });
    };

  });
