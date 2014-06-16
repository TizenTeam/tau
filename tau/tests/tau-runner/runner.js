/*global $, document, window, QUnit, ok, TESTS */
$(document).ready(function () {
	"use strict";

	var Runner = function () {
		var self = this;

		$.extend(self, {
			frame: window.frames.testFrame,

			testTimeout: 3 * 60 * 1000,

			$frameElem: $("#testFrame"),

			assertionResultPrefix: "assertion result for test:",

			onTimeout: QUnit.start,

			onFrameLoad: function (event) {
				event.target.removeEventListener("load", self.onFrameLoad);
				// establish a timeout for a given suite in case of async tests hanging
				self.testTimer = setTimeout(self.onTimeout, self.testTimeout);

				// it might be a redirect with query params for push state
				// tests skip this call and expect another
				if (!self.frame.QUnit) {
					self.$frameElem.one("load", self.onFrameLoad);
					return;
				}

				// when the QUnit object reports done in the iframe
				// run the onFrameDone method
				self.frame.QUnit.done = self.onFrameDone;
				self.frame.QUnit.testDone = self.onTestDone;
			},

			onTestDone: function (result) {
				QUnit.ok(!(result.failed > 0), result.name);
				self.recordAssertions(result.total - result.failed, result.name);
			},

			onFrameDone: function () {
				// make sure we don't time out the tests
				clearTimeout(self.testTimer);

				// clear the done call to prevent early completion of other test cases
				self.frame.QUnit.done = $.noop;
				self.frame.QUnit.testDone = $.noop;

				// hide the extra assertions made to propogate the count
				// to the suite level test
				self.hideAssertionResults();

				// continue on to the next suite
				QUnit.start();
			},

			recordAssertions: function (count, parentTest) {
				var i;
				for (i = 0; i < count; i += 1) {
					ok(true, self.assertionResultPrefix + parentTest);
				}
			},

			hideAssertionResults: function () {
				$("li:not([id]):contains('" + self.assertionResultPrefix + "')").hide();
			},

			exec: function (data) {
				data.forEach(function (file) {
					QUnit.asyncTest(file, function () {
						console.log('Test start: ' + file);
						self.file = file;
						self.$frameElem[0].addEventListener("load", self.onFrameLoad);
						self.$frameElem.attr("src", '' + file);
					});
				});
			}
		});
	};

	QUnit.done = function (details) {
		// set results in cookies
		cookieHelper.set("TizenP", details.passed);
		cookieHelper.set("TizenF", details.failed);
		cookieHelper.set("TizenR", details.runtime);
		cookieHelper.set("TizenT", details.total);
		location.href = "./result.php";
	};

	// get the test directories
	new Runner().exec(TESTS);
});
