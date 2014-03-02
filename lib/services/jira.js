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

exports.addTask = function (task, user, callback) {
  var cookieHeader = user.cookie,
    start = new Date(parseInt(task.start, 10)),
    time = new Date(parseInt(task.end, 10) - start - 3600000),
    data = {
      "comment": task.descr,
      //"started": start.getFullYear() + '-' + ('0' + (start.getMonth() + 1)).slice(-2) + '-' + ('0' + start.getDate()).slice(-2) + 'T' + start.getHours() + ':' + start.getMinutes() + ':' + start.getSeconds() + '.000+0000',
      "started" : start.toISOString(),
      "timeSpent": time.getHours()+'h' + time.getMinutes() + 'm',
      "timeSpentSeconds": time.getSeconds()
    };

  var options = {
    host: 'jira-new.netconomy.net',
    port: 443,
    path: '/rest/api/2/issue/' + task.nr + '/worklog',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cookie': cookieHeader
    }
  };

  console.log(options, data);

  var jiraReq = https.request(options, function(jiraRes) {
    jiraRes.setEncoding('utf8');
    var responseString = '';

    jiraRes.on('data', function (chunk) {
      responseString += chunk;
    });

    jiraRes.on('end', function() {
      if (jiraRes.statusCode !== 200) {
        callback(jiraRes.statusCode, responseString);
        return;
      }
      callback(null, JSON.parse(responseString));
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

  jiraReq.write(JSON.stringify(data));

  jiraReq.end();
};

exports.login= function (username, pass, callback) {
  var user = JSON.stringify({
    "username": username,
    "password": pass
  });

  var options = {
    host: 'jira-new.netconomy.net',
    port: 443,
    path: '/rest/auth/1/session',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      //'Content-Length': user.length
    }
  };

  var jiraReq = https.request(options, function(jiraRes) {
    jiraRes.setEncoding('utf8');
    var responseString = '';
    jiraRes.on('data', function (chunk) {
      responseString += chunk;
    });

    jiraRes.on('end', function() {
      if (jiraRes.statusCode !== 200) {
        callback(responseString);
        return;
      }
      callback(null, {status: true, data: JSON.parse(responseString), cookie: jiraRes.headers['set-cookie']});
    });

    jiraRes.on('error', function(e) {
      console.error('error');
      console.error(e);
      callback(e);
    });
  });

  jiraReq.on('error', function(e) {
    console.log('problem with request: ' + e.message);
    callback(e);
  });

  jiraReq.write(user);

  jiraReq.end();
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

exports.getUser = function (username, cookie, callback) {
  var cookieHeader = '';

  for (var index = 0, length = cookie.length; index < length; index++) {
    cookieHeader += cookie[index].split(';')[0] + ';';
  }

  var options = {
    host: 'jira-new.netconomy.net',
    port: 443,
    path: '/rest/api/2/user?username=' + username,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cookie': cookieHeader
    }
  };

  var jiraReq = https.request(options, function(jiraRes) {
    jiraRes.setEncoding('utf8');
    var responseString = '';

    jiraRes.on('data', function (chunk) {
      responseString += chunk;
    });

    jiraRes.on('end', function() {
      if (jiraRes.statusCode !== 200) {
        callback(jiraRes.statusCode, responseString);
        return;
      }
      callback(null, JSON.parse(responseString), cookieHeader);
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
