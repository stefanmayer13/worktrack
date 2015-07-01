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
const SetTogglKeyAction = require('../actions/SetTogglKeyAction');
const UserStore = require('../stores/UserStore');

const TextField = mui.TextField;
const RaisedButton = mui.RaisedButton;
const Link = Router.Link;

let User = React.createClass({
    mixins: [MaterialUiMixin, FluxibleMixin],

    render() {
        return (
            <div className='page'>
                <div>
                    <Link to="home"><RaisedButton label="Back" /></Link>
                </div>
                <p>
                    Username: {this.props.user ? this.props.user.username : null}
                </p>
                <p>
                    <TextField
                        floatingLabelText="Toggl API-Key"
                        onEnterKeyDown={this._saveTogglKey}
                        onBlur={this._saveTogglKey}
                        defaultValue={this.props.user ? this.props.user.togglApi : null}
                        ref="togglapi"
                        style={{width: '20rem'}} />
                </p>
                <p>
                    <TextField
                        floatingLabelText="Toggl Workspace ID"
                        onEnterKeyDown={this._saveTogglKey}
                        onBlur={this._saveTogglKey}
                        defaultValue={this.props.user ? this.props.user.togglWorkspace : null}
                        ref="togglworkspace"
                        style={{width: '20rem'}} />
                </p>
            </div>
        );
    },

    _saveTogglKey() {
        const togglApi = this.refs.togglapi.getValue();
        const togglWorkspace = this.refs.togglworkspace.getValue();
        if (togglApi) {
            this.executeAction(SetTogglKeyAction, {
                togglApi,
                togglWorkspace
            });
        }
    }
});

module.exports = connectToStores(User, [UserStore], function (stores) {
    return {
        user: stores.UserStore.getCurrentUser()
    };
});
