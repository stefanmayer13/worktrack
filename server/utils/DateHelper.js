'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

module.exports = {
    getTogglDate(datestring) {
        let date = isNaN(Date.parse(datestring)) ? new Date() : new Date(datestring);
        return date.toISOString().split('T')[0];
    }
};
