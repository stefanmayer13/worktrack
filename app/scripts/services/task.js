'use strict';

angular.module('WorkTrackApp')
  .factory('Task', function ($resource) {
    return $resource('/api/tasks/:id?limit=:limit', {
      id: '@id',
      limit: '@limit'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      },
      getAll: {
        method: 'GET',
        isArray:true
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
