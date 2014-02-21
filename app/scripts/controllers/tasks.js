'use strict';

angular.module('WorkTrackApp')
  .controller('TasksCtrl', function (Tasks) {
    Tasks.getTasks(20);
  });
