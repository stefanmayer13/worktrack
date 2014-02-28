'use strict';

angular.module('WorkTrackApp').filter('checkmark', function() {
  return function(input) {
    switch (input) {
    case 'ok':
      return '\u2713';
    case 'conflict':
      return '\uff01';
    default:
      return '\u2718';
    }
  };
});