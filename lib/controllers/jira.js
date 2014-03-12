'use strict';

var mongoose = require('mongoose'),
    jira = require('../services/jira'),
    passport = require('passport');

exports.import = function (req, res) {
  if (!req.user) {
    res.json(403, 'Forbidden');
    return;
  }
  var from = new Date(req.body.from),
    to = new Date(req.body.to);

  jira.getTasks(from, to, function (err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.send(err);
    }
  });
};