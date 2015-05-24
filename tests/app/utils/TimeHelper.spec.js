'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
const expect = require('chai').expect;

const TimeHelper = require('../../../app/utils/TimeHelper');

describe("TimeHelper", () => {
    describe("getTimeFromMs", () => {
        it("returns time string", function() {
            expect(TimeHelper.getTimeFromMs(36610000), '10:10:10');
        });

        it("adds leading zeros", function() {
            expect(TimeHelper.getTimeFromMs(3661000), '01:01:01');
        });

        it("supports more than 24 hours", function() {
            expect(TimeHelper.getTimeFromMs(360610000), '100:10:10');
        });
    });

    describe("getTimeFromDateString", () => {
        it("returns empty string if not a valid date", function () {
            expect(TimeHelper.getTimeFromDateString('a'), '');
            expect(TimeHelper.getTimeFromDateString(''), '');
            expect(TimeHelper.getTimeFromDateString('1.1.c'), '');
        });

        it("returns hours and minutes for valid dates", function () {
            expect(TimeHelper.getTimeFromDateString('10:20'), '10:20');
            expect(TimeHelper.getTimeFromDateString('2015-05-22T11:30:00.000Z'), '11:30');
            expect(TimeHelper.getTimeFromDateString('20:10:01'), '20:10');
        });

        it("adds leading zeroes", function () {
            expect(TimeHelper.getTimeFromDateString('1:2'), '01:02');
            expect(TimeHelper.getTimeFromDateString('2015-05-22T01:02:03.000Z'), '01:02');
            expect(TimeHelper.getTimeFromDateString('3:4:1'), '02:03');
        });
    });

    describe("getDate", () => {

    });

    describe("getDateForApi", () => {

    });

    describe("leadingZero", () => {

    });

    describe("getDateFromParam", () => {

    });
});
