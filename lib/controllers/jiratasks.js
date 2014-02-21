'use strict';

var https = require('https'),
    parseString = require('xml2js').parseString;

exports.showAll = function (req, res, next) {
  var userId = req.user.id,
    date = req.query.date;

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
            time: parseFloat(log.hours['0'])
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
    token = '',
    options = {
    host: 'jira-new.netconomy.net',
    port: 443,
    path: '/plugins/servlet/tempo-getWorklog/?format=xml&diffOnly=false&tempoApiToken=' + token + '&' +
      'dateFrom=' + date + '&dateTo=' + date + '&userName=smayer' + fields,
    method: 'GET'
  };

  var jiraReq = https.request(options, function(jiraRes) {
    jiraRes.setEncoding('utf8');
    var responseString = '';
    jiraRes.on('data', function (chunk) {
      responseString += chunk;
    });

    jiraRes.on('end', function() {
      parseString(responseString, function (err, result) {
        //console.dir(result);

        res.json(converter(result));
      });
    });
  });

  jiraReq.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  jiraReq.end();
};
