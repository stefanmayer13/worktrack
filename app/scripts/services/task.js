'use strict';

angular.module('WorkTrackApp')
  .factory('Task', function ($resource) {
    return $resource('/api/tasks/:id?limit=:limit', {
      id: '@id',
      limit: '@limit'
    }, {
      update: {
        method: 'PUT',
        params: {}
      },
      getAll: {
        method: 'GET'
      },
      getByDay: {
        method: 'GET',
        params: {
          id: 'byday'
        }
      },
      getNotSynced: {
        method: 'GET',
        params: {
          id: 'sync'
        }
      },
      add: {
        method: 'PUT',
        params: {}
      },
      sync: {
        method: 'POST',
        params: {}
      }
	  });
  });
