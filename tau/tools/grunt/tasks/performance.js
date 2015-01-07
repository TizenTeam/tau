/*global module, console, require, __dirname */
(function () {
	"use strict";
	var TEST_COUNT = 100,
		RESULT_PRECISION = 3;

	module.exports = function (grunt) {

		var Stats = require("fast-stats").Stats,
			CliTable = require("cli-table"),
			path = require("path"),
			PhantomTester = require(path.join(__dirname, "modules", "performance", "phantom")),
			DeviceTester = require(path.join(__dirname,  "modules", "performance", "device"));

		function preparePerformanceReport(storage) {
			var sectionNames = Object.keys(storage),
				section,
				stepNames,
				table = new CliTable({
					head: ["[Section/Step]", "[Median]", "[Avg]", "[StdDev]"],
					colWidths: [60, 20, 20, 20]
				});

			grunt.log.writeln("=============================================================================================================================");
			grunt.log.writeln(" PERFORMANCE REPORT ");
			grunt.log.writeln(" Note: Shows time between section start and following steps ");
			grunt.log.writeln("=============================================================================================================================");

			sectionNames.forEach(function (sectionName) {
				var startStats;

				section = storage[sectionName];
				startStats = new Stats().push(section.start);

				table.push([
					sectionName + " (start time)",
					startStats.amean().toFixed(RESULT_PRECISION) + 'ms',
					startStats.median().toFixed(RESULT_PRECISION) + 'ms',
					startStats.stddev().toFixed(RESULT_PRECISION) + 'ms'
				]);

				stepNames = Object.keys(storage[sectionName].steps);
				stepNames.map(function (stepName) {
					var stats = new Stats().push(section.steps[stepName]);

					table.push([
						" \\_ " + stepName,
						"+" + stats.amean().toFixed(RESULT_PRECISION) + "ms",
						"+" + stats.median().toFixed(RESULT_PRECISION) + "ms",
						stats.stddev().toFixed(RESULT_PRECISION) + "ms"
					]);
				});

			});

			grunt.log.write(table.toString());
		}

		function saveToFile(filePath, output) {
			var pathParts = filePath.split(path.sep),
				filename = pathParts.pop();

			grunt.file.mkdir(pathParts.join(path.sep));

			if (grunt.file.write(filePath, JSON.stringify(output))) {
				grunt.log.ok("Output was saved to " + filePath);
			}
		}

		grunt.registerTask('performance', '', function () {
			var currentTask = this,
				testApps = [
					{
						name: "Mobile Winset",
						// REQUIRED for Phantom tests
						path: "demos/SDK/MobileWinset/src/index.html",
						// REQUIRED for device tests
						wgtPath: "demos/SDK/MobileWinset/MobileWinset.wgt",
						// REQUIRED for device tests
						id: "vUf39tzQ3s.Winset"
					}
				],
				noBuild = grunt.option('no-build'),
				inputFile = grunt.option('input-file') || null,
				outputFile = grunt.option('output-file') || null,
				done = this.async(),
				tester;

			if (currentTask.flags.device) {
				tester = new DeviceTester();
			} else {
				tester = new PhantomTester();
			}

			// Read input test apps
			if (inputFile) {
				testApps = grunt.file.readJSON(inputFile);
			}

			function collectTests(err, res, code) {
				var currentApp,
					testIndex,
					i;

				if (err) {
					grunt.verbose.error(err);
					done(err);
				} else {
					if (!noBuild) {
						grunt.log.ok();
					}

					// Performance tests for every requested profile
					for (i = 0; i < testApps.length; i++) {
						currentApp = testApps[i];

						grunt.log.writeln("Collecting performance tests for [" + currentApp.name + "]");

						for (testIndex = 0; testIndex < TEST_COUNT; testIndex++) {
							tester.addTest(currentApp);
						}
					}

					grunt.log.write("Running tests: ");
					grunt.log.writeln(TEST_COUNT * testApps.length);

					tester.run(function () {
						var results = tester.getRawResults();

						preparePerformanceReport(results);

						if (outputFile) {
							saveToFile(outputFile, results);
						}

						done();
					});
				}
			}

			if (!noBuild) {
				grunt.log.write("Running 'grunt build' task with performance flag...");
				grunt.util.spawn({
					grunt: true,
					args: ['build', '--tau-performance=true']
				}, collectTests);
			} else {
				collectTests(null, "", 0);
			}
		});
	};
}());
