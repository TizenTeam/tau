/**
 * Tasks for framework testing
 *
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
	"use strict";

	var configProperty,
		path = require("path"),
		buildFrameworkPath = path.join("dist"),
		testConfig = {},
		profileName,
		prepareTestsList = function (profileName, done, output) {
			var result = require('rjs-build-analysis').parse(output),
				slice = [].slice,
				testModules = [],
				jsAddTests = ['api'];

			if (result && result.bundles.length > 0) {
				slice.call(result.bundles[0].children).forEach(function (modulePath) {
					testModules.push(path.join('tests', path.relative('src/', modulePath).replace(/(\.js)+/gi, ''), '*.html'));
					jsAddTests.forEach(function (oneDirectory) {
						testModules.push(path.join('tests', path.relative('src/', modulePath).replace(/(\.js)+/gi, ''), '/' + oneDirectory + '/*.html'));
					});
				});
				grunt.config('qunit.main-'+ profileName, testModules);
			}
			done();
		};

	testConfig = {
		wearable: {
			"qunit-main": true
		},
		mobile: {
			"qunit-main": true
		},
		jqm: {
			"qunit-main": false
		}
	};
	grunt.config("test", testConfig);

	// Update config for task; copy
	configProperty = grunt.config.get("copy");
	configProperty["test-libs-wearable"] = { files: [
		{expand: true, cwd: path.join(buildFrameworkPath, "js", "wearable/"), src: "**", dest: path.join("tests", "libs", "dist", "js")},
		{expand: true, cwd: path.join(buildFrameworkPath, "theme", "wearable/"), src: "**", dest: path.join("tests", "libs", "dist", "theme")}
	]};
	configProperty["test-libs-mobile"] = { files: [
		{expand: true, cwd: path.join(buildFrameworkPath, "js", "mobile/"), src: "**", dest: path.join("tests", "libs", "dist", "js")},
		{expand: true, cwd: path.join(buildFrameworkPath, "theme", "mobile/"), src: "**", dest: path.join("tests", "libs", "dist", "theme")}
	]};
	configProperty["test-libs-jqm"] = configProperty["test-libs-mobile"];
	grunt.config.set("copy", configProperty);

	// Update config for task; concat
	configProperty = grunt.config.get("concat");
	configProperty["ej-namespace"] = {
		src: [path.join("tests", "libs", "dist", "js", "tau.js"), path.join("tests", "libs", "namespace.js")],
		dest: path.join("tests", "libs", "dist", "js", "tau.js")
	};
	grunt.config.set("concat", configProperty);

	// Update config for task; clean
	configProperty = grunt.config.get("clean");
	configProperty["test-libs"] = {
		src: [path.join("tests", "libs", "dist")]
	};
	grunt.config.set("clean", configProperty);

	// Update config for task; qunit
	configProperty = grunt.config.get("qunit");
	configProperty["jqm"] = [ "tests/js/**/jqm/*.html" ];
	grunt.config.set("qunit", configProperty);

	// Inject require done callback
	configProperty = grunt.config.get("requirejs");

	for (profileName in testConfig) {
		if (testConfig.hasOwnProperty(profileName) && testConfig[profileName]["qunit-main"]) {
			configProperty[profileName].options.done = prepareTestsList.bind(null, profileName);
		}
	}
	grunt.config.set("requirejs", configProperty);

	grunt.loadNpmTasks( "grunt-contrib-qunit" );

	function testProfile(profile) {
		var taskConf = grunt.config.get("test"),
			qunitConf = grunt.config.get("qunit"),
			options = taskConf[profile];

		if (options) {

			// Clean test libs
			grunt.task.run("clean:test-libs");

			// Copying only the profile which is needed for current test
			grunt.task.run("copy:test-libs-" + profile);

			// Inject EJ's namespace fix
			grunt.task.run("concat:ej-namespace");

			// Run qunit main tests. This tests are generated by qunitPrepare in main grunt file
			if (options["qunit-main"] === true) {
				grunt.task.run("qunit:main-" + profile);
			}

			// Run qunit jqm widget profile tests if there are some
			if (qunitConf[profile] && qunitConf[profile].length > 0) {
				grunt.task.run("qunit:" + profile.toLowerCase());
			}
		} else {
			grunt.log.error("There is no configuration for profile " + profile);
		}
	}

	grunt.registerTask("test", function (profile) {
		var tmpProfile;

		//would be better to maintain separate build for tests purposes
		grunt.task.run("release");

		if (profile) {
			testProfile(profile);
		} else {
			for (tmpProfile in testConfig) {
				if (testConfig.hasOwnProperty(tmpProfile)) {
					testProfile(tmpProfile);
				}
			}
		}
	});

};