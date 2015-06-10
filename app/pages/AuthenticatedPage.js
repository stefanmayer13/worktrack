'use strict';

const React = require('react/addons');
const connectToStores = require('fluxible/addons/connectToStores');
const UserStore = require('../stores/UserStore');
const LoginPage = require('../pages/Login');
const Router = require('react-router');

let AuthenticatedPage = React.createClass({
    mixins: [Router.State],

    render() {
        return this.props.loggedIn ? this._getRouteHandler()() : <LoginPage />;
    },

    _getRouteHandler() {
        let routes = this.context.router.getCurrentRoutes();

        return React.createFactory(routes[routes.length -1].handler);
    }
});

AuthenticatedPage = connectToStores(AuthenticatedPage, [UserStore], function (stores) {
    return {
        loggedIn: stores.UserStore.isLoggedIn()
    };
});

module.exports = AuthenticatedPage;
