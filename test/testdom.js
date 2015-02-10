// Via http://www.asbjornenge.com/wwc/testing_react_components.html
module.exports = function(markup) {
    if (typeof document !== 'undefined') return;
    var jsdom = require("jsdom");
    global.document = jsdom.jsdom(markup || '<!doctype html><html><body></body></html>');
    global.window = document.parentWindow;
    global.navigator = {
        userAgent: 'node.js'
    };
    // ... add whatever browser globals your tests might need ...
};
