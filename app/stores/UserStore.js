'use strict';

let createStore = require('fluxible/addons/createStore');

let UserStore = createStore({
    storeName: 'UserStore',
    handlers: {
        'GET_USER_DATA_SUCCESS': '_handleGetUserDataSuccess',
        'GET_USER_DATA_FAILURE': '_handleGetUserDataFailure'
    },

    initialize() {
        this.userData = null;
        this.error = null;
    },

    isLoggedIn() {
        return !!this.userData;
    },

    getCurrentUser() {
        return this.userData;
    },

    getError() {
        return this.error;
    },

    _handleGetUserDataSuccess(userData) {
        this.userData = userData;
        this.error = null;
        this.emitChange();
    },

    _handleGetUserDataFailure(error) {
        this.userData = null;
        this.error = error;
        this.emitChange();
    },

    dehydrate() {
        return {
            userData: this.userData,
            error: this.error
        };
    },

    rehydrate(state) {
        this.userData = state.userData;
        this.error = state.error;
    }
});

module.exports = UserStore;

