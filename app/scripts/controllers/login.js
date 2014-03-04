'use strict';

angular.module('WorkTrackApp')
  .controller('LoginCtrl', function ($scope, Auth) {
    $scope.texts = {
      title: 'Welcome to Work Track',
      logintext: 'Please login to track your time.',
      username: 'Username',
      password: 'Password',
      signin: 'Sign In'
    };
    var init = function () {
      $scope.user = {};
      $scope.errors = {};
      $scope.submitted = false;
    };
    init();

    $scope.signin = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          username: $scope.user.username,
          password: $scope.user.password
        })
        .then( function() {
          init();
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors.other = err.errorMessages[0];
        });
      }
    };
  });