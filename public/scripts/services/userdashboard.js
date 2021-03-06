'use strict';

/**
 * @ngdoc service
 * @name perspecticoApp.userdashboard
 * @description
 * # userdashboard
 * Factory in the perspecticoApp.
 */
angular.module('perspecticoApp')
  .factory('userdashboard', function ($http,$q,requrl) {
    // Service logic
    // ...
    var object = {

      postPod: function (pod) {
        var defer = $q.defer();
        $http.post(requrl + '/userdashboard/postPod', pod)
          .then(function (data) {
            defer.resolve(data);
          }, function (error) {
            defer.reject(error);
          })
        return defer.promise;
      },

      deletePod: function (pod) {
        var defer = $q.defer();
        $http.post(requrl + '/commonroutes/deletePod', pod)
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
