'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const ActionTypes = require('../constants/ActionTypes');
const IsLoggedInAction = require('./IsLoggedInAction');
const Api = require('../utils/Api');

module.exports = function SetTogglWorkspaceAction (context, payload) {
    return Api.post(`user`, {
        data: payload
    })
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
