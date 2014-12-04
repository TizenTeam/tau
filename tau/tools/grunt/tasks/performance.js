/*global module, console, require, __dirname */
(function () {
	"use strict";
	var TEST_COUNT = 100;

	module.exports = function (grunt) {

		var statistics = require("math-statistics"),
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
					head: ["[Section/Step]", "[Median]", "[Avg]"]
					, colWidths: [80, 20, 20]
				});

			grunt.log.writeln("============================================================================================================================");
			grunt.log.writeln("| PERFORMANCE REPORT                                                                                                       |");
			grunt.log.writeln("| Note: Shows time between section start and following steps                                                               |");
			grunt.log.writeln("============================================================================================================================");
//			grunt.log.writeln("  [Section/Step]  -  [Median]  -  [Avg] \n");

			sectionNames.forEach(function (sectionName) {
				section = storage[sectionName];
				//grunt.log.writeln("  " + sectionName + "     ");
				table.push([sectionName, '', '']);

				stepNames = Object.keys(storage[sectionName].steps);
				stepNames.map(function (stepName) {
					stepValues = section.steps[stepName];
					table.push([" \\_ " + stepName, statistics.median(stepValues).toFixed(3) + "ms", statistics.mean(stepValues).toFixed(3) + "ms"]);
				});

			});

			grunt.log.write(table.toString());
		}

		grunt.registerTask('performance', '', function () {
			var currentTask = this,
				target = currentTask.target,
				//queue = [],
				testApps = [
					{
						name: "Mobile Winset",
						path: "demos/SDK/MobileWinset/src/index.html"
					}
				],
				noBuild = grunt.option('no-build'),
				//dataStorage = {},
				//parseData = parsePerformanceData.bind(this, dataStorage),
				//prepareReport = preparePerformanceReport.bind(this, dataStorage),
				done = this.async(),
				tester;

			if (target === "device") {
				tester = new DeviceTester();
			} else {
				tester = new PhantomTester();
			}

			function collectTests(err, res, code) {
				var currentApp,
					testIndex,
					i;

				if (err) {
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

		//grunt.registerTask("test-performance", [ "performance:mobile" ]);
	};
}());

// Parser <- PhantomParser
// Parser <- DeviceParser

// .addTests
// .run
// .addData
// .getRawResults
