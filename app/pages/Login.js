'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const mui = require('material-ui');
const connectToStores = require('fluxible/addons/connectToStores');
const FluxibleMixin = require('fluxible/addons/FluxibleMixin');
const UserStore = require('../stores/UserStore');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');
const LoginAction = require('../actions/LoginAction');

const TextField = mui.TextField;
const RaisedButton = mui.RaisedButton;

const Home = React.createClass({
    mixins: [MaterialUiMixin, FluxibleMixin],

    getInitialState() {
        return {
            usernameErrorText: '',
            passwordErrorText: '',
            showPassword: false
        };
    },

    render() {
        const passwordClass = this.state.showPassword ? 'open' : 'closed';
        return (
            <div className='page login'>
                <h1>Welcome to Worktrack</h1>
                <p>
                    Login with your Jira user to gain access:
                </p>
                <TextField
                    errorText={this.state.usernameErrorText}
                    floatingLabelText="Username"
                    onChange={this._onUserNameChange}
                    onEnterKeyDown={this._onSubmit}
                    autoComplete="username"
                    autoFocus={true}
                    autoCapitalize="none"
                    autoCorrect="off"
                    ref="username" />
                <br />
                <TextField
                    errorText={this.state.passwordErrorText}
                    floatingLabelText="Password"
                    onChange={this._onUserPasswordChange}
                    onEnterKeyDown={this._onSubmit}
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    type={this.state.showPassword ? null : 'password'}
                    ref="password" />
                <div className={`showpassword ${passwordClass}`} onClick={this._togglePassword}></div>
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

    _togglePassword(e) {
        this.setState({
            showPassword: !this.state.showPassword
        });
        e.preventDefault();
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
