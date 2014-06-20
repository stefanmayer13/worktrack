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
  if (!req.user) {
    res.send(401);
    return;
  }
  var cookie = req.user.cookie;
  req.logout();
  jira.logout(cookie, function (err) {
    if (err) {
      res.send(401);
      return;
    }
    res.send(204);
  });
};

/**
 * Login
 */
exports.login = function (req, res, next) {
  var username = req.body.username,
    password = req.body.password;
  jira.login(username, password, function (err, data) {
    if (err) {
      console.log(err, data);
      return res.send(err, data);
    }

    var cookie = '';

    for (var index = 0, length = data.cookie.length; index < length; index++) {
      cookie += data.cookie[index].split(';')[0] + ';';
    }

    User.findOne({username: username}, function (err, user) {
      if (err) return next(new Error('Failed to load User'));
      if (user) {
        user.cookie = cookie;
        user.save(function(err) {
          if (err) {
            return res.send(500, err);
          }
          passport.authenticate('local', function(err, user, info) {
            var error = err || info;
            if (error) return res.json(401, error);

            req.logIn(user, function(err) {

              if (err) return res.send(err);
              res.json(req.user.userInfo);
            });
          })(req, res, next);
        });
      } else {
        users.create(username, password, cookie, function (err, user) {
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
    if (err && err !== 401) {
      console.log(err);
      res.json(400, err);
    } else  if (err === 401) {
      req.logout();
      res.json(err);
    }
    res.json(data);
  });
};