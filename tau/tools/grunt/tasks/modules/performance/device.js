/*global module, console, require, __dirname */
(function () {
	"use strict";
	module.exports = (function () {
		var proto,
			fs = require("fs"),
			path = require("path"),
			grunt = require("grunt"),
			BaseTester = require(path.join(__dirname, "base")),
			tizen = require(path.join(__dirname, "..", "tizen")),
			errorCount = 0,
			TEMP_PATH = "tmp",
			alreadyInstalled = [];

		proto = new BaseTester();

		function DevicePerformanceTester() {
			var self = this;

			BaseTester.call(self);

			this.lastApp = null;
			this.initialized = false;
			this.runPending = false;
			this.tempFilename = "tester_" + (Date.now()) + ".json";

			tizen.init(null, function() {
				self.initialized = true;

				if (self.runPending) {
					self.runPending = false;

					self.runQueue();
				}
			});

			errorCount = 0;
		}

		function runAndGetResults(tester, tempFile, target, targetName, applicationId) {
			alreadyInstalled.push(applicationId);

			tizen.run(applicationId, null, null, function (exitedOnTarget, exitedOnTargetName, stoppedApplicationId) {
				tizen.pull("/opt/usr/media/Documents/tauperf_result.json", null, true, function (target, targetName, fileContent, localPath) {

					tester.queueProgress++;

					if (tester.queueLength - tester.queueProgress > 0) {
						// Separate results
						fileContent += ",";
					} else if (tester.queueProgress === tester.queueLength) {
						// Append "]" as array end to the final file
						fileContent += "]";
					}

					fs.appendFileSync(tempFile, fileContent);
					fs.unlinkSync(localPath);

					grunt.verbose.or.write(".");

					// Run if
					if (tester.queueProgress < tester.queueLength) {
						tester.runQueue(target, targetName);
					} else {
						tester.finishQueue();
					}

				}, function () {
					// pull fail
					grunt.log.error("Pull fail ", arguments);
				}, exitedOnTarget, exitedOnTargetName);
			}, target, targetName);
		}

		proto.finishQueue = function () {
			var tempFile = TEMP_PATH + path.sep + this.tempFilename;

			this.addDataList(grunt.file.readJSON(tempFile));

			grunt.log.ok();
			grunt.log.ok("[" + this.queueProgress + "] tests runned");

			alreadyInstalled.length = 0;

			this.doneCallback(errorCount === 0);
		};

		proto.runQueue = function (target, targetName) {
			var self = this,
				queue = this.queue,
				appToProcess,
				lastApp = self.lastApp,
				tempFile = TEMP_PATH + path.sep + self.tempFilename,
				runDeviceTest;

			if (!self.initialized) {
				// Will run when ready
				self.runPending = true;
				return;
			}

			// Create temporary directory if it doesn't exist
			grunt.file.mkdir(TEMP_PATH);

			appToProcess = queue.pop();

			if (appToProcess) {
				if (lastApp === null) {
					// Prepend "[" as array start to the final file
					fs.writeFileSync(tempFile, "[");
				}

				if (appToProcess.name !== lastApp) {
					// Write ok on the last line if we are in the middle of tests
					if (lastApp) {
						grunt.verbose.ok();
					}
					this.lastApp = appToProcess.name;
					grunt.verbose.writeln("Testing [" + appToProcess.name + "] ");
				}

				runDeviceTest = runAndGetResults.bind(null, self, tempFile, target, targetName, appToProcess.id);

				// Prevent installing application on every run
				if (alreadyInstalled.indexOf(appToProcess.id) > -1) {
					runDeviceTest();
				} else {
					tizen.install(appToProcess.wgtPath, runDeviceTest);
				}
			} else {
				grunt.log.error("Unexpected empty element on queue " + appToProcess + self.queueProgress + "/" + self.queueLength);
			}
		};

		proto.addData = function (jsonData) {
			var storage = this.storage,
				data = jsonData.data,
				steps = jsonData.steps,
				sectionNames = Object.keys(data);

			sectionNames.forEach(function (sectionName) {
				if (!storage[sectionName]) {
					storage[sectionName] = {
						start: [],
						steps: {}
					};
				}

				storage[sectionName].start.push(data[sectionName]);
				steps[sectionName].forEach(function (step) {
					if (!storage[sectionName].steps[step.name]) {
						storage[sectionName].steps[step.name] = [];
					}

					storage[sectionName].steps[step.name].push(parseFloat(step.duration));
				});

			});
		};

		proto.addDataList = function (jsonData) {
			var addData = this.addData.bind(this);

			if (jsonData.length > 0) {
				jsonData.forEach(addData);
			}
		};

		DevicePerformanceTester.prototype = proto;

		return DevicePerformanceTester;
	}());
}());
