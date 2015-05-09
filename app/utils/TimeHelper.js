'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

module.exports = {
    getTimeFromMs(time) {
        let timeInSeconds = time/1000,
            seconds = timeInSeconds % 60,
            minutes = Math.floor(timeInSeconds/60) % 60,
            hours = Math.floor(timeInSeconds/3600);
        return `${(hours < 10 ? '0' + hours : hours)}:${this.addLeadingZero(minutes)}:${this.addLeadingZero(seconds)}`;
    },

    getTimeFromDateString(dateString) {
        let date = !isNaN(Date.parse(dateString)) ? new Date(dateString) : null;
        if (date) {
            return `${this.addLeadingZero(date.getHours())}:${this.addLeadingZero(date.getMinutes())}`;
        }
        return '';
    },

    getDate(date) {
        return `${this.addLeadingZero(date.getDate())}.${this.addLeadingZero(date.getMonth())}.${date.getFullYear()}`;
    },

    getDateForApi(date) {
        return `${date.getFullYear()}-${this.addLeadingZero(date.getMonth())}-${this.addLeadingZero(date.getDate())}`;
    },

    addLeadingZero(nr) {
        return ('0' + (nr + 1)).slice(-2);
    }
};
