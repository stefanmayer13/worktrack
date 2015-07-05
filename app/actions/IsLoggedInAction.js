'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const ActionTypes = require('../constants/ActionTypes');
const Api = require('../utils/Api');

module.exports = function IsLoggedInAction (context) {
    return Api.get(`jira/login`)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                context.dispatch(ActionTypes.GET_USER_DATA_SUCCESS, response.body);
                return response.body;
            }
            context.dispatch(ActionTypes.GET_USER_DATA_FAILURE, response.body.message);
        }).catch((error) => {
            context.dispatch(ActionTypes.GET_USER_DATA_FAILURE, error.body.message);
        });
};
