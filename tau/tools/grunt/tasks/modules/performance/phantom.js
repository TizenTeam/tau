/*global module, console, require, __dirname */
(function () {
	"use strict";
	module.exports = (function () {
		var proto,
			path = require("path"),
			grunt = require("grunt"),
			BaseTester = require(path.join(__dirname, "base")),
			phantomjs = require('grunt-lib-phantomjs').init(grunt),
			// Get an asset file, local to the root of the project.
			asset = path.join.bind(null, __dirname, '..', '..', '..', '..', '..'),
			errorCount = 0;

		function initPhantom() {
			var self = this,
				runQueue = self.runQueue.bind(self);

			phantomjs.on('console', grunt.verbose.writeln.bind(grunt.verbose));

			// Create some kind of "all done" event.
			phantomjs.on('performance', function (data) {

				self.addData(data);

				if (data.type === 'performance.done') {
					phantomjs.halt();
					setTimeout(runQueue, 0);
				}
			});

			// Built-in error handlers.
			phantomjs.on('fail.load', function (url) {
				phantomjs.halt();
				grunt.warn('PhantomJS unable to load URL (' + url + ').');
			});

			phantomjs.on('fail.timeout', function () {
				phantomjs.halt();
				grunt.warn('PhantomJS timed out.');
			});

			phantomjs.on("onUrlChanged", function (url) {
				grunt.log.debug("[Phantom script] URL changed to" + url);
			});

			phantomjs.on("inject", function (paths) {
				grunt.log.debug("[Phantom script] inject: " + paths);
			});

			phantomjs.on("error.onError", function (msg, trace) {
				grunt.log.writeln();
				grunt.log.error(msg);
				console.dir(trace);

				phantomjs.halt();
			});
		}

		function PhantomPerformanceTester() {
			this.storage = {};
			this.queue = [];
			this.lastApp = null;

			this.initPhantom();

			errorCount = 0;
		}

		proto = new BaseTester();

		proto.runQueue = function () {
			var queue = this.queue,
				appToProcess = queue.pop(),
				lastApp = this.lastApp,
				doneCallback = this.doneCallback;

			if (appToProcess) {
				if (appToProcess.name !== lastApp) {

					// Write ok on the last line if we are in the middle of tests
					if (lastApp) {
						grunt.verbose.ok();
					}
					lastApp = appToProcess.name;
					grunt.verbose.write("Testing [" + appToProcess.name + "] ");
				}
				// Spawn phantomjs
				phantomjs.spawn(appToProcess.path, {
					// Additional PhantomJS options.
					options: {
						screenshot: false,
						inject: [ asset("../tools/builder/lib/builder/phantom.fix.js") ],
						phantomScript: asset("tools/phantom/performance.js")
					},

					// Complete the task when done.
					done: function () {
						grunt.log.write(".");
					}
				});
			} else {
				grunt.log.ok();

				// End of queue
				//prepareReport();
				doneCallback(errorCount === 0);
			}
		};

		proto.addData = function (data) {
			var storage = this.storage;

			console.log(data);

			switch (data.type) {
				case "performance.data.start":
					if (!storage[data.section]) {
						storage[data.section] = {
							start: [data.stepTime],
							steps: {}
						};
					} else {
						storage[data.section].start.push(data.stepTime);
					}
					break;

				case "performance.data":
					if (!storage[data.section].steps[data.stepName]){
						storage[data.section].steps[data.stepName] = [];
					}

					storage[data.section].steps[data.stepName].push(parseFloat(data.stepDuration));
					break;
			}
		};

		proto.initPhantom = initPhantom;

		PhantomPerformanceTester.prototype = proto;

		return PhantomPerformanceTester;
	}());
}());
