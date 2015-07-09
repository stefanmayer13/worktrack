'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
const rewire = require('rewire');
const React = require('react/addons');
const expect = require('chai').expect;
const TimeEntry = rewire("../../../app/components/TimeEntry.js");

TimeEntry.__set__("Time", {
    getTimeFromMs(t) {
        return t;
    },
    getTimeFromDateString(t) {
        return t;
    }
});

const TestUtils = React.addons.TestUtils;

describe("TimeEntry", () => {
    it("render entries", function() {
        const entry = {
            project: 'project',
            dur: 100,
            start: 1,
            end: 2,
            jira: {}
        };

        const entryNode = TestUtils.renderIntoDocument(<TimeEntry key="key" entry={entry} sync={() => {}} />);

        const projectNode = TestUtils.findRenderedDOMComponentWithClass(entryNode, 'project');
        expect(projectNode).to.not.be.undefined;
        expect(projectNode.getDOMNode().innerText).to.be.equal('project');

        const durationNode = TestUtils.findRenderedDOMComponentWithClass(entryNode, 'duration');
        expect(durationNode).to.not.be.undefined;

        const timeNode = TestUtils.findRenderedDOMComponentWithClass(entryNode, 'time');
        expect(timeNode).to.not.be.undefined;

        const jiraNode = TestUtils.findRenderedDOMComponentWithClass(entryNode, 'jira');
        expect(jiraNode).to.not.be.undefined;
    });

    it("only displays jira info if present", function() {
        const entry = {};

        const entryNode = TestUtils.renderIntoDocument(<TimeEntry key="key" entry={entry} sync={() => {}} />);

        const node = TestUtils.scryRenderedDOMComponentsWithClass(entryNode, 'jira');
        expect(node).to.deep.equal([]);
    });

    it("displays jira error if jira is not present", function() {
        const entry = {};

        const entryNode = TestUtils.renderIntoDocument(<TimeEntry key="key" entry={entry} sync={() => {}} />);

        const node = TestUtils.findRenderedDOMComponentWithClass(entryNode, 'jiraerror');
        expect(node).to.not.be.undefined;
    });

    it("displays sync button if not logged", function() {
        const entry = {};

        const entryNode = TestUtils.renderIntoDocument(<TimeEntry key="key" entry={entry} sync={() => {}} />);

        const node = TestUtils.findRenderedDOMComponentWithTag(entryNode, 'button');
        expect(node).to.not.be.undefined;
        expect(node.props.disabled).to.be.falsy;
    });

    it("displays no sync button if no handler is defined", function() {
        const entry = {};

        const entryNode = TestUtils.renderIntoDocument(<TimeEntry key="key" entry={entry}/>);

        const node = TestUtils.scryRenderedDOMComponentsWithTag(entryNode, 'button');
        expect(node).to.deep.equal([]);
    });

    it("displays logged info and no enabled button if logged", function() {
        const entry = {
            worklog: 1,
            jira: {}
        };

        const entryNode = TestUtils.renderIntoDocument(<TimeEntry key="key" entry={entry} sync={() => {}} />);

        const button = TestUtils.scryRenderedDOMComponentsWithTag(entryNode, 'button');
        console.log();
        expect(button[0].props.disabled).to.be.truthy;

        const node = TestUtils.findRenderedDOMComponentWithClass(entryNode, 'log');
        expect(node).to.not.be.undefined;
        expect(node.tagName).to.be.equal('DIV');
    });
});
