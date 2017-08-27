'use strict';

/**
 * @ngdoc service
 * @name perspecticoApp.opspanel
 * @description
 * # opspanel
 * Factory in the perspecticoApp.
 */
angular.module('perspecticoApp')
  .factory('opspanel', function ($http, $q, requrl) {
    // Service logic
    // ...
    var object = {

      postMember: function (member) {
        var defer = $q.defer();
        $http.post(requrl + '/opspanel/postMember', member)
          .then(function (data) {
            defer.resolve(data);
          }, function (error) {
            defer.reject(error);
          })
        return defer.promise;
      },

      deleteMember: function (member) {
        var defer = $q.defer();
        $http.post(requrl + '/opspanel/deleteMember', member)
          .then(function (data) {
            defer.resolve(data);
          }, function (error) {
            defer.reject(error);
          })
        return defer.promise;
      },

      loadMembers: function (member) {
        var defer = $q.defer();
        $http.post(requrl + '/opspanel/loadMembers')
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
