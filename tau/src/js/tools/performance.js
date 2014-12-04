/*global define, ns, tizen */
(function (ns, tizen) {
	"use strict";

	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(function () {
		//>>excludeEnd("tauBuildExclude");

		window.tauPerf = {
			phantomRun: window.callPhantom && window._phantom,
			collect: function (type, section, step, stepTime) {
				if (this.phantomRun) {
					window.callPhantom({
						type: type,
						section: section,
						step: step,
						stepTime: stepTime
					});
				}
			},
			saveToFile: !!(tizen && tizen.filesystem),
			print: function () {
				if (!this.phantomRun) {
					console.log.apply(console, arguments);
				}
			},
			data: {},
			steps: {},
			start: function (section) {
				var text;

				this.data[section] = window.performance.now();
				this.steps[section] = [];

				text = "[TAU Perf][%c" + section + "%c][start] at %c" + this.data[section].toFixed(3);

				this.print(text, "color:blue", "color:inherit", "font-weight: bold");

				this.collect("performance.data.start", section, 'start', this.data[section].toFixed(3));
			},
			get: function (element, step) {
				var text,
					stepTime,
					timeNow = window.performance.now();

				if (this.data[element]) {
					stepTime = (timeNow - this.data[element]).toFixed(3);
					text = "[TAU Perf][%c" + element + "%c] %c+" + stepTime + "ms%c";

					if (step) {
						text += " | [Step] " + step;
						//rawText += " | [Step] " + step;
					} else {
						step = "Step" + this.steps[element].length;
					}

					this.steps[element].push({
						name: step,
						time: timeNow,
						duration: stepTime
					});

					this.print(text, "color:blue", "color:inherit", "font-weight: bold", "font-weight:normal");

					this.collect("performance.data", element, step, stepTime);

					return text;
				}
			},
			finish: function () {
				var self = this;

				if (self.saveToFile) {
					tizen.filesystem.resolve("documents", function (documents) {
						var resultFile;

						resultFile = documents.createFile("tauperf_test_" + (Date.now()) + ".json");

						if (resultFile !== null) {
							// Save reference to done
							self.start("performance.done");
							resultFile.openStream("rw", function (fs) {
								fs.write(JSON.stringify({
									data: self.data,
									steps: self.steps
								}));
								fs.close();
								tizen.application.getCurrentApplication().exit();
								//self.collect("performance.done");
							}, function (e) {
								console.log("Problem with opening file for writing " + e.message);
								//self.collect("performance.done");
							}, "UTF-8");
						}
					}, function(e) {
						console.error("Error: " + e.message);
						tizen.application.getCurrentApplication.exit();
					}, "rw");
				} else {
					self.collect("performance.done");
				}
			}
		};

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	});
	//>>excludeEnd("tauBuildExclude");

}(ns, window.tizen));
