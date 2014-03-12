'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('WorkTrackApp'));

  var work,
    task,
    date,
    date2;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (Work) {
    date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setHours(9);
    date.setMinutes(0);
    date2 = new Date();
    date2.setMilliseconds(0);
    date2.setSeconds(0);
    date2.setHours(10);
    date2.setMinutes(0);
    work = Work;
    task = {};
  }));

  describe('parseInput', function () {
    it('should set task nr', function () {
      task.input = 'Sposp-1';
      expect(work.parseInput(task)).toEqual({
        input: task.input,
        nr: 'Sposp-1',
        oldDate: null,
        step: 1,
        start: 0,
        end: 0,
        descr: ''
      });
    });
    it('should set start time', function () {
      task.input = 'Sposp-1 0900';
      expect(work.parseInput(task)).toEqual({
        input: task.input,
        nr: 'Sposp-1',
        start: date,
        oldDate: null,
        step: 2,
        end: 0,
        descr: ''
      });
    });
    it('should set end time', function () {
      task.input = 'Sposp-1 0900 1000';
      expect(work.parseInput(task)).toEqual({
        input: task.input,
        nr: 'Sposp-1',
        start: date,
        end: date2,
        oldDate: null,
        step: 3,
        descr: ''
      });
    });
    it('should set date', function () {
      task.input = 'Sposp-1 0900 1000 080214';
      date.setDate(8);
      date.setMonth(1);
      date.setYear(2014);
      date2.setDate(8);
      date2.setMonth(1);
      date2.setYear(2014);
      expect(work.parseInput(task)).toEqual({
        input: task.input,
        nr: 'Sposp-1',
        start: date,
        end: date2,
        oldDate: null,
        step: 3,
        descr: ''
      });
    });
  });

  describe('parseTime', function () {
    it('should parse times', function () {
      expect(work.parseTime('0900')).toEqual(date);
      expect(work.parseTime('900')).toEqual(date);
      expect(work.parseTime('10')).toEqual(date2);
      date.setHours(23);
      date.setMinutes(59);
      expect(work.parseTime('2359')).toEqual(date);
      expect(work.parseTime('23:59')).toEqual(date);
    });
  });

  describe('parseDate', function () {
    var today,
      day,
      month,
      year;

    beforeEach(function () {
      today = new Date();
      day = today.getDate();
      month = today.getMonth();
      year = today.getFullYear();
      if (day < 8) {
        month--;
      }
      if (month === 0) {
        year--;
      }
      today.setMilliseconds(0);
      today.setSeconds(0);
      today.setHours(9);
      today.setMinutes(0);
    });

    it('should parse dates', function () {
      expect(work.parseDate(today, '8')).toEqual(new Date(year, month, 8, 9, 0, 0, 0));
      expect(work.parseDate(today, '08')).toEqual(new Date(year, month, 8, 9, 0, 0, 0));
      expect(work.parseDate(today, '0802')).toEqual(new Date(year, 1, 8, 9, 0, 0, 0));
      expect(work.parseDate(today, '802')).toEqual(new Date(year, 1, 8, 9, 0, 0, 0));
      expect(work.parseDate(today, '80213')).toEqual(new Date(2013, 1, 8, 9, 0, 0, 0));
      expect(work.parseDate(today, '080213')).toEqual(new Date(2013, 1, 8, 9, 0, 0, 0));
      expect(work.parseDate(today, '8022013')).toEqual(new Date(2013, 1, 8, 9, 0, 0, 0));
      expect(work.parseDate(today, '08022013')).toEqual(new Date(2013, 1, 8, 9, 0, 0, 0));
    });

    it('should set month correctly', function () {
      expect(work.parseDate(today, ('0' + (day + 1)).slice(-2))).toEqual(new Date(year, month - 1, day + 1, 9, 0, 0, 0));
    });

    it('should set year correctly', function () {
      expect(work.parseDate(today, ('0' + day).slice(-2) + ('0' + (month + 2)).slice(-2))).toEqual(new Date(year - 1, month + 1, day, 9, 0, 0, 0));
    });
  });
});
