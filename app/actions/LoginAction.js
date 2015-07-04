'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const request = require('superagent-bluebird-promise');
const ActionTypes = require('../constants/ActionTypes');
const IsLoggedInAction = require('./IsLoggedInAction');
const Config = require('../Config');

module.exports = function LoginAction (context, payload) {
    return request.post(`${Config.baseUrl}/api/jira/login`)
        .send({
            username: payload.username,
            password: payload.password
        })
        .withCredentials()
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                context.dispatch(ActionTypes.LOGIN_SUCCESS, response.body);
                context.executeAction(IsLoggedInAction);
            } else {
                context.dispatch(ActionTypes.LOGIN_FAILURE, response.body.message);
            }
        }, (error) => {
            context.dispatch(ActionTypes.LOGIN_FAILURE, error.body.message);
        });
};
