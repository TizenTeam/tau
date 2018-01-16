/* global QUnit, define, tau, expect */
(function () {
	"use strict";
	function runTests(NumberPicker, helpers) {


		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/NumberPicker/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "wearable", function () {
					resolve();
				});
			});
		}

		function clearHTML() {
			helpers.removeTAUStyle(document);
		}

		QUnit.module("profile/wearable/widget/wearable/NumberPicker", {
			setup: initHTML,
			teardown: clearHTML
		});


		QUnit.test("_init", function (assert) {
			var element = document.getElementById("number-picker"),
				numberPicker;

			expect(2);
			numberPicker = new NumberPicker();
			numberPicker.element = element;

			numberPicker.value = function (value) {
				assert.equal(value, element.value, "value is called with correct argument")
			};
			numberPicker._toggle = function (value) {
				assert.equal(value, numberPicker.options.disabled, "value is called with correct argument")
			};
			numberPicker._init();
		});

	}
	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.NumberPicker,
			window.helpers);
	}
}());
