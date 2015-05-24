'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let testsContext = require.context('../tests', true, /.spec\.js$/);
testsContext.keys().forEach(testsContext );

const projectModuleIds = testsContext.keys().map(module =>
    String(testsContext.resolve(module)));

beforeEach(() => {
    // Remove our modules from the require cache before each test case.
    projectModuleIds.forEach(id => delete require.cache[id]);
});
