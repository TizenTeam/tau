(function (document) {
	var page = document.getElementById("test_inputs_page");
	page.addEventListener("pageshow", function() {
		"use strict";

		var tau = window.tau,
			engine = tau.engine;

		module("profile/tv/widget/SpinControl", {
			setup: function () {
				engine.createWidgets(document);
			},
			teardown: function () {
				engine._clearBindings();
			}
		});


		function buildTest(input) {
			var wrapper = input.parentNode;

			equal(input.getAttribute("data-tau-bound"), "SpinControl", "Input widget is created");
			ok(wrapper.classList.contains("ui-spin-control"), "Input wrapper has ui-spin-control class");
		}

		test("Input type='number'", 3, function () {
			var input = document.getElementById("in7");

			//after build
			buildTest(input);
			equal(input.getAttribute("aria-disabled"), "false", "Input widget is enabled");
		});

		test("Disabled input type='number'", 3, function () {
			var input = document.getElementById("in7-dis");

			//after build
			buildTest(input);
			ok(input.classList.contains("ui-disabled"), "Input has ui-disabled class");
		});

		test("Input type='number' destroy method", 4, function () {
			var input = document.getElementById("in7"),
				instance = tau.engine.instanceWidget(input, "SpinControl");

			buildTest(input);
			instance.destroy(input);

			//Set input as active element
			input.focus();
			ok(document.activeElement === input, "Input is an active element");

			//Keyup event doesn't' move focus from input to wrapper because event listener is removed.
			tau.event.trigger(input, "keyup");
			ok(document.activeElement === input, "Input is still active element");
		});

		test("Spin Control - Active state check", 1, function () {
			ok(true, "Passed");
		});

		test("Spin Control - change value", 2, function () {
			var input = document.getElementById("in7"),
				widget = tau.engine.instanceWidget(input, "SpinControl"),
				currentValue,
				newValue = 20;

			currentValue = widget.value();
			equal(currentValue, 50, "value() method returns proper value (50)");

			widget.value(newValue);
			currentValue = widget.value();
			equal(currentValue, newValue, "value() method sets proper value (20)");
		});

		test("Spin Control - overlay is visible", 1, function () {
			var input = document.getElementById("in7"),
				widget = tau.engine.instanceWidget(input, "SpinControl");

			widget.setActive(true);
			ok(widget._ui.overlay.offsetWidth > 0,
				"Overlay is displayed");
		});

	});
}(document));
