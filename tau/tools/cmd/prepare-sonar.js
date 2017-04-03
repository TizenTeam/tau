#!/usr/bin/env node
/* eslint no-process-exit: off, no-console: off*/

var cmd = require("./lib/cmd"),
	fs = require("fs"),
	properties = "",
	propertiesObject = {},
	package = require("../../package.json"),
	mode = process.argv[2] === "refs/changes/xx/xxxxxx/x" ? "git" : "gerrit";

propertiesObject.projectName = "TAU - Gerrit";
propertiesObject.projectKey = "TAUG";
if (mode === "gerrit") {
	propertiesObject["leak.period"] = package.version;
} else {
	propertiesObject.projectVersion = package.version;
}

cmd.chain(
	// get commit id of last commit
	["git rev-list --max-count=1 HEAD",
		function (result, callback) {
			callback();
		}],
	["git log --format=%B -n 1", function (result, callback) {
		var regexData = result.match(/OAPTAU-[0-9]+/);

		if (mode === "gerrit") {
			propertiesObject.projectVersion = regexData[0];
		}
		callback();
	}], function (cb) {
		Object.keys(propertiesObject).forEach(function (key) {
			properties += "\nsonar." + key + "=" + propertiesObject[key];
		});
		cb();
	},
	function (cb) {
		fs.appendFile("sonar-project.properties", properties, function (err) {
			if (err) {
				throw err;
			}
			cb();
		});
	}
)
;