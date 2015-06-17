'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const request = require('superagent-bluebird-promise');
const ActionTypes = require('../constants/ActionTypes');
const Time = require('../utils/TimeHelper');
const GetWorklogAction = require('./GetWorklogAction');

module.exports = function LoginAction (context, payload) {
    const date = Time.getDateFromParam(payload);
    const params = `start=${Time.getDateForApi(date)}`
        + `&end=${Time.getDateForApi(date)}`;

    context.dispatch(ActionTypes.SYNC_WORKLOGS);
    return request.post(`/api/toggl/sync?${params}`)
        .withCredentials()
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                context.executeAction(GetWorklogAction, date);
            } else {
                context.dispatch(ActionTypes.SYNC_WORKLOGS_FAILURE, response.body.message);
            }
        }, (error) => {
            context.dispatch(ActionTypes.SYNC_WORKLOGS_FAILURE, error.body.message);
        });
};
