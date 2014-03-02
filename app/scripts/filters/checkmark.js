'use strict';

angular.module('WorkTrackApp').filter('checkmark', function() {
  return function(input) {
    switch (input) {
    case undefined:
    case '':
      return '\u2718';
    case 'add':
      return '\u002B';
    case 'conflict':
      return '\uff01';
    default:
      return '\u2713';
    }
  };
});