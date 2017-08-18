'use strict';

/**
 * @ngdoc service
 * @name perspecticoApp.signup
 * @description
 * # signup
 * Factory in the perspecticoApp.
 */
angular.module('perspecticoApp')
  .factory('signup', function ($http,$q,requrl) {

    var object = {

        checkUsername:function(usernameObj){
           var defer = $q.defer();
           $http.post(requrl+'/commonroutes/checkUsername',usernameObj)
           .then(function(data){
               defer.resolve(data);
           },function(error){
               defer.reject(error);
           })
            return defer.promise;
        },

        registerUser:function(userObject){
          var defer = $q.defer();
           $http.post(requrl+'/signup/registerUser',userObject)
           .then(function(data){
               defer.resolve(data);
           },function(error){
               defer.reject(error);
           })
            return defer.promise;
        }

    };
    return object;

  });
