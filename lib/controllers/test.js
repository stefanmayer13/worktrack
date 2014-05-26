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

exports.test = function (req, res) {
  if (false && !req.user) {
    res.json(403, 'Forbidden');
    return;
  }

  var fields = '&addIssueSummary=true',
    options = {
      host: 'jira-new.netconomy.net',
      port: 443,
      path: '/plugins/servlet/tempo-getWorklog/?format=xml&diffOnly=false&tempoApiToken=' + token + '&' +
        'dateFrom=2014-2-1&dateTo=2014-3-31&projectKey=XLMSP' +
        '' + fields, //
      method: 'GET'
    };

  //console.log('https://' + options.host + options.path);

  var jiraReq = https.request(options, function(jiraRes) {
    jiraRes.setEncoding('utf8');
    var responseString = '';
    jiraRes.on('data', function (chunk) {
      responseString += chunk;
    });

    jiraRes.on('end', function() {
      parseString(responseString, function (err, result) {
        //console.log(options.host + options.path);
        //console.dir(result);
        console.log('Jira: ' + result.number_of_worklogs + ' logs found');
        var hours = 0, key, log,
          object = {
            total: {}
          };

        if (result && result.worklogs && result.worklogs.worklog) {
          for (key in result.worklogs.worklog) {
            if(result.worklogs.worklog.hasOwnProperty(key)){
              log = result.worklogs.worklog[key];
              if (!object[log.username]) {
                object[log.username] = {};
              }
              if (!object[log.username][log.issue_key[0].split('-')[0]]) {
                object[log.username][log.issue_key[0].split('-')[0]] = 0;
                object.total[log.issue_key[0].split('-')[0]] = 0;
              }
              if (true || (log.issue_key[0] !== 'XLMSP-8' && log.issue_key !== 'XLMSP-10')) {
                //object[log.username] += parseFloat(log.hours['0']);
                object[log.username][log.issue_key[0].split('-')[0]] += parseFloat(log.hours['0']);
              }
            }
          }
        }

        for (key in object.total) {
          if (object.total.hasOwnProperty(key)) {
            object.total[key] = (object.smayer[key] || 0)  + (object.mzupan ? object.mzupan[key] || 0 : 0) + (object.ckrammer ? object.ckrammer[key] : 0 || 0) + (object.bleitner[key] || 0) + (object.hgutmann[key] || 0) + (object.ldrvoderic[key] || 0) + (object.kfeyrer[key] || 0);
          }
        }
        //object.total = object.smayer + object.mzupan + object.ckrammer + object.bleitner + object.hgutmann + object.ldrvoderic + object.kfeyrer;
        delete(object.jviehberger);
        delete(object.jmuenzer);
        delete(object.jkleinowitz);
        res.json(200, object);
      });
    });

    jiraRes.on('error', function(e) {
      console.error('error');
      console.error(e);
      res.json(500, e);
    });
  });

  jiraReq.end();

};