'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const mui = require('material-ui');
const connectToStores = require('fluxible/addons/connectToStores');
const FluxibleMixin = require('fluxible').FluxibleMixin;
const UserStore = require('../stores/UserStore');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');
const Api = require('../utils/Api');
const LoginAction = require('../actions/LoginAction');

const TextField = mui.TextField;
const RaisedButton = mui.RaisedButton;

const Home = React.createClass({
    mixins: [MaterialUiMixin, FluxibleMixin],

    getInitialState() {
        return {
            usernameErrorText: '',
            passwordErrorText: ''
        };
    },

    render() {
        return (
            <div className='page'>
                <h1>Welcome to Worktrack</h1>
                <p>
                    Login with your Jira user to gain access:
                </p>
                <TextField
                    errorText={this.state.usernameErrorText}
                    floatingLabelText="Username"
                    onChange={this._onUserNameChange}
                    onEnterKeyDown={this._onSubmit}
                    ref="username" />
                <br />
                <TextField
                    errorText={this.state.passwordErrorText}
                    floatingLabelText="Password"
                    onChange={this._onUserPasswordChange}
                    onEnterKeyDown={this._onSubmit}
                    type="password"
                    ref="password" />
                <br />
                <p className="error">{this.props.error}</p>
                <RaisedButton label="Login" primary={true} onClick={this._onSubmit} />
            </div>
        );
    },

    _onUserNameChange(e) {
        this.setState({
            usernameErrorText: e.target.value ? '' : 'This field is required.'
        });
    },

    _onUserPasswordChange(e) {
        this.setState({
            passwordErrorText: e.target.value ? '' : 'This field is required.'
        });
    },

    _onSubmit() {
        const username = this.refs.username.getValue();
        const password = this.refs.password.getValue();

        if (!username || !password) {
            return;
        }

        this.executeAction(LoginAction, {
            username,
            password
        });
    }
});

module.exports = connectToStores(Home, [UserStore], function (stores) {
    return {
        error: stores.UserStore.getLoginError()
    };
});
