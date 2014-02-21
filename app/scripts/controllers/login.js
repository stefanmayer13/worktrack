'use strict';

angular.module('WorkTrackApp')
  .controller('LoginCtrl', function ($scope, Auth) {
    $scope.texts = {
      title: 'Welcome to Work Track',
      logintext: 'Please login to track your time.',
      email: 'Email',
      password: 'Password',
      name: 'Full name',
      signin: 'Sign In',
      signup: 'Sign Up'
    };
    var init = function () {
      $scope.user = {};
      $scope.errors = {};
      $scope.submitted = false;
      $scope.requestname = false;
    };
    init();

    $scope.signin = function(form) {
      $scope.submitted = true;
      $scope.requestname = false;
      
      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          init();
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.signup = function(form) {
      $scope.submitted = true;
      $scope.requestname = true;

      if(form.$valid && $scope.user.name) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then( function() {
            init();
          })
          .catch( function(err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
          });
      }
    };
  });