'use strict';

var mongoose = require('mongoose'),
    jira = require('../services/jira'),
    Task = mongoose.model('Task'),
    passport = require('passport'),
    async = require('async');

exports.import = function (req, res) {
  if (!req.user) {
    res.json(403, 'Forbidden');
    return;
  }
  var checkIfSynced = function (tasks, callback) {
      var worklogs = [],
        ids = {};
      for (var index = 0, length = tasks.length; index < length; index++) {
        worklogs.push(tasks[index].worklogid);
      }
      if (worklogs.length > 0) {
        Task.find({user: req.user.id, jiraid: {$in: worklogs} }).exec(function (err, localTasks) {
          console.log(worklogs);
          console.log(arguments);
          for (var index = 0, length = localTasks.length; index < length; index++) {
            ids[localTasks[index].jiraid] = true;
          }
          for (index = 0, length = tasks.length; index < length; index++) {
            if (ids[tasks[index].worklogid]) {
              tasks[index].synced = 'ok';
            } else {
              tasks[index].synced = 'add';
            }
          }
          callback();
        });
      } else {
        callback();
      }
    },
    from = new Date(req.body.from),
    to = new Date(req.body.to);

  jira.getTasks(from, to, function (err, result) {
    if (!err) {
      checkIfSynced(result.tasks, function () {
        res.json(result);
      });
    } else {
      res.send(err);
    }
  });
};