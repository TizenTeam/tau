// Karma configuration
// Generated on Thu Jun 11 2015 12:03:58 GMT+0200 (Central European Summer Time)
module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "../../",


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["requirejs", "qunit"],

        reporters: ["progress", "coverage"],

        coverageReporter: {
            type: "html",
            dir: "reports/coverage/"
        },

        plugins: ["karma-requirejs", "karma-chrome-launcher", "karma-qunit", "karma-coverage"],
        autoWatch: true,
        // list of files / patterns to load in the browser
        files: [
            {pattern: "tests/libs/qunit-1.11.0.js", included: true, served: true},
            {pattern: "tests/libs/jquery.js", included: true, served: true},
            {pattern: "libs/path-to-regexp.js", included: false, served: true},
            {pattern: "tests/libs/require.js", included: false, served: true},

            {pattern: "demos/SDK/mobile/UIComponents/**/*", included: false, served: true},
            {pattern: "demos/SDK/mobile/UIComponentsCE/**/*", included: false, served: true},

            {pattern: "tests/karma/tests/helpers.js", included: false, served: true, watch: true},
            {pattern: "tests/karma/tests/compare-helper.js", included: false, served: true, watch: true},
            {pattern: "tests/js/core/router/Router/test-data/externalPage.html", included: false, served: true, watch: false},
            {pattern: "tests/js/core/router/Router/**/*.js", included: false, served: true, watch: false},

            // here put path to single test
            {pattern: "tests/karma/tests/customelements/mobile-test.js", included: false, served: true, watch: true},
            "tests/karma/runner.js"
        ],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        customLaunchers: {
            bigScreen: {
                base: "Chrome",
                flags: [ "--window-size=1000,960"]
            }
        },

        browsers: ["bigScreen"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
