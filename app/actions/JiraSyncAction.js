'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const request = require('superagent-bluebird-promise');
const ActionTypes = require('../constants/ActionTypes');
const Time = require('../utils/TimeHelper');
const GetWorklogAction = require('./GetWorklogAction');
const Config = require('../Config');

module.exports = function LoginAction (context, payload) {
    const date = Time.getDateFromParam(payload.date);

    context.dispatch(ActionTypes.SYNC_WORKLOGS);
    return request.post(`${Config.baseUrl}/api/jira/add`)
        .withCredentials()
        .send(payload.entries)
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
