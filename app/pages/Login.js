'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const mui = require('material-ui');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');
const Api = require('../utils/Api');
const request = require('superagent-bluebird-promise');

const TextField = mui.TextField;
const RaisedButton = mui.RaisedButton;

const Home = React.createClass({
    mixins: [MaterialUiMixin],

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
                    <RaisedButton label="Login" primary={true} onClick={this._onSubmit} />
                    <RaisedButton label="IsLoggedIn?" secondary={true} onClick={this._checkLogin} />
                </p>
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
        const user = this.refs.username.getValue();
        const password = this.refs.password.getValue();

        if (!user || !password) {
            return;
        }

        request.post(`/api/jira/login`)
            .send({
                username: user,
                password: password
            })
            .withCredentials()
            .then((data) => {
                console.log(data);
            }, (error) => {
                console.log(error);
            });
    },

    _checkLogin() {
        Api.fetch(`/api/jira/login`, {
            method: 'get',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).subscribe((data) => {
            console.log(data);
            alert('Logged in!');
        }, (error) => {
            console.log(error);
            alert('Not logged in!');
        });
    }
});

module.exports = Home;
