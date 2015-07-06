'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Router = require('react-router');
const Mui = require('material-ui');
const CurrentEntry = require('../components/CurrentEntry');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');

const RaisedButton = Mui.RaisedButton;
const Link = Router.Link;

module.exports = React.createClass({
    mixins: [MaterialUiMixin],

    render() {
        let currentEntry = this.state.entry ? <CurrentEntry start={this.state.start} /> : null;

        return (
            <div className='page logger'>
                <div className="backbutton">
                    <Link to="home"><RaisedButton label="Back" /></Link>
                </div>
                <RaisedButton onClick={this._startLog} label="Log" />

                <p>
                    Credits:
                    * Password Eye by Hello Many from the Noun Project
                </p>
            </div>
        );
    }
});
