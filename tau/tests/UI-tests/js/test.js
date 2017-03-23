/* global describe, beforeEach, waitsFor, it, runs, expect, imagediff, jasmine */
(function () {
	var testData = window.location.hash.substr(1).split("/"),
		profile = testData[0],
		jasmineEnv = jasmine.getEnv(),
		reporter = null,
		currentWindowOnload = window.onload;

	jasmineEnv.updateInterval = 1000;

	reporter = new jasmine.HtmlReporter();

	jasmineEnv.addReporter(reporter);

	jasmineEnv.specFilter = function (spec) {
		return reporter.specFilter(spec);
	};

	window.onload = function () {
		if (currentWindowOnload) {
			currentWindowOnload();
		}
		execJasmine();
	};

	function readTextFile(file, callback) {
		var rawFile = new XMLHttpRequest();

		rawFile.overrideMimeType("application/json");
		rawFile.open("GET", file, true);
		rawFile.onreadystatechange = function () {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
				callback(rawFile.responseText);
			}
		};
		rawFile.send(null);
	}

	function execJasmine() {
		readTextFile("app/" + profile + "/test.txt", function (testName) {
			readTextFile("app/" + profile + "/screenshots.json", function (text) {
				var tests = JSON.parse(text);

				if (testName) {
					tests = tests.filter(function (item) {
						return item.name === testName;
					});
				}
				describe("ImageTest", function () {

					// Matchers
					beforeEach(function () {
						this.addMatchers(imagediff.jasmine);
					});

					tests.forEach(function (testName) {
						it("should be the same image" + testName.name, function () {
							var a = new Image(),
								b = new Image();

							a.src = "images/" + profile + "/" + testName.name + ".png";
							b.src = "result/" + profile + "/" + testName.name + ".png";

							waitsFor(function () {
								return a.complete & b.complete;
							}, "image not loaded.", 200);

							runs(function () {
								var tolerance = a.width * a.height / 10000;

								expect(b).toImageDiffEqual(a, tolerance);
							});
						});
					});

				});
				jasmineEnv.execute();
			});
		});
	}

})();