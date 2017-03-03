#!/usr/bin/env node
/* eslint no-process-exit: off, no-console: off*/
// Tool to merge all clover xmls to one and add additional info like complexity and non comment line of code

var fs = require("fs"),
	xml2js = require("xml2js"),
	parser = new xml2js.Parser(),
	builder = new xml2js.Builder();

function readCoverage(profile, callback) {
	fs.readFile(__dirname + "/../../report/test/" + profile + "/coverage/clover/clover.xml", "UTF-8", function (err, data) {
		if (err) {
			console.error(err);
		}
		parser.parseString(data, function (err, result) {
			var xml;

			if (err) {
				console.error(err);
			}
			callback(result);
		});
	});
}

readCoverage("mobile", function (mobileCoverage) {
	readCoverage("mobile_support", function (mobileSupportCoverage) {
		readCoverage("wearable", function (wearableCoverage) {
			var fullCoverage = mobileCoverage,
				xml = "",
				statements = 0,
				coveredstatements = 0,
				conditionals = 0,
				coveredconditionals = 0,
				methods = 0,
				coveredmethods = 0,
				files = 0;

			wearableCoverage.coverage.project[0].package[0].$.name = "wearable";
			mobileSupportCoverage.coverage.project[0].package[0].$.name = "mobile_support";
			fullCoverage.coverage.project[0].package[0].$.name = "mobile";
			fullCoverage.coverage.project[0].package = fullCoverage.coverage.project[0].package.concat(wearableCoverage.coverage.project[0].package)
				.concat(mobileSupportCoverage.coverage.project[0].package);

			fullCoverage.coverage.project[0].package.forEach(function (package) {
				statements += parseInt(package.metrics[0].$.statements, 10);
				coveredstatements += parseInt(package.metrics[0].$.coveredstatements, 10);
				conditionals += parseInt(package.metrics[0].$.conditionals, 10);
				coveredconditionals += parseInt(package.metrics[0].$.coveredconditionals, 10);
				methods += parseInt(package.metrics[0].$.methods, 10);
				coveredmethods += parseInt(package.metrics[0].$.coveredmethods, 10);
				files ++;
			});

			fullCoverage.coverage.project[0].metrics[0].$.statements = statements;
			fullCoverage.coverage.project[0].metrics[0].$.coveredstatements = coveredstatements;
			fullCoverage.coverage.project[0].metrics[0].$.conditionals = conditionals;
			fullCoverage.coverage.project[0].metrics[0].$.coveredconditionals = coveredconditionals;
			fullCoverage.coverage.project[0].metrics[0].$.methods = methods;
			fullCoverage.coverage.project[0].metrics[0].$.coveredmethods = coveredmethods;
			fullCoverage.coverage.project[0].metrics[0].$.files = files;

			xml = builder.buildObject(fullCoverage);
			fs.mkdir(__dirname + "/../../report/test/all", function () {
				fs.mkdir(__dirname + "/../../report/test/all/coverage", function () {
					fs.mkdir(__dirname + "/../../report/test/all/coverage/clover", function () {
						fs.writeFile(__dirname + "/../../report/test/all/coverage/clover/clover.xml", xml);
					});
				});
			});
		});
	});
});