'use strict';

var jira = require('../services/jira');

exports.showAll = function (req, res) {
  var userId = req.user.id,
    date = req.query.date;

  if (userId) {
    jira.getTasksForDay(req.user, date, function (err, result) {
      if (!err) {
        res.json(result);
      } else {
        res.json([]);
      }
    });
  } else {
    res.json([]);
  }
};
