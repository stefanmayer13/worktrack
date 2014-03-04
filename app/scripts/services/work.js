'use strict';

angular.module('WorkTrackApp')
  .factory('Work', function Work() {
    return {
      parseInput: function(task) {
        if (!task.input) {
          return '';
        }
        var index = 0,
          length, input,
          inputs = task.input.split(' '),
          types = {},
          lastNumberUsed = -1,
          inputTypes = this.detectTypes(inputs);
        if (task.persistdate && !task.oldDate && task.start) {
          task.oldDate = new Date(task.start);
        } else if (!task.persistdate) {
          task.oldDate = null;
        }
        for (length = inputTypes.length; index < length; index++) {
          input = inputTypes[index];
          if (!types[input.type]) {
            types[input.type] = [];
          }
          types[input.type].push(input.value);
        }
        task.step = 0;
        if (types.time) {
          task.start = types.time[0];
          task.step++;
          task.end = 0;
          if (types.time.length > 1) {
            task.end = types.time[1];
            task.step++;
          } else if (types.number) {
            task.end = this.parseTime(types.number[0]);
            task.step++;
            lastNumberUsed = 0;
          }
        } else if (types.number) {
          task.start = this.parseTime(types.number[0]);
          task.step++;
          task.end = 0;
          lastNumberUsed = 0;
          if (types.number.length > 1) {
            task.end = this.parseTime(types.number[1]);
            task.step++;
            lastNumberUsed = 1;
          }
        } else {
          task.start = 0;
          task.end = 0;
        }
        if (task.start && task.end) {
          if (types.date && types.date[0]) {
            task.start = this.parseDate(task.start, types.date[0]);
            task.end = this.parseDate(task.end, types.date[0]);
          } else if(types.number && types.number.length > lastNumberUsed) {
            lastNumberUsed++;
            if (types.number[lastNumberUsed]) {
              task.start = this.parseDate(task.start, types.number[lastNumberUsed]);
              task.end = this.parseDate(task.end, types.number[lastNumberUsed]);
            }
          } else if (task.persistdate && task.oldDate) {
            task.start.setMonth(task.oldDate.getMonth());
            task.start.setDate(task.oldDate.getDate());
            task.start.setYear(task.oldDate.getFullYear());
            task.end.setMonth(task.oldDate.getMonth());
            task.start.setDate(task.oldDate.getDate());
            task.end.setYear(task.oldDate.getFullYear());
          }
          if (task.persistdate) {
            task.oldDate = new Date(task.start);
          }
        }
        if (types.task) {
          task.nr = types.task[0];
          task.step++;
        } else {
          task.nr = '';
        }
        if (task.nr && types.string) {
          if (types.string[0] === '-') {
            types.string.splice(0, 1);
          }
          if (task.calculatedhours) {
            if (!isNaN(types.string[0].replace(',', '.'))) {
              types.string.splice(0, 1);
            }
          }
          task.descr = types.string.join(' ');
          task.step++;
        } else {
          task.descr = '';
        }
        return task;
      },

      //TODO remove
      parseInput2: function(task) {
        if (!task.input) {
          return '';
        }
        var inputs = task.input.split(' ');
        task.step = inputs.length;
        if (inputs.length > 0) {
          task.nr = inputs[0];
          if (inputs.length > 1) {
            task.start = this.parseTime(inputs[1]);
            if (inputs.length > 2) {
              task.end = this.parseTime(inputs[2]);
              if (inputs.length > 3) {
                task.start = this.parseDate(task.start, inputs[3]);
                task.end = this.parseDate(task.end, inputs[3]);
                if (inputs.length > 4) {
                  task.descr = inputs.splice(4).join(' ');
                }
              }
            } else {
              task.end = null;
            }
          } else {
            task.start = null;
          }
        }
        return task;
      },

      detectTypes: function (inputs) {
        if (!inputs) {
          return null;
        }
        var index = 0,
          length = inputs.length,
          types = [];
        for (; index < length; index++) {
          types.push(this.detectType(inputs[index]));
        }
        return types;
      },

      detectType: function (input) {
        var self = this,
          date,
          tmp = [];
        if (self.isInt(input)) {
          return {
            type: 'number',
            value: input
          };
        } else {
          //Check if time
          tmp = input.split(':');
          if (tmp.length === 2 && self.isInt(tmp[0]) && self.isInt(tmp[1])) {
            date = new Date();
            date.setMilliseconds(0);
            date.setSeconds(0);
            date.setHours(tmp[0]);
            date.setMinutes(tmp[1]);
            return {
              type: 'time',
              value: date
            };
          }
          //Check if date
          tmp = input.split('.');
          if (tmp.length === 2 && self.isInt(tmp[0]) && !tmp[1]) {
            return {
              type: 'date',
              value: tmp[0]
            };
          }
          if (tmp.length === 2 && self.isInt(tmp[0]) && self.isInt(tmp[1]) ||
            tmp.length === 3 && self.isInt(tmp[0]) && self.isInt(tmp[1]) && !tmp[2]) {
            return {
              type: 'date',
              value: tmp[0] + ('0' + tmp[1]).slice(-2)
            };
          }
          if (tmp.length === 3 && self.isInt(tmp[0]) && self.isInt(tmp[1]) && self.isInt(tmp[2])) {
            return {
              type: 'date',
              value: tmp[0] + ('0' + tmp[1]).slice(-2) + tmp[2]
            };
          }
          //Check if task
          tmp = input.split('-');
          if (tmp.length === 2 && isNaN(tmp[0]) && self.isInt(tmp[1])) {
            return {
              type: 'task',
              value: input
            };
          }
        }
        return {
          type: 'string',
          value: input
        };
      },

      isInt: function (input) {
        return input && input.indexOf(' ') === -1 && !isNaN(input) && parseInt(input, 10) % 1 === 0;
      },

      parseTime: function(time) {
        var hour, minute = 0,
          parsedTime = new Date();
        switch (time.length) {
        case 1:
        case 2:
          hour = time;
          break;
        case 3:
          hour = time.substr(0, 1);
          minute = time.substr(1);
          break;
        case 4:
          hour = time.substr(0, 2);
          minute = time.substr(2);
          break;
        case 5:
          hour = time.substr(0, 2);
          minute = time.substr(3);
          break;
        }
        if (!isNaN(hour) && !isNaN(minute) &&
          hour >= 0 && hour <= 24 &&
          minute >= 0 && minute <= 60) {
          parsedTime.setMilliseconds(0);
          parsedTime.setSeconds(0);
          parsedTime.setHours(hour);
          parsedTime.setMinutes(minute);
          return parsedTime;
        }
        return null;
      },

      parseDate: function(date, dateString) {
        var today = new Date(), day, month ,year,
          yearPrefix = date.getFullYear().toString().substr(0, 2);

        switch (dateString.length) {
        case 1:
        case 2:
          day = dateString;
          break;
        case 3:
          day = dateString.substr(0, 1);
          month = dateString.substr(1, 2);
          break;
        case 4:
          day = dateString.substr(0, 2);
          month = dateString.substr(2, 2);
          break;
        case 5:
          day = dateString.substr(0, 1);
          month = dateString.substr(1, 2);
          year = yearPrefix + dateString.substr(3, 2);
          break;
        case 6:
          day = dateString.substr(0, 2);
          month = dateString.substr(2, 2);
          year = yearPrefix + dateString.substr(4, 2);
          break;
        case 7:
          day = dateString.substr(0, 1);
          month = dateString.substr(1, 2);
          year = dateString.substr(3, 4);
          break;
        case 8:
          day = dateString.substr(0, 2);
          month = dateString.substr(2, 2);
          year = dateString.substr(4, 4);
          break;
        }
        if (typeof(day) !== 'undefined' && !isNaN(day)) {
          day = parseInt(day, 10);
          if (day > 0 && day < 32) {
            if (typeof(month) !== 'undefined' && !isNaN(month)) {
              month = parseInt(month, 10);
              if (month > 0 && month < 13) {
                date.setMonth(--month);
                if (typeof(year) !== 'undefined' && !isNaN(year)) {
                  year = parseInt(year, 10);
                  date.setYear(year);
                } else {
                  if (month > today.getMonth()) {
                    date.setYear(date.getFullYear() - 1);
                  }
                }
              }
            } else {
              if (day > today.getDate()) {
                date.setMonth(date.getMonth() - 1);
              }
            }
            date.setDate(day);
          }
        }
        return date;
      }
    };
  });