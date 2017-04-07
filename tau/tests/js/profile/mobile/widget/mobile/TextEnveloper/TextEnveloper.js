/* global QUnit, Promise, define, tau */
(function () {
	"use strict";
	function runTests(TextEnveloper, helpers) {
		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/mobile/widget/mobile/TextEnveloper/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "mobile", function () {
					resolve();
				});
			});
		}

		QUnit.module("profile/mobile/widget/mobile/TextEnveloper", {
			setup: initHTML
		});

		QUnit.test("_build", 15, function (assert) {
			var widget = new TextEnveloper(),
				element = document.getElementById("enveloper"),
				// simple element is without label
				elementSimple = document.getElementById("enveloper-simple"),
				input;

			assert.equal(widget._build(element), element, "_built return element");

			input = element.children[1];

			assert.equal(element.className, "ui-text-enveloper", "Element has proper class");
			assert.equal(element.firstElementChild.className, "ui-text-enveloper-start", "First child element has proper class");
			assert.equal(input.className, "ui-text-enveloper-input ui-text-input", "Input element has proper class");
			assert.equal(input.dataset.tauName, "TextInput", "Input element is instance of TextInput");
			assert.equal(widget._ui.inputElement, input, "Insput is stored in _ui");
			assert.deepEqual(widget._ui.buttons, [], "Insput is stored in _ui");

			assert.equal(element.querySelector(".ui-text-input-textline"), null, "Element hasn't line on TextInput");

			assert.equal(widget._build(elementSimple), elementSimple, "_built return element");

			// label is missing, first element is input
			input = elementSimple.children[0];

			assert.equal(element.className, "ui-text-enveloper", "Element has proper class");
			assert.equal(input.className, "ui-text-enveloper-input ui-text-input", "Input element has proper class");
			assert.equal(input.dataset.tauName, "TextInput", "Input element is instance of TextInput");
			assert.equal(widget._ui.inputElement, input, "Insput is stored in _ui");
			assert.deepEqual(widget._ui.buttons, [], "Insput is stored in _ui");

			assert.equal(element.querySelector(".ui-text-input-textline"), null, "Element hasn't line on TextInput");

		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.mobile.TextEnveloper,
			window.helpers);
	}
}());
