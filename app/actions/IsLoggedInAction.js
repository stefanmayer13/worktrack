'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const request = require('superagent-bluebird-promise');
const ActionTypes = require('../constants/ActionTypes');

module.exports = function IsLoggedInAction (context) {
    return request.get(`/api/jira/login`)
        .withCredentials()
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                context.dispatch(ActionTypes.GET_USER_DATA_SUCCESS, response.body);
                return response.body;
            }
            context.dispatch(ActionTypes.GET_USER_DATA_FAILURE, response.body.message);
        }, (error) => {
            context.dispatch(ActionTypes.GET_USER_DATA_FAILURE, error.body.message);
        });
};
