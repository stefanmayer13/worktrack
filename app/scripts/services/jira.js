'use strict';

angular.module('WorkTrackApp')
  .factory('Jira', function ($resource) {
    return $resource('/api/jirasession', {
    }, {
      getSession: {
        method: 'GET',
        params: {}
      }
    });
  });
