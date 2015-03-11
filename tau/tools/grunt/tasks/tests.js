/**
 * Tasks for framework testing
 *
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
	"use strict";

	var configProperty,
		path = require("path"),
		buildFrameworkPath = path.join("dist"),
		testConfig = {},
		prepareForRunner = false,
		prepareTestsList = function (profileName, done, output) {
			var result = require('rjs-build-analysis').parse(output),
				slice = [].slice,
				testModules = [],
				jsAddTests = grunt.option('js_add_test') ? grunt.option('js_add_test').split(",") : ["api", profileName],
				singleTest = grunt.option('single_test') ? grunt.option('single_test') : '';

			if (profileName === "mobile") {
				jsAddTests.push("jquery");
			}

			if (result && result.bundles.length > 0 && singleTest === '') {
				slice.call(result.bundles[0].children).forEach(function (modulePath) {
					var testDirectory = path.relative('src/', modulePath).replace(/(\.js)+/gi, ''),
						mainTestPattern = path.join('tests', testDirectory, '*.html'),
						files = grunt.file.expand(mainTestPattern);
					if (files.length) {
						grunt.log.ok("Tests exist for module ", testDirectory);
					} else {
						grunt.log.warn("Tests don't exist for module ", testDirectory);
					}

					// Skip Date time picker tests
					if (mainTestPattern.indexOf('Datetimepicker') < 0) {
						testModules.push(mainTestPattern);
						jsAddTests.forEach(function (oneDirectory) {
							testModules.push(path.join('tests', testDirectory, '/' + oneDirectory + '/*.html'));
						});
					}
				});
				grunt.config('qunit.main-'+ profileName, testModules);
                                grunt.config("qunit-tap.main-"+ profileName, {output: path.join("report/tap/" , profileName , "/")});
			} else if (singleTest !== '') {
				testModules.push(singleTest);
				grunt.config('qunit.main-'+ profileName, testModules);
			}
			done();
		};

	testConfig = {
		wearable: {
			"qunit-main": true,
			default: true
		},
		mobile: {
			"qunit-main": true,
			default: true
		},
		tv: {
			"qunit-main": true,
			default: true
		},
		jqm: {
			"qunit-main": false,
			default: true
		},
		jqm13: {
			"qunit-main": false,
			default: false
		},
		jqm14: {
			"qunit-main": false,
			default: false
		},
		jqm14ok: {
			"qunit-main": false,
			default: true
		},
		webui: {
			"qunit-main": false,
			default: false
		}
	};
	grunt.config("test", testConfig);

	// Update config for task; copy
	configProperty = grunt.config.get("copy");
	configProperty["test-libs-wearable"] = { files: [
		{expand: true, cwd: path.join(buildFrameworkPath, "wearable", "js/"), src: "**", dest: path.join("tests", "libs", "dist", "js")},
		{expand: true, cwd: path.join(buildFrameworkPath, "wearable", "theme/"), src: "**", dest: path.join("tests", "libs", "dist", "theme")}
	]};
	configProperty["test-libs-mobile"] = { files: [
		{expand: true, cwd: path.join(buildFrameworkPath, "mobile", "js/"), src: "**", dest: path.join("tests", "libs", "dist", "js")},
		{expand: true, cwd: path.join(buildFrameworkPath, "mobile", "theme/"), src: "**", dest: path.join("tests", "libs", "dist", "theme")}
	]};
	configProperty["test-libs-tv"] = { files: [
		{expand: true, cwd: path.join(buildFrameworkPath, "tv", "js/"), src: "**", dest: path.join("tests", "libs", "dist", "js")},
		{expand: true, cwd: path.join(buildFrameworkPath, "tv", "theme/"), src: "**", dest: path.join("tests", "libs", "dist", "theme")}
	]};
	configProperty["test-libs-jqm"] = configProperty["test-libs-mobile"];
	configProperty["test-libs-jqm13"] = configProperty["test-libs-mobile"];
	configProperty["test-libs-jqm14"] = configProperty["test-libs-mobile"];
	configProperty["test-libs-webui"] = configProperty["test-libs-mobile"];
	configProperty["test-libs-jqm14ok"] = configProperty["test-libs-mobile"];
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
	configProperty["jqm13"] = [ "tests/js/**/jqm1.3/*.html" ];
	configProperty["jqm14"] = [ "tests/js/**/jqm1.4/*.html" ];
	configProperty["jqm14ok"] = [ "tests/js/**/jqm1.4ok/*.html" ];
	configProperty["webui"] = [ "tests/js/**/webui/*.html" ];
	grunt.config.set("qunit", configProperty);

	//grunt.loadNpmTasks( "grunt-contrib-qunit" );
	grunt.loadNpmTasks( "grunt-qunit-tap" );
	grunt.loadNpmTasks( "grunt-qunit-istanbul" );

	function testProfile(profile, prepareOnly) {
		var taskConf = grunt.config.get("test"),
			qunitConf = grunt.config.get("qunit"),
			options = taskConf[profile];

		if (prepareOnly) {
			grunt.task.run("prepare-runner:" + profile);
		}

		if (options) {

			// Clean test libs
			grunt.task.run("clean:test-libs");

			// Copying only the profile which is needed for current test
			grunt.task.run("copy:test-libs-" + profile);

			// Inject EJ's namespace fix
			grunt.task.run("concat:ej-namespace");

			if (!prepareOnly) {
				grunt.task.run("set-profile:" + profile);
				// Run qunit main tests. This tests are generated by qunitPrepare in main grunt file
				if (options["qunit-main"] === true) {
					grunt.task.run("qunit-tap:main-" + profile);
				}

				// Run qunit jqm widget profile tests if there are some
				if (qunitConf[profile] && qunitConf[profile].length > 0) {
					grunt.task.run("qunit:" + profile.toLowerCase());
				}
			} else {
				grunt.task.run("prepare-runner:" + profile);
			}
		} else {
			grunt.log.error("There is no configuration for profile " + profile);
		}
	}

	grunt.registerTask("set-profile", function (profile) {
		grunt.event.emit("qunit.profile", profile);
	});


	var description = "Run tests. \n" +
		"This task allows params:\n" +
		"<profile> [default:all]\n" +
		"options:\n" +
		"--single_test : determines single test to run\n" +
		"example:\n" +
		'"grunt test:mobie --single_test=/path/test.html"';

	grunt.registerTask("test", description, function (profile) {
		var profileName;

		// Inject require done callback
		configProperty = grunt.config.get("requirejs");

		for (profileName in testConfig) {
			if (testConfig.hasOwnProperty(profileName) && testConfig[profileName]["qunit-main"]) {
				configProperty[profileName].options.done = prepareTestsList.bind(null, profileName);
			}
		}
		grunt.config.set("requirejs", configProperty);

		//would be better to maintain separate build for tests purposes
		grunt.task.run("build");

		if (profile) {
			grunt.config.set("qunit.options.coverage.src", "tests/libs/dist/js/tau.js");
			grunt.config.set("qunit.options.coverage.coberturaReport", "report/coverage/" + profile +"/");
			grunt.config.set("qunit.options.coverage.instrumentedFiles", "temp/");
			testProfile(profile, prepareForRunner);
		} else {
			for (profileName in testConfig) {
				if (testConfig.hasOwnProperty(profileName) && testConfig[profileName].default) {
					testProfile(profileName);
				}
			}
		}
	});

	grunt.registerTask("test-runner-prepare", function (profile) {
		// Set prepare test list for runner flag
		prepareForRunner = true;

		// Encapsulate this task
		grunt.registerTask("prepare-runner", function (profile) {
			var opt = {
					filter: 'isFile'
				},
				src = grunt.config.get('qunit.main-'+ profile),
				filePaths;

			if (src) {
				grunt.log.ok("Write " + profile + " test list to tests/tests.js");
				filePaths = grunt.file.expand(opt, src);
				grunt.file.write("tests/tau-runner/tests.js",
								"var TESTS = " + JSON.stringify(filePaths) +
										";\n" +
										"var CURRENT_ITERATION = 0; " +
										"\n" +
										"var TESTS_PER_ITERATION = 15;"
								);
			} else {
				grunt.log.error("Couldn't find configuration for profile: " + profile);
				return false;
			}
		});

		// Run test module
		grunt.task.run("test:" + profile);
	});

	grunt.registerTask('qunit-report',
		'Generate QUnit report', function () {
			var options = this.options({
				dest: '_build/test-reports',
				namer: function (url) {
					return path.basename(url).replace(/\.html$/, '');
				}
			}),
				modules = {},
				file = "report/test.txt",
				module = "",
				test = "",
				report = "",
				url,
				currentProfile,
				errors = 0,
				id = 0;
			grunt.event.on('qunit.moduleStart', function (name) {
				module = name;
				if (url.indexOf("tests/js/" + name)!==0) {
					grunt.log.error("Wrong module name in ", url, name, " should be changed");
					errors++;
					if (errors > 30) {
						exit();
					}
				}
			});
			grunt.event.on('qunit.spawn', function (details) {
				url = details;
				module = "";
			});
			grunt.event.on('qunit.profile', function (details) {
				currentProfile = details;
			});
			grunt.event.on('qunit.testStart', function (name) {
				if (!module && test != name) {
					grunt.log.error(url, " ! ");
					errors++;
				}
				test = name;
			});
			grunt.event.on('qunit.log', function (result, actual, expected, rawMessage, source) {
				if (typeof expected === "object") {
					expected = "[object]";
				}
				if (typeof actual === "object") {
					actual = "[object]";
				}
				if (expected instanceof Array) {
					expected = "[Array]";
				}
				if (actual instanceof Array) {
					actual = "[Array]";
				}
				expected = expected.split("\n").join(" ");
				actual = actual.split("\n").join(" ");
				var line  = test + "	" + currentProfile + "-" + id + "	" + rawMessage + "	" + "	" + expected +  "	" + actual + "	" + (result ? "PASS" : "FAIL");
				modules[module] = modules[module] || "";
				modules[module] += line + "\n";
				id++;
			});
			grunt.event.on('qunit.done', function (result, actual, expected, rawMessage, source) {
				var module, i;
				report = "";
				for (i in modules) {
					module = modules[i];
					report += "Module Name	" + i  + "\n";
					report += "Function Name	TestCase ID	Test Case Description	Input	Expected Result	Execution Result	Pass/Fail" + "\n";
					report += module;
					report += "\n\n";
				}
				grunt.file.write(file, report);
			});

		});
};
