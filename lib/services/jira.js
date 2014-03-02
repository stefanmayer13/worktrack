'use strict';

var https = require('https'),
  parseString = require('xml2js').parseString,
  fs = require('fs'),
  token;


fs.readFile('token.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  token = data;
});

exports.getTasksForDay = function (date, callback) {

  var converter = function (jiraResponse) {
    var response = [],
      hours = 0, log, key, object;
    if (jiraResponse && jiraResponse.worklogs && jiraResponse.worklogs.worklog) {
      for (key in jiraResponse.worklogs.worklog) {
        if(jiraResponse.worklogs.worklog.hasOwnProperty(key)){
          log = jiraResponse.worklogs.worklog[key];
          object = {
            workdate: log.work_date['0'],
            descr: log.work_description['0'],
            issue: log.issue_summary['0'],
            nr: log.issue_key['0'],
            time: parseFloat(log.hours['0']),
            worklogid: log.worklog_id['0']
          };
          object.hours = parseInt(object.time, 10);
          object.minutes = (object.time - object.hours) * 60;
          hours += object.time;
          response.push(object);
        }
      }
    }
    return {
      tasks: response,
      time: hours,
      hours: parseInt(hours, 10),
      minutes: (hours - parseInt(hours, 10)) * 60
    };
  };

  var fields = '&addIssueSummary=true',
    options = {
      host: 'jira-new.netconomy.net',
      port: 443,
      path: '/plugins/servlet/tempo-getWorklog/?format=xml&diffOnly=false&tempoApiToken=' + token + '&' +
        'dateFrom=' + date + '&dateTo=' + date + '&userName=smayer' + fields,
      method: 'GET'
    };

  console.log('https://' + options.host + options.path);

  var jiraReq = https.request(options, function(jiraRes) {
    jiraRes.setEncoding('utf8');
    var responseString = '';
    jiraRes.on('data', function (chunk) {
      responseString += chunk;
    });

    jiraRes.on('end', function() {
      parseString(responseString, function (err, result) {
        //console.dir(result);

        callback(null, converter(result));
      });
    });

    jiraRes.on('error', function(e) {
      console.error('error');
      console.error(e);
      callback(e);
    });
  });

  jiraReq.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  jiraReq.end();
};

exports.addTask = function (task, callback) {
  console.log(task); //TODO add worklog to jira
};

exports.isConnected = function (callback) {
  var options = {
      host: 'jira-new.netconomy.net',
      port: 443,
      path: '/rest/auth/1/session',
      method: 'GET'
    };

  var jiraReq = https.request(options, function(jiraRes) {
    jiraRes.setEncoding('utf8');
    var responseString = '';
    jiraRes.on('data', function (chunk) {
      responseString += chunk;
    });

    jiraRes.on('end', function() {
      if (jiraRes.statusCode === 401) {
        callback(null, {status: false});
        return;
      }
      console.log(responseString);
      parseString(responseString, function (err, result) {
        console.dir(result);

        callback(null, {status: true, data: result});
      });
    });

    jiraRes.on('error', function(e) {
      console.error('error');
      console.error(e);
      callback(e);
    });
  });

  jiraReq.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  jiraReq.end();
};
