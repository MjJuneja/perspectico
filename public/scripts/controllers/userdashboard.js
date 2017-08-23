'use strict';

/**
 * @ngdoc function
 * @name perspecticoApp.controller:UserdashboardCtrl
 * @description
 * # UserdashboardCtrl
 * Controller of the perspecticoApp
 */
angular.module('perspecticoApp')
  .controller('UserdashboardCtrl', function ($scope, Upload, requrl, userdashboard) {

    $scope.userdashboard = {
      newPodcastForm: false,
      title: "",
      sub: "",
      description: "",
      type: "",
      podcast: ""
    };

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


  });
