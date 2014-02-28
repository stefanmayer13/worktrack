'use strict';

var mongoose = require('mongoose'),
    Task = mongoose.model('Task'),
    jira = require('../services/jira'),
    passport = require('passport'),
    async = require('async');

/**
 * Create task
 */
exports.create = function (req, res) {
  var newTask = new Task(req.body);
  newTask.user = req.user.id;

  newTask.save(function(err) {
    if (err) {
      return res.json(400, err);
    }
    return res.json(newTask.task);
  });
};

exports.showAll = function (req, res, next) {
  var userId = req.user.id,
    start = req.query.start || 0,
    limit = req.query.limit || 10;

  Task.find({ user: userId }).limit(limit).skip(start).sort('-start').exec(function (err, tasks) {
    if (err) return next(new Error('Failed to load Tasks'));

    if (tasks) {
      var ret = [];
      for (var index = 0, length = tasks.length; index < length; index++) {
        ret.push(tasks[index].task);
      }
      if (tasks.length > 0) {
        //console.log(ret);
        res.json(ret);
      } else {
        res.json([]);
      }
    } else {
      res.send(404, 'TASKS_NOT_FOUND');
    }
  });
};

exports.showNotSynced = function (req, res, next) {
  var userId = req.user.id,
    start = req.query.start || 0,
    limit = req.query.limit || 10;

  Task.find({ user: userId }).where('jiraid != null').limit(limit).skip(start).sort('-start').exec(function (err, tasks) {
    if (err) return next(new Error('Failed to load Tasks'));

    if (tasks && tasks.length > 0) {
      var ret = [],
        task,
        jiraTask,
        jiraTasksReq = [],
        dates = {},
        dateArr = [],
        dateString = '',
        date;

      /*jshint loopfunc: true */
      for (var index = 0, length = tasks.length; index < length; index++) {
        date = new Date(parseInt(tasks[index].start, 10));
        dateString = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        if (!dates[dateString]) {
          dates[dateString] = [];
          dateArr.push(dateString);
        }
        task = tasks[index].task;
        dates[dateString].push(task);
        ret.push(task);
      }
      dateArr.map(function (dateString) {
        jiraTasksReq.push(function(callback) {
          jira.getTasksForDay(dateString, callback);
        });
      });
      async.parallel(jiraTasksReq, function(err, jiraTasks) {
        if (err) {
          console.log(err);
          res.json([]);
        }
        for (index = 0, length = jiraTasks.length; index < length; index++) {
          jiraTask = jiraTasks[index].tasks;
          for (var index2 = 0, length2 = jiraTask.length; index2 < length2; index2++) {
            if (dates[jiraTask[index2].workdate]) {
              for (var index3 = 0, length3 = dates[jiraTask[index2].workdate].length; index3 < length3; index3++) {
                task = dates[jiraTask[index2].workdate][index3];
                date = new Date(parseInt(task.end, 10) - parseInt(task.start, 10) - 3600000);
                if (jiraTask[index2].nr === task.nr && jiraTask[index2].hours === date.getHours() && jiraTask[index2].minutes === date.getMinutes()) {
                  if (jiraTask[index2].descr === task.descr) {
                    task.jira = 'ok';
                  } else {
                    task.jira = 'conflict';
                  }
                  dates[jiraTask[index2].workdate].splice(index3, 1);
                  index3--;
                  length3--;
                } else {
                  task.jira = 'add';
                }
              }
            }
          }
        }
        res.json(ret);
      });
    } else {
      res.send(404, 'TASKS_NOT_FOUND');
    }
  });
};
