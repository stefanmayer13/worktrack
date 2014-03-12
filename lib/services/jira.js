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

exports.getTasks = function (dateFrom, dateTo, callback) {
  if (isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
    callback(400);
    return;
  }

  var from = dateFrom.getFullYear() + '-' + (dateFrom.getMonth() + 1) + '-' + dateFrom.getDate(),
      to = dateTo.getFullYear() + '-' + (dateTo.getMonth() + 1) + '-' + dateTo.getDate(),
    tmp;

  if (dateTo - dateFrom < 0) {
    tmp = from;
    from = to;
    to = tmp;
  }

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
        'dateFrom=' + from + '&dateTo=' + to + '&userName=smayer' + fields,
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

exports.getTasksForDay = function (date, callback) {
  var day = new Date(date);
  exports.getTasks(day, day, callback);
};

exports.addTask = function (task, user, callback) {
  var cookieHeader = user.cookie,
    start = new Date(parseInt(task.start, 10)),
    time = new Date(parseInt(task.end, 10) - start - 3600000),
    isoStr = start.toISOString(),
    data = {
      "comment": task.descr,
      "started" : isoStr.substr(0, isoStr.length - 1) + '+0100',
      "timeSpent": time.getHours()+'h ' + time.getMinutes() + 'm'
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

  //console.log(options, data);

  var jiraReq = https.request(options, function(jiraRes) {
    jiraRes.setEncoding('utf8');
    var responseString = '';

    jiraRes.on('data', function (chunk) {
      responseString += chunk;
    });

    jiraRes.on('end', function() {
      if (jiraRes.statusCode >= 300) {
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

  //console.log(options.host + options.path);

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

exports.logout= function (cookie, callback) {
  var options = {
    host: 'jira-new.netconomy.net',
    port: 443,
    path: '/rest/auth/1/session',
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Cookie': cookie
    }
  };

  //console.log(options);

  var jiraReq = https.request(options, function(jiraRes) {
    jiraRes.setEncoding('utf8');
    var responseString = '';
    jiraRes.on('data', function (chunk) {
      responseString += chunk;
    });

    jiraRes.on('end', function() {
      if (jiraRes.statusCode !== 204) {
        callback(jiraRes.statusCode, responseString);
        return;
      }
      callback(null, {status: true});
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
      if (jiraRes.statusCode !== 200) {
        callback(jiraRes.statusCode, {status: false});
        return;
      }
      //console.log(responseString);
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

  var options = {
    host: 'jira-new.netconomy.net',
    port: 443,
    path: '/rest/api/2/user?username=' + username,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cookie': cookie
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
      callback(null, JSON.parse(responseString), cookie);
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
