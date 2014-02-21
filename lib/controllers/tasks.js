'use strict';

var mongoose = require('mongoose'),
    Task = mongoose.model('Task'),
    passport = require('passport');

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
