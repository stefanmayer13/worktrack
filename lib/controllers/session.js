'use strict';

var mongoose = require('mongoose'),
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
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);

    req.logIn(user, function(err) {
      
      if (err) return res.send(err);
      res.json(req.user.userInfo);
    });
  })(req, res, next);
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