'use strict';

angular.module('WorkTrackApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
