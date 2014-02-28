'use strict';

angular.module('WorkTrackApp')
  .controller('JiraTasksCtrl', function ($scope, JiraTasks) {
    $scope.date = new Date();
    $scope.prevDate = new Date();
    $scope.prevDate.setDate($scope.date.getDate()-1);
//    $scope.nextDate = new Date();
//    $scope.nextDate.setDate($scope.date.getDate()+1);
    $scope.jiratasks = null;
    var getTasks = function () {
      JiraTasks.getTasks(function (tasks) {
        $scope.jiratasks = tasks;
      }, $scope.date);
    };
    getTasks();

    $scope.prev = function () {
      $scope.nextDate = $scope.date;
      $scope.date = $scope.prevDate;
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

      if (($scope.date - (new Date())) < 3600) {
        $scope.nextDate = new Date($scope.date.getTime());
        $scope.nextDate.setDate($scope.date.getDate()+1);
      } else {
        $scope.nextDate = null;
      }
      getTasks();
    };
  });
