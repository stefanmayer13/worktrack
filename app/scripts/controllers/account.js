'use strict';

angular.module('WorkTrackApp')
  .controller('AccountCtrl', function ($scope, User, Auth, $rootScope) {
    $scope.errors = {};
    $scope.user = {
      name: $rootScope.currentUser.name
    };

    $scope.changeName = function(form) {
      $scope.namesubmitted = true;

      if(form.$valid) {
        Auth.changeName( $scope.user.name)
          .then( function() {
            if ('activeElement' in document) {
              document.activeElement.blur();
            }
            $scope.namemessage = 'Name successfully changed.';
          })
          .finally( function() {
            $scope.namesubmitted = false;
          });
      }
    };

    $scope.changePassword = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          if ('activeElement' in document) {
            document.activeElement.blur();
          }
          $scope.message = 'Password successfully changed.';
          $scope.user.oldPassword = null;
          $scope.user.newPassword = null;
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
        })
        .finally( function() {
          $scope.submitted = false;
        });
      }
		};
  });
