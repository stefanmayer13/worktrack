'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let React = require('react/addons');
let Time = require('../utils/TimeHelper');

let DateInput = React.createClass({

    getInitialState() {
        return {
            loading: false,
            value: null
        };
    },

    propTypes: {
        name: React.PropTypes.string,
        value: React.PropTypes.object,
        onSubmit: React.PropTypes.func
    },

    componentWillMount() {
        this.setState({
            value: Time.getDateForApi(this.props.value)
        });
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: Time.getDateForApi(nextProps.value)
        });
    },

    render() {
        return (
            <input type="date" name="date"
                   value={this.state.value}
                   onChange={this._onChange}
                   onKeyDown={this._onKeyDown} />
        );
    },

    _onChange(e) {
        this.setState({
            value: e.target.value
        });
    },

    _onKeyDown(e) {
        let char = e.keyCode;
        if (char === 13 && typeof this.props.onSubmit === 'function') {
            this.props.onSubmit(new Date(e.target.value));
        }
    }
});

module.exports = DateInput;
