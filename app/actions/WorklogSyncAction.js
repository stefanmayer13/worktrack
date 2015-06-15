'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const request = require('superagent-bluebird-promise');
const ActionTypes = require('../constants/ActionTypes');
const Time = require('../utils/TimeHelper');

module.exports = function LoginAction (context, payload) {
    const date = Time.getDateFromParam(payload);
    const params = `start=${Time.getDateForApi(date)}`
        + `&end=${Time.getDateForApi(date)}`;

    return request.post(`/api/toggl/sync?${params}`)
        .withCredentials()
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                context.dispatch(ActionTypes.LOGIN_SUCCESS, response.body);
            } else {
                context.dispatch(ActionTypes.LOGIN_FAILURE, response.body.message);
            }
        }, (error) => {
            context.dispatch(ActionTypes.LOGIN_FAILURE, error.body.message);
        });
};
