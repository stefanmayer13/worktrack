'use strict';

angular.module('WorkTrackApp')
  .factory('Jira', function Auth($http) {
    return {
      import: function(from, to) {
        console.log(from, to);
        return $http.post('/api/jira', {from: from, to: to}).
          success(function(data) {
            console.log(data);
          });
      }
    };
  });
