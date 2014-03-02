'use strict';

var mongoose = require('mongoose'),
    Task = mongoose.model('Task'),
    jira = require('../services/jira'),
    passport = require('passport'),
    async = require('async');

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


exports.add = function (req, res) {
  if (!req.user) {
    res.json(403, 'Forbidden');
    return;
  }
  var taskId = req.params.id;
  Task.findById(taskId).exec(function (err, task) {
    if (err || !task) {
      console.log(err);
      res.json(400, err);
      return;
    }
    jira.addTask(task.task, req.user, function (err, data) {
      if (err) {
        console.log(err);
        res.json(400, err);
      }
      console.log(data);
      res.json(200);
    });
  });
};

exports.sync = function (req, res) {
  if (!req.user) {
    res.json(403, 'Forbidden');
    return;
  }
  var taskId = req.params.id,
    jiraId = req.body.jiraid;
  Task.findById(taskId).exec(function (err, task) {
    if (err) {
      console.log(err);
      res.json(400, err);
      return;
    }
    if (jiraId && task) {
      task.jiraid = jiraId;
      task.save(function(err) {
        if (err) {
          res.send(500, err);
        } else {
          res.json(task.task);
        }
      });
    } else {
      res.send(400);
    }
  });
};

exports.showAll = function (req, res, next) {
  if (!req.user) {
    res.json(403, 'Forbidden');
    return;
  }
  var userId = req.user.id,
    start = req.query.start || 0,
    limit = req.query.limit || 10;

  async.parallel([function (callback) {
    Task.count({ user: userId }).exec(callback);
  }, function (callback) {
    Task.find({ user: userId }).limit(limit).skip(start).sort('-start').exec(callback);
  }, function (callback) {
    Task.count({ user: userId, jiraid: undefined }).where('jiraid == null').exec(callback);
  }], function (err, data) {
    if (err) return next(new Error('Failed to load Tasks'));
    var count = data[0],
      tasks = data[1],
      syncCount = data[2];

    if (tasks) {
      if (tasks.length === 0) {
        res.json({
          count: count,
          syncCount: syncCount,
          tasks: []
        });
        return;
      }
      var ret = [],
        task,
        jiraTask,
        jiraTasksReq = [],
        dates = {},
        dateArr = [],
        dateString = '',
        date;
      for (var index = 0, length = tasks.length; index < length; index++) {
        if (!tasks[index].jiraid) {
          date = new Date(parseInt(tasks[index].start, 10));
          dateString = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
          if (!dates[dateString]) {
            dates[dateString] = [];
            dateArr.push(dateString);
          }
          dates[dateString].push(task);
        }
        task = tasks[index].task;
        ret.push(task);
      }

      dateArr.map(function (dateString) {
        jiraTasksReq.push(function(callback) {
          jira.getTasksForDay(dateString, callback);
        });
      });

      res.json({
        count: count,
        syncCount: syncCount,
        tasks: ret
      });
    } else {
      res.send(404, 'TASKS_NOT_FOUND');
    }
  });
};

exports.showNotSynced = function (req, res, next) {
  if (!req.user) {
    res.json(403, 'Forbidden');
    return;
  }
  var userId = req.user.id,
    start = req.query.start || 0,
    limit = req.query.limit || 10;

  async.parallel([function (callback) {
    Task.count({ user: userId }).exec(callback);
  }, function (callback) {
    Task.find({ user: userId, jiraid: undefined }).limit(limit).skip(start).sort('-start').exec(callback);
  }, function (callback) {
    Task.count({ user: userId, jiraid: undefined }).exec(callback);
  }], function (err, data) {
    if (err) return next(new Error('Failed to load Tasks'));
    var count = data[0],
      tasks = data[1],
      syncCount = data[2];

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
                task.jiraid = jiraTask[index2].worklogid;
              }
            }
          }
        }
        res.json({
          count: count,
          syncCount: syncCount,
          tasks: ret
        });
      });
    } else {
      res.send(404, 'TASKS_NOT_FOUND');
    }
  });
};
