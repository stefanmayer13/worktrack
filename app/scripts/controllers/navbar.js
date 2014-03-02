'use strict';

angular.module('WorkTrackApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $rootScope) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/',
      'login': false
    }, {
      'title': 'Tasks',
      'link': '/tasks',
      'login': true
    }, {
      'title': 'Account',
      'link': '/account',
      'login': true
    }];
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/');
      });
    };

    $scope.navFilter = function(nav)
    {
      if(nav.login && !$rootScope.currentUser)
      {
        return false;
      }

      return true;
    };
    
    $scope.isActive = function(route) {
      var path = $location.path().split('/');
      return route === '/' + path[1];
    };
  });
