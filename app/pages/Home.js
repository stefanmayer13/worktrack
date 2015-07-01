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

let Home = React.createClass({
    mixins: [MaterialUiMixin, FluxibleMixin],

    render() {
        let warning = (this.props.user && this.props.user.togglApi && this.props.user.togglWorkspace) ? null :
            (<p>
                Worktrack currently works only with <a href="http://toggl.com">Toggl</a>.
                Please add your Toggl API-Key under <Link to="user">User</Link>.
            </p>);
        return (
            <div className='page'>
                <h1>Welcome to Worktrack</h1>
                {warning}
                <p>
                    The following pages are currently available:
                    <ul className="nav">
                        {/*<li><Link to="log"><RaisedButton label="Log" primary={true} /></Link></li>*/}
                        <li><Link to="worklog"><RaisedButton label="Worklog" primary={true} /></Link></li>
                        {/*<li><Link to="worklogchart"><RaisedButton label="Chart" secondary={true} /></Link></li>*/}
                        <li><Link to="user"><RaisedButton label="User" secondary={true} /></Link></li>
                        <li><RaisedButton onClick={this._logout} label="Logout" /></li>
                    </ul>
                </p>
            </div>
        );
    },

    _logout() {
        this.executeAction(LogoutAction);
    }
});

module.exports = connectToStores(Home, [UserStore], function (stores) {
    return {
        user: stores.UserStore.getCurrentUser()
    };
});
