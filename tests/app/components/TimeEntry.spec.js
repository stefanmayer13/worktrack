'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const expect = require('chai').expect;
const TimeEntry = require('../../../app/components/TimeEntry');

const TestUtils = React.addons.TestUtils;

describe("TimeEntry", () => {
    it("render entries", function() {
        const entry = {
            project: 'project'
        };

        const entryNode = TestUtils.renderIntoDocument(<TimeEntry key="key" entry={entry} sync={() => {}} />);

        const projectNode = TestUtils.findRenderedDOMComponentWithClass(entryNode, 'project');

        expect(projectNode).to.not.be.undefined;
        expect(projectNode.getDOMNode().innerText).to.be.equal('project');
    });
});
