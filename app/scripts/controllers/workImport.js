'use strict';

angular.module('WorkTrackApp')
  .controller('WorkImportCtrl', function ($scope, Work, Task) {
    $scope.tasks = [];
    $scope.input = '';
    $scope.submit = function () {
      $scope.tasks = [];
      $scope.total = 0;

      var inputs = $scope.input.split('\n'),
          oldDate = new Date();
      inputs.forEach(function (input) {
        var task = {
          synctojira: true,
          persistdate: true,
          input: input,
          calculatedhours: false,
          oldDate: oldDate
        };
        Work.parseInput(task);
        if (task && task.date && !task.nr) {
          oldDate = new Date(task.start);
        } else if (task && task.date) {
          $scope.tasks.push(task);
          $scope.total += task.end - task.start;
          var taskCopy = angular.copy(task);
          taskCopy.start = taskCopy.start.getTime();
          taskCopy.end = taskCopy.end.getTime();
          Task.save(taskCopy,
          function() {
            task.sync = 'ok';
          },
          function(err) {
            console.log(err);
          });
        }
      });
      $scope.total -= 3600000;
    };
  });
