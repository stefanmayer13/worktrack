'use strict';

angular.module('WorkTrackApp')
  .factory('JiraTasks', function Auth($rootScope, $filter, JiraTask) {
    return {
      getTasks: function(callback, date) {
        var cb = callback || angular.noop;

        if (!date) {
          date = new Date();
        }
        date = $filter('date')(date, 'yyyy-MM-dd');

        return JiraTask.getAll({date: date}, function(tasks) {
          return cb(tasks);
        }, function(err) {
          console.log(err);
          return cb(err);
        }).$promise;
      }
    };
  });
