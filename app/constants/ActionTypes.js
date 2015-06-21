'use strict';

let keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
    /* UserStoreActions */
    GET_USER_DATA: null,
    GET_USER_DATA_SUCCESS: null,
    GET_USER_DATA_FAILURE: null,
    LOGIN_SUCCESS: null,
    LOGIN_FAILURE: null,
    LOGOUT_SUCCESS: null,
    LOGOUT_FAILURE: null,

    /* WorklogActions */
    GET_WORKLOGS: null,
    GET_WORKLOGS_SUCCESS: null,
    GET_WORKLOGS_FAILURE: null,
    SYNC_WORKLOGS: null,
    SYNC_WORKLOGS_SUCCESS: null,
    SYNC_WORKLOGS_FAILURE: null
});
