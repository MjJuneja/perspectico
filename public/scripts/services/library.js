'use strict';

/**
 * @ngdoc service
 * @name perspecticoApp.library
 * @description
 * # library
 * Factory in the perspecticoApp.
 */
angular.module('perspecticoApp')
  .factory('library', function (requrl,$http,$q) {
    // Service logic
    // ...

      var object= {

        likePod:function(obj){
          var defer = $q.defer();
          $http.post(requrl+'/commonroutes/likePod',obj)
          .then(function(data){
            defer.resolve(data);
          },function(error){
            defer.reject(error);
          })
          return defer.promise;
        },

      };
    return object;

  });
