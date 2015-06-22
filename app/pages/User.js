'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Router = require('react-router');
const connectToStores = require('fluxible/addons/connectToStores');
const FluxibleMixin = require('fluxible/addons/FluxibleMixin');
const mui = require('material-ui');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');
const LogoutAction = require('../actions/LogoutAction');
const UserStore = require('../stores/UserStore');

const RaisedButton = mui.RaisedButton;
const Link = Router.Link;

let User = React.createClass({
    mixins: [MaterialUiMixin, FluxibleMixin],

    render() {
        return (
            <div className='page'>
                <h1>Welcome to Worktrack</h1>
                <p>
                    Username: {this.props.user ? this.props.user.username : null}
                </p>
                <p>
                    Toggl: {this.props.user ? this.props.user.togglApi : null}
                </p>
            </div>
        );
    },

    _logout() {
        this.executeAction(LogoutAction);
    }
});

module.exports = connectToStores(User, [UserStore], function (stores) {
    return {
        user: stores.UserStore.getCurrentUser()
    };
});
