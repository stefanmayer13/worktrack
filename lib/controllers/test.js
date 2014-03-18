'use strict';

var mongoose = require('mongoose'),
  Task = mongoose.model('Task');

exports.test = function (req, res) {
  if (!req.user) {
    res.json(403, 'Forbidden');
    return;
  }

  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  var tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  var addTime = function () {
      Task.find({time: {$exists: false}}).exec(function (err, tasks) {
        for (var index = 0, length = tasks.length; index < length; index++) {
          tasks[index].time = (tasks[index].end - tasks[index].start) / 3600000;
          tasks[index].save();
        }

        res.json(200, tasks);
      });
    }, aggregateHours = function () {
      Task.aggregate({$match: {user: req.user.id, start: {$gte: today.getTime(), $lt: tomorrow.getTime()}}},{$group: {_id: "$user", hours: {$sum: "$time"}}}, function (err, data) {
        res.json(200, data);
      });
    };
  return aggregateHours();
};