'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const ActionTypes = require('../constants/ActionTypes');
const Api = require('../utils/Api');

module.exports = function LoginAction (context) {
    return Api.del(`jira/login`)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                context.dispatch(ActionTypes.LOGOUT_SUCCESS, response.body);
            } else {
                context.dispatch(ActionTypes.LOGOUT_FAILURE, response.body.message);
            }
        }, (error) => {
            context.dispatch(ActionTypes.LOGOUT_FAILURE, error.body.message);
        });
};
