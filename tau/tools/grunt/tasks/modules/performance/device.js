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
			alreadyInstalled = [],
			count = 0;

		function DevicePerformanceTester() {
			var self = this;

			this.storage = {};
			this.queue = [];
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

		function runAndGetResults(tester, tempFile, applicationId) {
			alreadyInstalled.push(applicationId);

			tizen.run(applicationId, function () {
				tizen.pull("/opt/usr/media/Documents/tauperf_result.json", null, true, function (target, targetName, fileContent, localPath) {

					if (tester.queue.length >= 1) {
						// Separate results
						fileContent += ",";
					} else if (tester.queue.length === 0) {
						// Append "]" as array end to the final file
						fileContent += "]";
					}

					fs.appendFileSync(tempFile, fileContent);
					fs.unlinkSync(localPath);

					grunt.verbose.or.write(".");
					count++;

					// @TODO cleanup before further running?
					tester.runQueue();
				});
			});
		}

		proto = new BaseTester();

		proto.runQueue = function () {
			var self = this,
				queue = this.queue,
				appToProcess = queue.pop(),
				lastApp = this.lastApp,
				doneCallback = this.doneCallback,
				tempFile = TEMP_PATH + path.sep + this.tempFilename,
				runDeviceTest;

			// Create temporary directory if it doesn't exist
			grunt.file.mkdir(TEMP_PATH);

			if (!this.initialized) {
				// Will run when ready
				this.runPending = true;
				return;
			}

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

				runDeviceTest = runAndGetResults.bind(null, self, tempFile);

				// Prevent installing application on every run
				if (alreadyInstalled.indexOf(appToProcess.id) > -1) {
					runDeviceTest(appToProcess.id);
				} else {
					tizen.install(appToProcess.wgtPath, runDeviceTest);
				}

			} else {
				self.addDataList(grunt.file.readJSON(tempFile));

				grunt.log.ok();
				grunt.log.ok("[" + count + "] tests runned");
				alreadyInstalled.length = 0;

				// End of queue
				//prepareReport();
				doneCallback(errorCount === 0);
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
