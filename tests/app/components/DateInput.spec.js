'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
const rewire = require('rewire');
const React = require('react/addons');
const expect = require('chai').expect;
const sinon = require('sinon');
const DateInput = rewire("../../../app/components/DateInput.js");

const TimeMock = {
    getDateForApi(t) {
        return t.toISOString();
    }
};
DateInput.__set__("Time", TimeMock);

const TestUtils = React.addons.TestUtils;

describe("DateInput", () => {
    it("render input", function() {
        const inputNode = TestUtils.renderIntoDocument(
            <DateInput name="name"
                      value={new Date()}
                      onSubmit={() => {}} />
        );

        const inputTag = TestUtils.findRenderedDOMComponentWithTag(inputNode, 'input');

        expect(inputTag).to.not.be.undefined;
    });

    it("should by of type date", function() {
        const inputNode = TestUtils.renderIntoDocument(
            <DateInput name="name"
                       value={new Date()}
                       onSubmit={() => {}} />
        );

        const inputTag = TestUtils.findRenderedDOMComponentWithTag(inputNode, 'input');

        expect(inputTag.getDOMNode().type).to.be.equal('date');
    });

    it("should use the name provided by props", function() {
        const inputNode = TestUtils.renderIntoDocument(
            <DateInput name="name"
                       value={new Date()}
                       onSubmit={() => {}} />
        );

        const inputTag = TestUtils.findRenderedDOMComponentWithTag(inputNode, 'input');

        expect(inputTag.getDOMNode().name).to.be.equal('name');
    });

    it("should use the value provided by props", function() {
        const date = new Date('05/25/2015');

        const inputNode = TestUtils.renderIntoDocument(
            <DateInput name="date"
                       value={date}
                       onSubmit={() => {}} />
        );

        const inputTag = TestUtils.findRenderedDOMComponentWithTag(inputNode, 'input');

        expect(inputTag.getDOMNode().value).to.be.equal(TimeMock.getDateForApi(date));
    });

    it("should allow changing the input", function() {
        const date = new Date('05/25/2015');
        const newDate = new Date('05/26/2015');

        const inputNode = TestUtils.renderIntoDocument(
            <DateInput name="date"
                       value={date}
                       onSubmit={() => {}} />
        );

        const inputTag = TestUtils.findRenderedDOMComponentWithTag(inputNode, 'input');
        React.addons.TestUtils.Simulate.change(inputTag, {target: {value: TimeMock.getDateForApi(newDate)}});

        expect(inputTag.getDOMNode().value).to.be.equal(TimeMock.getDateForApi(newDate));
    });

    it("should call the onSubmit handler on enter", function() {
        const date = new Date('05/25/2015');
        const onSubmit = sinon.spy();

        const inputNode = TestUtils.renderIntoDocument(
            <DateInput name="date"
                       value={date}
                       onSubmit={onSubmit} />
        );

        const inputTag = TestUtils.findRenderedDOMComponentWithTag(inputNode, 'input');
        React.addons.TestUtils.Simulate.keyDown(inputTag, {key: "Enter"});

        expect(onSubmit.calledOnce).to.be.true;
        expect(onSubmit.getCall(0).args[0]).to.be.deep.equal(date);
    });

    it("should not call the onSubmit handler on other events", function() {
        const date = new Date('05/25/2015');
        const onSubmit = sinon.spy();

        const inputNode = TestUtils.renderIntoDocument(
            <DateInput name="date"
                       value={date}
                       onSubmit={onSubmit} />
        );

        const inputTag = TestUtils.findRenderedDOMComponentWithTag(inputNode, 'input');
        React.addons.TestUtils.Simulate.keyDown(inputTag, {key: "a"});

        expect(onSubmit.calledOnce).to.be.false;
    });

    it("should change value on props change", function() {
        const date = new Date('05/25/2015');
        const newDate = new Date('05/26/2015');

        var PropsTester = React.createFactory(
            React.createClass({
                getInitialState() {
                    return {value: date};
                },
                render() {
                    return <DateInput name="date" value={this.state.value} onSubmit={() => {}} />;
                }
            })
        );

        const wrappedInputNode = TestUtils.renderIntoDocument(PropsTester());

        wrappedInputNode.setState({
            value: newDate
        });

        const inputTag = TestUtils.findRenderedDOMComponentWithTag(wrappedInputNode, 'input');

        expect(inputTag.getDOMNode().value).to.be.equal(TimeMock.getDateForApi(newDate));
    });
});
