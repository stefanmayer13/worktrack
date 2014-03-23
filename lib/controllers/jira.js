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
        newTasks = [],
        ids = {};
      for (var index = 0, length = tasks.length; index < length; index++) {
        worklogs.push(tasks[index].worklogid);
      }
      if (worklogs.length > 0) {
        Task.find({user: req.user.id, jiraid: {$in: worklogs} }).exec(function (err, localTasks) {
          for (var index = 0, length = localTasks.length; index < length; index++) {
            ids[localTasks[index].jiraid] = true;
          }
          for (index = 0, length = tasks.length; index < length; index++) {
            if (ids[tasks[index].worklogid]) {
              tasks[index].synced = 'ok';
            } else {
              tasks[index].synced = 'add';
              newTasks.push({
                user: req.user.id,
                jiraid: tasks[index].worklogid,
                nr: tasks[index].nr,
                descr: tasks[index].descr,
                time: parseFloat(tasks[index].time),
                start: (new Date(tasks[index].workdate)).getTime()
              });
            }
          }
          Task.create(newTasks, function () {
            callback(arguments.length - 1);
          });
        });
      } else {
        callback(0);
      }
    },
    from = new Date(req.body.from),
    to = new Date(req.body.to);

  jira.getTasks(req.user, from, to, function (err, result) {
    if (!err) {
      checkIfSynced(result.tasks, function (imported) {
        result.imported = imported;
        res.json(result);
      });
    } else {
      res.send(err);
    }
  });
};