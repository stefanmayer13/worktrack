'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const Api = require('../utils/Api');
const ActionTypes = require('../constants/ActionTypes');

module.exports = function IsLoggedInAction (context) {
    return fetch(`/api/jira/login`, {
        method: 'get',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
    }})
    .then((response) => {
        if (response.status >= 200 && response.status < 300) {
            context.dispatch(ActionTypes.GET_USER_DATA_SUCCESS, response.body);
            return response.body;
        }
        context.dispatch(ActionTypes.GET_USER_DATA_FAILURE, response.statusText);
        throw new Error(response.statusText);
    });
}
