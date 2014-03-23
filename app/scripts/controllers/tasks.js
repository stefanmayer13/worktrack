'use strict';

angular.module('WorkTrackApp')
  .controller('TasksCtrl', function ($scope, $rootScope, $location, $routeParams, Tasks, $filter) {
    $scope.today = new Date();
    $scope.today.setHours(0);
    $scope.today.setMinutes(0);
    $scope.today.setSeconds(0);
    $scope.today.setMilliseconds(0);

    var getTasks = function () {
      Tasks.getTasksByDay($scope.date).then(function (tasks) {
        $scope.tasks = tasks;
        var weekQuota = 38.5;
        $scope.weekLogWarningLevel = (tasks.workedWeek < weekQuota-4.5 || tasks.workedWeek > weekQuota+5.5) ? 'danger' : ((tasks.workedWeek < weekQuota-2.5 || tasks.workedWeek > weekQuota+4.4) ? 'warning' : ((tasks.workedWeek < weekQuota-0.5 || tasks.workedWeek > weekQuota+1) ? 'info' : 'success'));
      });
    };
    $scope.getToday = function () {
      $scope.date = new Date($scope.today);
      $scope.dateSwitch = $filter('date')($scope.date, 'yyyy-MM-dd');
      $scope.prevDate = new Date($scope.date);
      $scope.prevDate.setDate($scope.date.getDate()-1);
      $scope.nextDate = null;
      getTasks();
    };
    $scope.getToday();

    $scope.prev = function () {
      $scope.nextDate = $scope.date;
      $scope.date = $scope.prevDate;
      $scope.dateSwitch = $filter('date')($scope.date, 'yyyy-MM-dd');
      $scope.prevDate = new Date($scope.date.getTime());
      $scope.prevDate.setDate($scope.date.getDate()-1);
      getTasks();
    };
    $scope.now = function () {
      getTasks();
    };
    $scope.next = function () {
      $scope.prevDate = $scope.date;
      $scope.date = $scope.nextDate;
      $scope.dateSwitch = $filter('date')($scope.date, 'yyyy-MM-dd');

      if (($scope.date - (new Date($scope.today))) < 0) {
        $scope.nextDate = new Date($scope.date.getTime());
        $scope.nextDate.setDate($scope.date.getDate()+1);
      } else {
        $scope.nextDate = null;
      }
      getTasks();
    };

    $scope.parseHours = function (hours) {
      return ('0' + parseInt(hours, 10)).slice(-2);
    };

    $scope.parseMinutes = function (minutes) {
      return ('0' + minutes%1*60).slice(-2);
    };

    $scope.dateChanged = function () {
      $scope.date = new Date($scope.dateSwitch);
      $scope.prevDate = new Date($scope.date);
      $scope.prevDate.setDate($scope.date.getDate()-1);
      if (($scope.date - (new Date($scope.today))) < 0) {
        $scope.nextDate = new Date($scope.date.getTime());
        $scope.nextDate.setDate($scope.date.getDate()+1);
      } else {
        $scope.nextDate = null;
      }
      getTasks();
    };
  });
