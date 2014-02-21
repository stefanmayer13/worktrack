'use strict';

angular.module('WorkTrackApp')
  .factory('JiraTask', function ($resource) {
    return $resource('/api/jiratasks/:id?limit=:limit', {
      id: '@id',
      limit: '@limit'
    }, {
      getAll: {
        method: 'GET',
        isArray: false
      }
	  });
  });
