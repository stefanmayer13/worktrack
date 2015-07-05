'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const ActionTypes = require('../constants/ActionTypes');
const Time = require('../utils/TimeHelper');
const GetWorklogAction = require('./GetWorklogAction');
const Api = require('../utils/Api');

module.exports = function LoginAction (context, payload) {
    const date = Time.getDateFromParam(payload);
    const params = `start=${Time.getDateForApi(date)}`
        + `&end=${Time.getDateForApi(date)}`;

    context.dispatch(ActionTypes.SYNC_WORKLOGS);
    return Api.post(`toggl/sync`, {
        params: params
    })
    .then((response) => {
        if (response.status >= 200 && response.status < 300) {
            context.executeAction(GetWorklogAction, date);
        } else {
            context.dispatch(ActionTypes.SYNC_WORKLOGS_FAILURE, response.body.message);
        }
    }).catch((error) => {
        context.dispatch(ActionTypes.SYNC_WORKLOGS_FAILURE, error.body.message);
    });
};
