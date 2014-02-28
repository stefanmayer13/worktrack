'use strict';

angular.module('WorkTrackApp')
  .factory('Tasks', function Auth($rootScope, Session, Task) {
    return {
      getTasks: function(limit, reset, callback) {
        var start = 0,
          cb = callback || angular.noop;

        if ($rootScope.tasksCalled) {
          return;
        } else {
          $rootScope.tasksCalled = true;
        }

        if ($rootScope.tasks && !reset) {
          if ($rootScope.tasks.length > limit) {
            return $rootScope.tasks;
          } else {
            start = $rootScope.tasks.length;
          }
        }

        return Task.getNotSynced({start: start || 0, limit: limit || 5}, function(tasks) {
          if (tasks) {
            if (!$rootScope.tasks || $rootScope.tasks.length === 0 || reset) {
              $rootScope.tasks = tasks;
            } else {
              $rootScope.tasks = $rootScope.tasks.concat(tasks);
            }
          }
          $rootScope.tasksCalled = false;
          return cb($rootScope.tasks);
        }, function(err) {
          $rootScope.tasksCalled = false;
          console.log(err);
          return cb(err);
        }).$promise;
      }
    };
  });
