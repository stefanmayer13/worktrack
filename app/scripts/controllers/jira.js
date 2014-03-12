'use strict';

angular.module('WorkTrackApp')
  .controller('JiraCtrl', function ($scope, Jira) {
    $scope.import = {
      from: (new Date()).toISOString().split('T')[0],
      to: (new Date()).toISOString().split('T')[0]
    };

    $scope.startImport = function () {
      var from = new Date($scope.import.from),
        to = new Date($scope.import.to),
        tmp;
      if (to - from < 0) {
        tmp = from;
        from = to;
        to = tmp;
      }
      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        Jira.import(from, to);
      }
    };
  });
