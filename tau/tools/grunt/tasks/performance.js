/*global module, console, require, __dirname */
(function () {
	"use strict";
	var TEST_COUNT = 5,
		RESULT_PRECISION = 3;

	module.exports = function (grunt) {

		var //statistics = require("math-statistics"),
			Stats = require("fast-stats").Stats,
			CliTable = require("cli-table"),
			path = require("path"),
			PhantomTester = require(path.join(__dirname, "modules", "performance", "phantom")),
			DeviceTester = require(path.join(__dirname,  "modules", "performance", "device"));

		function preparePerformanceReport(storage) {
			var sectionNames = Object.keys(storage),
				section,
				stepValues,
				stepNames,
				table = new CliTable({
					head: ["[Section/Step]", "[Median]", "[Avg]", "[StdDev]"]
					, colWidths: [60, 20, 20, 20]
				});

			grunt.log.writeln("=============================================================================================================================");
			grunt.log.writeln("| PERFORMANCE REPORT                                                                                                        |");
			grunt.log.writeln("| Note: Shows time between section start and following steps                                                                |");
			grunt.log.writeln("=============================================================================================================================");

			sectionNames.forEach(function (sectionName) {
				var startStats;

				section = storage[sectionName];
				startStats = new Stats().push(section.start);

				table.push([sectionName + " (start time)", startStats.amean().toFixed(RESULT_PRECISION) + 'ms', startStats.median().toFixed(RESULT_PRECISION) + 'ms', startStats.stddev().toFixed(RESULT_PRECISION) + 'ms']);

				stepNames = Object.keys(storage[sectionName].steps);
				stepNames.map(function (stepName) {
					var stats = new Stats().push(section.steps[stepName]);
					//stepValues = section.steps[stepName];
					table.push([" \\_ " + stepName, "+" + stats.amean().toFixed(RESULT_PRECISION) + "ms", "+" + stats.median().toFixed(RESULT_PRECISION) + "ms", stats.stddev().toFixed(RESULT_PRECISION) + "ms"]);
				});

			});

			grunt.log.write(table.toString());
		}

		grunt.registerTask('performance', '', function () {
			var currentTask = this,
				//queue = [],
				testApps = [
					{
						name: "Mobile Winset",
						path: "demos/SDK/MobileWinset/src/index.html",
						wgtPath: "demos/SDK/MobileWinset/MobileWinset.wgt",
						id: "vUf39tzQ3s.Winset"
					}
				],
				noBuild = grunt.option('no-build'),
				done = this.async(),
				tester;

			if (currentTask.flags.device) {
				tester = new DeviceTester();
			} else {
				tester = new PhantomTester();
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
						preparePerformanceReport(tester.getRawResults());
						done();
					});
				}
			}

			//
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
