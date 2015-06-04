'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Router = require('react-router');
const mui = require('material-ui');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');
const Api = require('../utils/Api');

const RaisedButton = mui.RaisedButton;
const Link = Router.Link;

const Home = React.createClass({
    mixins: [MaterialUiMixin],

    render() {
        return (
            <div className='page'>
                <h1>Welcome to Worktrack</h1>
                <p>
                    The following pages are currently available:
                    <ul className="nav">
                        <li><Link to="worklog"><RaisedButton label="Worklog" primary={true} /></Link></li>
                        <li><Link to="worklogchart"><RaisedButton label="Chart" secondary={true} /></Link></li>
                        <li><Link to="toggl"><RaisedButton label="Toggl" secondary={true} /></Link></li>
                        <li><Link to="login"><RaisedButton label="Login" /></Link></li>
                    </ul>
                </p>
            </div>
        );
    },

    _login() {
        Api.fetch(`/api/jira/login`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'a',
                password: 'b'
            })
        }).subscribe((data) => {
            console.log(data);
        }, (error) => {
            console.log(error);
        });
    }
});

module.exports = Home;
