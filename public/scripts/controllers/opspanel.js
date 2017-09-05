'use strict';

/**
 * @ngdoc function
 * @name perspecticoApp.controller:OpspanelCtrl
 * @description
 * # OpspanelCtrl
 * Controller of the perspecticoApp
 */
angular.module('perspecticoApp')
  .controller('OpspanelCtrl', function ($scope, $window, opspanel, Upload, requrl, $route, webindex) {

    $scope.opspanel={
      name:"",
      designation:"",
      description:"",
      fblink:"",
      twlink:"",
      lklink:"",
      memberpic:"",
      priority:"",
      allMembers:[],
      allUsers:[]
    };

    var unregister=$scope.$watch(webindex.loaded,function(newValue,oldValue){
        if(!angular.equals(webindex.loaded, false)){
            $scope.loadMembers();
            unregister();
        }
    },true);


    $scope.loadMembers = function () {
      var promise = opspanel.loadMembers();
      promise.then(function (data) {
        if (data.data.message === "unknown") {
          $scope.loadResult = "Not LoggedIn";
          $window.location.reload();
        }
        if (data.data.message === "none") {
          $scope.loadResult = "No members added yet!";
        }
        else if (data.data.length > 0) {
          for(var i=0;i<data.data.length;i++){
            data.data[i].picUrl=requrl+'/Members/'+data.data[i].picUrl;
          }
          $scope.opspanel.allMembers = data.data;
          console.log($scope.opspanel.allMembers);
        }
        else {
          $scope.loadResult = "Error loading! Try again later.";
        }
      }, function (error) {
        $scope.loadResult = "Error Loading! Try again later.";
      });
    };
    $scope.loadMembers();


    $scope.submitMemberForm = function (form) {
      if (form.$valid && $scope.memberForm.file.$valid && $scope.opspanel.memberpic && $scope.opspanel.priority<10) {
        $scope.memberResult = "Uploading";
        $scope.postMember();
      }
      else {
        $scope.memberResult = "Invalid info/file, check before posting.";
      }
    };

    $scope.postMember = function () {
      var member = {
        name: $scope.opspanel.name,
        designation: $scope.opspanel.designation,
        description: $scope.opspanel.description,
        fblink: $scope.opspanel.fblink,
        twlink: $scope.opspanel.lklink,
        lklink: $scope.opspanel.twlink,
        priority: $scope.opspanel.priority
      };

      Upload.upload({
        url: requrl + '/opspanel/postMember', //webAPI exposed to upload the file
        data: {
          file: $scope.opspanel.memberpic,
          // pod:{
          //   title:$scope.opspanel.title,
          //   subtext:$scope.opspanel.sub,
          //   description:$scope.opspanel.description,
          //   type:$scope.opspanel.type
          // }
        },           //pass file as data, should be user ng-model
      }).then(function (data) {
        if (data.data.message === "success") {
          $scope.sendFormData(member);
        }
        else if (data.data.message === "unknown") {
          $scope.memberResult = "Not LoggedIn";
          $window.location.reload();
        }
        else {
          $scope.memberResult = "Posting failed! Try again later.";
        }
      }, function (error) {
        $scope.memberResult = "Posting failed! Try again later.";
      });
    };

    $scope.sendFormData = function (member) {
      var promise = opspanel.postMember(member);
      promise.then(function (data) {
        if (data.data.message === "success") {
          $scope.memberResult = undefined;
          $route.reload();
        }
        else if (data.data.message === "unknown") {
          $scope.memberResult = "Not LoggedIn";
          $window.location.reload();
        }
        else {
          $scope.memberResult = "Posting failed! Try again later.";
        }
      }, function (error) {
        $scope.memberResult = "Posting failed! Try again later.";
      });
    };

    ///Delete Member
    $scope.deleteThis = function (memberId, mindex) {
      var member = {
        memberId: memberId
      };
      var promise = opspanel.deleteMember(member);
      promise.then(function (data) {
        if (data.data.message === "unknown") {
          $scope.memberResult = "Not LoggedIn";
          $window.location.reload();
        }
        else {
          $scope.opspanel.allMembers.splice(mindex, 1);
        }
      }, function (error) {
        //Do nothing
      });
    };


    $scope.loadUsers=()=>{
      var promise = opspanel.loadUsers();
      promise.then(function (data) {
        if (data.data.message === "unknown") {
          $scope.memberResult = "Not LoggedIn";
          $window.location.reload();
        }
        else {
          $scope.opspanel.allUsers=data.data;
          $scope.userMessge = undefined;
        }
      }, function (error) {
        $scope.userMessge = 'Error occured! Try again later';
      });
    };

  });
