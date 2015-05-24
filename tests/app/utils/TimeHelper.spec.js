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
            expect(TimeHelper.getTimeFromDateString('a')).to.be.equal('');
            expect(TimeHelper.getTimeFromDateString('')).to.be.equal('');
            expect(TimeHelper.getTimeFromDateString('1.1.c')).to.be.equal('');
        });

        it("returns hours and minutes for valid dates", function () {
            expect(TimeHelper.getTimeFromDateString('1/1/2000 10:20')).to.be.equal('10:20');
            expect(TimeHelper.getTimeFromDateString('2015-05-22T11:30:00.000Z')).to.be.equal('13:30');
            expect(TimeHelper.getTimeFromDateString('1/1/2000 20:10:01')).to.be.equal('20:10');
        });

        it("adds leading zeroes", function () {
            expect(TimeHelper.getTimeFromDateString('1/1/2000 01:02')).to.be.equal('01:02');
            expect(TimeHelper.getTimeFromDateString('2015-05-22T01:02:03.000')).to.be.equal('03:02');
            expect(TimeHelper.getTimeFromDateString('1/1/2000 03:04:01')).to.be.equal('03:04');
        });
    });

    describe("getDate", () => {
        it("returns date string", function () {
            const date = new Date('2014-10-15');

            expect(TimeHelper.getDate(date)).to.be.equal('15.10.2014');
        });

        it("adds leading zeros", function () {
            const date = new Date('2014-02-01');

            expect(TimeHelper.getDate(date)).to.be.equal('01.02.2014');
        });
    });

    describe("getDateForApi", () => {
        it("returns date string", function () {
            const date = new Date('2014-10-15');

            expect(TimeHelper.getDateForApi(date)).to.be.equal('2014-10-15');
        });

        it("adds leading zeros", function () {
            const date = new Date('2014-02-01');

            expect(TimeHelper.getDateForApi(date)).to.be.equal('2014-02-01');
        });
    });

    describe("leadingZero", () => {
        it("adds leading zero if needed", function () {
            for (let i = 0; i < 5; i++) {
                const nr = Math.round(Math.random() * 9);
                expect(TimeHelper.leadingZero(nr)).to.be.equal('0' + nr);
            }
        });

        it("doesn't add leading zero if not needed", function () {
            for (let i = 0; i < 50; i++) {
                const nr = Math.round(Math.random() * 89) + 10;
                expect(TimeHelper.leadingZero(nr)).to.be.equal(nr.toString());
            }
        });
    });

    describe("getDateFromParam", () => {
        it("returns date if valid", function () {
            expect(TimeHelper.getDateFromParam('1/1/2000 10:20')).to.be.deep.equal(new Date('1/1/2000 10:20'));
            expect(TimeHelper.getDateFromParam('2015-05-22T11:30:00.000Z')).to.be.deep.equal(new Date('2015-05-22T11:30:00.000Z'));
            expect(TimeHelper.getDateFromParam('1/1/2000 20:10:01')).to.be.deep.equal(new Date('1/1/2000 20:10:01'));
        });

        it("returns current date if string is not valid", function () {
            expect(TimeHelper.getDateFromParam('a')).to.be.deep.equal(new Date());
            expect(TimeHelper.getDateFromParam('')).to.be.deep.equal(new Date());
            expect(TimeHelper.getDateFromParam('1.1.c')).to.be.deep.equal(new Date());
        });
    });
});
