'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const ActionTypes = require('../constants/ActionTypes');
const IsLoggedInAction = require('./IsLoggedInAction');
const Api = require('../utils/Api');

module.exports = function LoginAction (context, payload) {
    return Api.post('jira/login', {
        data: {
            username: payload.username,
            password: payload.password
        }
    }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
            context.dispatch(ActionTypes.LOGIN_SUCCESS, response.body);
            context.executeAction(IsLoggedInAction);
        } else {
            context.dispatch(ActionTypes.LOGIN_FAILURE, response.body.message);
        }
    }).catch((error) => {
        context.dispatch(ActionTypes.LOGIN_FAILURE, error.body.message);
    });
};
