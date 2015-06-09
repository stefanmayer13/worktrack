'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Router = require('react-router');
const connectToStores = require('fluxible/addons/connectToStores');
const mui = require('material-ui');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');
const Api = require('../utils/Api');
const UserStore = require('../stores/UserStore');

const RaisedButton = mui.RaisedButton;
const Link = Router.Link;

let Home = React.createClass({
    mixins: [MaterialUiMixin],

    render() {
        let page = this.props.loggedIn ? (
            <div className='page'>
                <h1>Welcome to Worktrack</h1>
                <p>
                    The following pages are currently available:
                    <ul className="nav">
                        <li><Link to="log"><RaisedButton label="Log" primary={true} /></Link></li>
                        <li><Link to="worklog"><RaisedButton label="Worklog" primary={true} /></Link></li>
                        <li><Link to="worklogchart"><RaisedButton label="Chart" secondary={true} /></Link></li>
                        <li><Link to="toggl"><RaisedButton label="Toggl" secondary={true} /></Link></li>
                        <li><Link to="login"><RaisedButton label="Login" /></Link></li>
                    </ul>
                </p>
            </div>
        ) : (
            <div>Not allowed!</div>
        );
        return <div>{page}</div>;
    }
});

Home = connectToStores(Home, [UserStore], function (stores, props) {
    return {
        loggedIn: stores.UserStore.isLoggedIn()
    };
})

module.exports = Home;
