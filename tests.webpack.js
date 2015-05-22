'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

if (require.context) {
    const context = require.context('./tests', true, /.spec\.js$/);
    context.keys().forEach(context);

    const projectModuleIds = context.keys().map(module =>
        String(context.resolve(module)));

    beforeEach(() => {
        // Remove our modules from the require cache before each test case.
        projectModuleIds.forEach(id => delete require.cache[id]);
    });
}
