'use strict';

let createStore = require('fluxible/addons/createStore');

let WorklogStore = createStore({
    storeName: 'WorklogStore',
    handlers: {
        'SYNC_WORKLOGS': '_startLoading',
        'SYNC_WORKLOGS_FAILURE': '_handleFailure',
        'GET_WORKLOGS': '_startLoading',
        'GET_WORKLOGS_SUCCESS': '_handleGetWorklogsSuccess',
        'GET_WORKLOGS_FAILURE': '_handleFailure'
    },

    initialize() {
        this.loading = false;
        this.data = [];
        this.total = 0;
        this.error = null;
    },

    isLoading() {
        return this.loading;
    },

    getWorklogs() {
        return this.data;
    },

    getTotal() {
        return this.total;
    },

    getError() {
        return this.error;
    },

    _startLoading() {
        this.loading = true;
        this.error = null;
        this.emitChange();
    },

    _handleGetWorklogsSuccess(data) {
        this.data = data.data;
        this.total = data.total;
        this.loading = false;
        this.error = null;
        this.emitChange();
    },

    _handleFailure(error) {
        this.data = [];
        this.total = 0;
        this.loading = false;
        this.error = error;
        this.emitChange();
    },

    dehydrate() {
        return {
            data: this.data,
            total: this.total,
            error: this.error
        };
    },

    rehydrate(state) {
        this.data = state.data;
        this.total = state.total;
        this.error = state.error;
    }
});

module.exports = WorklogStore;

