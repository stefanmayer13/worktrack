'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    users = require('./users'),
    jira = require('../services/jira'),
    passport = require('passport');

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  res.send(200);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
  var username = req.body.username,
    password = req.body.password;
  jira.login(username, password, function (err, data) {
    if (err) {
      return res.send(401, err);
    }

    User.find({username: username}, function (err, user) {
      if (err) return next(new Error('Failed to load User'));

      if (user.length === 1) {
        passport.authenticate('local', function(err, user, info) {
          var error = err || info;
          if (error) return res.json(401, error);

          req.logIn(user, function(err) {

            if (err) return res.send(err);
            res.json(req.user.userInfo);
          });
        })(req, res, next);
      } else {
        users.create(username, password, data.cookie, function (err, user) {
          if (err) {
            return res.send(400, err);
          }
          req.logIn(user, function(err) {
            if (err) return next(err);

            res.json(null, req.user.userInfo);
          });
        });
      }
    });
  });
  /*
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);

    req.logIn(user, function(err) {
      
      if (err) return res.send(err);
      res.json(req.user.userInfo);
    });
  })(req, res, next);
  */
};

exports.isJiraConnected = function (req, res, next) {
  jira.isConnected(function (err, data) {
    if (err) {
      console.log(err);
      res.json(400, err);
    }
    res.json(data);
  });
};