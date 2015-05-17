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
        return `${(hours < 10 ? '0' + hours : hours)}:${this.leadingZero(minutes)}:${this.leadingZero(seconds)}`;
    },

    getTimeFromDateString(dateString) {
        let date = !isNaN(Date.parse(dateString)) ? new Date(dateString) : null;
        if (date) {
            return `${this.leadingZero(date.getHours())}:${this.leadingZero(date.getMinutes())}`;
        }
        return '';
    },

    getDate(date) {
        return `${this.leadingZero(date.getDate())}.${this.leadingZero(date.getMonth() + 1)}.${date.getFullYear()}`;
    },

    getDateForApi(date) {
        return `${date.getFullYear()}-${this.leadingZero(date.getMonth() + 1)}-${this.leadingZero(date.getDate())}`;
    },

    leadingZero(nr) {
        return ('0' + nr).slice(-2);
    },

    getDateFromParam(dateString) {
        return !isNaN(Date.parse(dateString)) ? new Date(dateString) : new Date();
    }
};
