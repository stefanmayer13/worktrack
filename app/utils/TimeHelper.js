'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

module.exports = {
    getTimeFromMs(time) {
        let timeInSeconds = time/1000,
            seconds = timeInSeconds % 60,
            minutes = Math.floor(timeInSeconds/60) % 60,
            hours = Math.floor(timeInSeconds/3600) % 60;
        return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    },

    getTimeFromDateString(dateString) {
        let date = !isNaN(Date.parse(dateString)) ? new Date(dateString) : null;
        if (date) {
            return date.getHours() + ':' + date.getMinutes();
        }
        return '';
    }
};
