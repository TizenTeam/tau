/*jslint nomen: true, plusplus: true */
/*global module, require */
var path = require("path"),
	buildAnalysis = require("rjs-build-analysis");

module.exports = function (grunt) {
	"use strict";

	function getLastChangedFiles(callback, error) {
		if (!error) {
			grunt.util.spawn({
				// The command to execute. It should be in the system path.
				cmd: "git",
				// An array of arguments to pass to the command.
				args: ["diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"]
			}, function (error, result) {
				callback(result.stdout);
			});
		} else {
			grunt.log.error("Error getting hash");
		}
	}

	grunt.registerTask("commit-check", "Check rules before push commit (called after create commit)", function () {
		var done = this.async();

		getLastChangedFiles(function (filesStr) {
			var files = filesStr.split("\n"),
				requireFiles,
				subtasks = [
					"jshint:commit"
				];

			files = files.map(function (file) {
				// remove "tau/" prefix
				return file.substr(4);
			}).filter(function (file) {
				// delete files from libs directory
				return file.indexOf("libs") !== 0;
			}).filter(function (file) {
				// take only js files
				return file.indexOf(".js") > 0;
			});
			// configure jshit subtask
			grunt.config("jshint.commit", {
				options: {
					jshintrc: path.join("src", "js", ".jshintrc")
				},
				files: {
					src: files
				}
			});

			// filter only files from src directory for correct build require index
			// map filenames to require module names
			requireFiles = files.filter(function (file) {
				// take only files from src/js directory
				return file.indexOf("src/js") === 0;
			}).map(function (file) {
				return file.replace("src/js/", "").replace(".js", "");
			});

			files.forEach(function (file) {
				grunt.log.ok(file);
			});

			if (requireFiles.length) {
				// add modules used in tests
				requireFiles.push("core/event");
				// set options for requirejs
				grunt.config("requirejs.unit_test.options.include", requireFiles);
				grunt.config("requirejs.unit_test.options.done", function (done, output) {
					var result = buildAnalysis.parse(output),
						testModules = [],
						jsAddTests = ["api"];

					// build list of test files
					if (result && result.bundles.length > 0) {
						[].slice.call(result.bundles[0].children).forEach(function (modulePath) {
							var testDirectory = path.relative("src/", modulePath).replace(/(\.js)+/gi, ""),
								mainTestPattern = path.join("tests", testDirectory, "*.html"),
								files = grunt.file.expand(mainTestPattern);

							if (!files.length) {
								// error when not exists any test fo module
								grunt.fail.fatal("Tests don't exist for module ", testDirectory);
							}
							testModules.push(mainTestPattern);
							//add additional tests
							jsAddTests.forEach(function (oneDirectory) {
								testModules.push(path.join("tests", testDirectory, oneDirectory, "*.html"));
							});
						});
					}
					//set list of test files to qunit module
					grunt.config.set("qunit.unit", testModules);
					done();
				});

				// set options to mesure coverage
				// readable coverage report is in directory report/html/unit/
				grunt.config.set("qunit.options.coverage", {
					src: "tests/libs/dist/js/tau.js",
					htmlReport: "report/html/unit/",
					instrumentedFiles: "temp/"
				});

				// setup task to copy built tau to test directory
				grunt.config.set("copy.unit", {
					files: [
						{
							expand: true,
							cwd: "dist/unit",
							src: "tau.js",
							dest: path.join("tests", "libs", "dist", "js")
						}
					]
				});

				// setup task to run
				subtasks.push("requirejs:unit_test");
				subtasks.push("copy:unit");
				subtasks.push("qunit:unit");
				subtasks.push("docs-html:unit");
				subtasks.push("qunit:unit-docs");
			}

			// run all subtask
			grunt.task.run(subtasks);
			done();
		});
	});

};