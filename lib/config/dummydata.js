'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Task = mongoose.model('Task');

/**
 * Populate database with sample application data
 */

// Clear old users, then add a default user
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, function() {
      console.log('finished populating users');
    }
  );
});

// Clear old tasks, then add a default task
/*
Task.find({}).remove(function() {

});
*/