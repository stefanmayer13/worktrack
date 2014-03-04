'use strict';

angular.module('WorkTrackApp')
  .controller('WorkCtrl', function ($scope, $rootScope, $filter, Work, Task, Tasks) {
    //$scope.task = {input: 'SPOSP-1 0800 0900 0801 Description Bla'};
    $scope.autocomplete = false;
    $scope.activeIndex = 0;
    $scope.task = {
      synctojira: true
    };
    $scope.valueEnteredChanged = function () {
      Work.parseInput($scope.task);
      if ($scope.task.nr && $scope.task.step < 2) {
        $scope.autocomplete = true;
        var length =($filter('filter')($rootScope.tasks, $scope.task.nr)).length;
        if ($scope.activeIndex >= length) {
          $scope.activeIndex = length > 0 ? length - 1 : 0;
        }
      } else {
        $scope.autocomplete = false;
      }
    };
    $scope.submit = function () {
      if ($scope.task.step < 3) {
        if ($scope.task.step < 2) {
          var filteredTasks = ($filter('filter')($rootScope.tasks, $scope.task.nr));
          if (filteredTasks.length > 0 && filteredTasks[$scope.activeIndex]) {
            $scope.task.input = filteredTasks[$scope.activeIndex].nr;
            Work.parseInput($scope.task);
          }
        }
        return;
      }
      var task = angular.copy($scope.task);
      task.start = task.start.getTime();
      task.end = task.end.getTime();
      Task.save(task,
        function() {
          $scope.task = {
            persistdate: $scope.task.persistdate,
            calculatedhours: $scope.task.calculatedhours,
            synctojira: $scope.task.synctojira,
            oldDate: $scope.task.oldDate
          };
          document.getElementsByName('task')[0].blur();
          $scope.autocomplete = false;
          Tasks.getTasks(5, true);
        },
        function(err) {
          console.log(err);
        });
    };
    $scope.keydown = function (event) {
      if(event.which === 40) {
        if ($scope.activeIndex + 1 < event.target.nextElementSibling.children[0].children.length) {
          $scope.activeIndex++;
        }
        event.preventDefault();
      } else if(event.which === 38) {
        if ($scope.activeIndex > 0) {
          $scope.activeIndex--;
        }
        event.preventDefault();
      }
    };
    $scope.selectTaskNr = function (task) {
      $scope.task.input = task.nr;
      document.getElementsByName('task')[0].focus();
      Work.parseInput($scope.task);
    };
    $scope.onFocus = function (event) {
      window.setTimeout(function () {
        event.target.previousElementSibling.scrollIntoView();
      }, 200);
    };
    $scope.getMore = function () {
      Tasks.getTasks($rootScope.tasks.tasks.length + 5);
    };
    Tasks.getTasks(5, true);
  });
