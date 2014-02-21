'use strict';

angular.module('WorkTrackApp').filter('unique', function() {
  return function( items, attr) {
    var filtered = [],
      atrrs = [];
    angular.forEach(items, function(item) {
      if (atrrs.indexOf(item[attr]) === -1) {
        atrrs.push(item[attr]);
        filtered.push(item);
      }
    });
    return filtered;
  };
});