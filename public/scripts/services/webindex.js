'use strict';

/**
 * @ngdoc service
 * @name perspecticoApp.webindex
 * @description
 * # webindex
 * Factory in the perspecticoApp.
 */
angular.module('perspecticoApp')
  .factory('webindex', function ($http,$q,requrl) {

      var object = {

        needReload:true,
        loaded:false,
        loggedIn:false,
        userData:{},
        currentPod:"",
        isWished:[],
        wishedPods:[],

        checkStatus:function(){
          var defer = $q.defer();
          $http.post(requrl+'/webindex')
          .then(function(data){
               defer.resolve(data);
           },function(error){
               defer.reject(error);
           })
            return defer.promise;
        },

        sendActivationLink:function(){
          var defer = $q.defer();
          $http.post(requrl+'/sendActivationLink')
          .then(function(data){
               defer.resolve(data);
           },function(error){
               defer.reject(error);
           })
            return defer.promise;
        },

        logout:function(){
          var defer = $q.defer();
          $http.post(requrl+'/logout')
          .then(function(data){
               defer.resolve(data);
           },function(error){
               defer.reject(error);
           })
            return defer.promise;
        },

        loadPods: function (pod) {
        var defer = $q.defer();
        $http.post(requrl + '/commonroutes/loadPods', pod)
          .then(function (data) {
            defer.resolve(data);
          }, function (error) {
            defer.reject(error);
          })
        return defer.promise;
        },

    };
    return object;

  });
