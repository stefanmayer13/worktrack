'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    jira = require('../services/jira'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (username, pass, cookie, callback) {
  jira.getUser(username, cookie, function (err, data, cookie) {
    if (err) {
      console.log(err);
      console.log(data);
      return callback(err, data);
    }

    var newUser = new User();
    newUser.name = data.displayName || data.name;
    newUser.username = data.name;
    newUser.password = pass;
    newUser.email = data.emailAddress;
    newUser.avatar = data.avatarUrls;
    newUser.cookie = cookie;
    newUser.provider = 'jira';

    newUser.save(function(err) {
      if (err) {
        console.log(err);
        // Manually provide our own message for 'unique' validation errors, can't do it from schema
        if(err.errors && err.errors.email.type === 'Value is not unique.') {
          err.errors.email.type = 'The specified email address is already in use.';
        }
        callback(err);
        return;
      }

      return callback(null, newUser);
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(new Error('Failed to load User'));
  
    if (user) {
      res.json(user.userInfo);
    } else {
      res.send(404, 'USER_NOT_FOUND');
    }
  });
};

/**
 * Change password
 */
exports.changeUser = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);
  var name = req.body.name ? String(req.body.name) : null;

  User.findById(userId, function (err, user) {
    if(name) {
      user.name = name;
      user.save(function(err) {
        if (err) {
          res.send(500, err);
        } else {
          res.json(user.userInfo);
        }
      });
    } else if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) {
          res.send(500, err);
        } else {
          res.send(200);
        }
      });
    } else {
      res.send(400);
    }
  });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};