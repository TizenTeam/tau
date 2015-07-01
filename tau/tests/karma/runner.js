/*global QUnit */
var allTestFiles = [],
    TEST_REGEXP = /^\/base\/tests\/karma.*test\.js$/,
    testCount = 0,
    qunitTest = QUnit.test;

QUnit.test = window.test = function () {
    testCount += 1;
    qunitTest.apply(this, arguments);
};

QUnit.begin(function (args) {
    args.totalTests = testCount;
});

var pathToModule = function(path) {
    return path.replace(/^\/base\//, "").replace(/\.js$/, "");
};

QUnit.config.autostart = false;

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: "/base",

    // example of using a couple path translations (paths), to allow us to refer to different library dependencies, without using relative paths
    paths: {
        "src": "/base/src"
    },


    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});