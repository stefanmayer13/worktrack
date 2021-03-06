'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */


const ActionTypes = require('../constants/ActionTypes');
const Time = require('../utils/TimeHelper');
const Api = require('../utils/Api');

module.exports = function LoginAction (context, payload) {
    const apiDate = Time.getDateForApi(payload);
    const params = `start=${apiDate}&end=${apiDate}`;
    context.dispatch(ActionTypes.GET_WORKLOGS);

    return Api.get('logs', {
        params: params
    }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
            context.dispatch(ActionTypes.GET_WORKLOGS_SUCCESS, response.body);
        } else {
            context.dispatch(ActionTypes.GET_WORKLOGS_FAILURE, response.body.message);
        }
    }, (error) => {
        context.dispatch(ActionTypes.GET_WORKLOGS_FAILURE, error.body.message);
    });
};
