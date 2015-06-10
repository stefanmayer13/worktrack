'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Mui = require('material-ui');
const CurrentEntry = require('../components/CurrentEntry');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');

const RaisedButton = Mui.RaisedButton;

module.exports = React.createClass({
    mixins: [MaterialUiMixin],

    getInitialState() {
        return {
            entry: null,
            start: 0
        };
    },

    render() {
        let currentEntry = this.state.entry ? <CurrentEntry start={this.state.start} /> : null;

        return (
            <div className='page logger'>
                <RaisedButton onClick={this._startLog} label="Log" />

                {currentEntry}
            </div>
        );
    },

    _startLog() {
        this.setState({
            entry: 'test',
            start: new Date()
        });
    }
});
