'use strict';

angular.module('WorkTrackApp')
  .controller('TasksAdminCtrl', function ($scope, $rootScope, $location, $routeParams, Tasks, Task) {
    $scope.type = '';

    $scope.showAll = function () {
      $rootScope.tasks = {
        tasks: []
      };
      $scope.type = 'all';
      Tasks.getTasks(35, true);
    };

    $scope.showNoSync = function () {
      $rootScope.tasks = {
        tasks: []
      };
      $scope.type = 'tosync';
      Tasks.getTasksToSync(35, true);
    };

    $scope.add = function (task) {
      Task.add({id: task.id}, function () {
        $scope.showNoSync();
      });
    };

    $scope.sync = function (task) {
      Task.sync({id: task.id, jiraid: task.jiraid}, function () {
        $scope.showNoSync();
      });
    };

    $scope.parseHours = function (hours) {
      return ('0' + parseInt(hours, 10)).slice(-2);
    };

    $scope.parseMinutes = function (minutes) {
      return ('0' + minutes%1*60).slice(-2);
    };

    $scope.showAll();
  });
