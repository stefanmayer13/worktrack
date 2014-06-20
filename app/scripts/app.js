'use strict';

angular.module('WorkTrackApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/workImport', {
        templateUrl: 'partials/workImport',
        controller: 'WorkImportCtrl'
      })
      .when('/tasks/:action?', {
        templateUrl: 'partials/tasks',
        controller: 'TasksCtrl',
        authenticate: true
      })
      .when('/account', {
        templateUrl: 'partials/account',
        controller: 'AccountCtrl',
        authenticate: true
      })
      .when('/jiratasks', {
        templateUrl: 'partials/jira-tasks',
        controller: 'JiraTasksCtrl',
        authenticate: true
      })
      .when('/jira/:action?', {
        templateUrl: 'partials/jira',
        controller: 'JiraCtrl',
        authenticate: true
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and 403s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', '$rootScope', function($q, $location, $rootScope) {
      return {
        'responseError': function(response) {
          if(response.status === 401) { //  || response.status === 403
            $rootScope.currentUser = null;
            $location.path('/');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/');
      }
    });
  });