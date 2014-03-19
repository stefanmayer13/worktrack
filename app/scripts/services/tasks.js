'use strict';

angular.module('WorkTrackApp')
  .factory('Tasks', function Auth($rootScope, Session, Task, $q, $filter) {
    return {
      getTasks: function(limit, reset, callback) {
        var start = 0,
          cb = callback || angular.noop;

        if ($rootScope.tasks && $rootScope.tasks.tasks && !reset) {
          if ($rootScope.tasks.tasks.length > limit) {
            return $rootScope.tasks;
          } else {
            start = $rootScope.tasks.tasks.length;
          }
        }

        return Task.getAll({start: start || 0, limit: (limit - start) || 5}, function(tasks) {
          if (tasks) {
            if (!$rootScope.tasks || $rootScope.tasks.tasks.length === 0 || reset) {
              $rootScope.tasks = tasks;
            } else {
              $rootScope.tasks.tasks = $rootScope.tasks.tasks.concat(tasks.tasks);
            }
          }
          return cb($rootScope.tasks);
        }, function(err) {
          console.log(err);
          return cb(err);
        }).$promise;
      },

      getTasksByDay: function (date, cb) {
        var deferred = $q.defer();
        if (!date) {
          date = new Date();
        }
        date = $filter('date')(date, 'yyyy-MM-dd');
        Task.getByDay({date: date}, function(tasks) {
          if (cb) {
            cb($rootScope.tasks);
          }
          deferred.resolve(tasks);
        }, function(err) {
          console.log(err);
          if (cb) {
            cb(err);
          }
          deferred.reject(err);
        });
        return deferred.promise;
      },

      getTasksToSync: function(limit, reset, callback) {
        var start = 0,
          cb = callback || angular.noop;

        return Task.getNotSynced({start: start || 0, limit: limit || 5}, function(tasks) {
          if (tasks) {
            $rootScope.tasks = tasks;
          }
          return cb($rootScope.tasks);
        }, function(err) {
          console.log(err);
          return cb(err);
        }).$promise;
      }
    };
  });
