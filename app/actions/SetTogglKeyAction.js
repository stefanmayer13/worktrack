'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const request = require('superagent-bluebird-promise');
const ActionTypes = require('../constants/ActionTypes');
const IsLoggedInAction = require('./IsLoggedInAction');

module.exports = function SetTogglKeyAction (context, payload) {
    return request.post(`api/user`)
        .send(payload)
        .withCredentials()
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                context.executeAction(IsLoggedInAction);
            } else {
                context.dispatch(ActionTypes.SET_USER_FAILURE, response.body.message);
            }
        }, (error) => {
            context.dispatch(ActionTypes.SET_USER_FAILURE, error.body.message);
        });
};
