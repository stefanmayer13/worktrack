'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const request = require('superagent-bluebird-promise');
const Config = require('../Config');

module.exports = {
    request(url, type, params) {
        return request[type](`${Config.baseUrl}/api/${url}?${params || ''}`)
            .withCredentials();
    },

    get(url, options) {
        return this.request(url, 'get', options ? options.params : '');
    },

    post (url, options) {
        return this.request(url, 'post', options ? options.params : '')
            .send(options.body);
    },

    del (url, options) {
        return this.request(url, 'del', options ? options.params : '');
    }
};
