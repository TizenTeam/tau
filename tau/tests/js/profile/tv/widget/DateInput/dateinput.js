(function (document) {
	var page = document.getElementById("test_inputs_page");
	page.addEventListener("pageshow", function() {
		"use strict";

		var tau = window.tau,
			engine = tau.engine;

		module("profile/tv/widget/DateInput", {
			setup: function () {
				engine.createWidgets(document);
			},
			teardown: function () {
				engine._clearBindings();
			}
		});


		function buildTest(input) {
			var wrapper = input.parentNode;

			equal(input.getAttribute("data-tau-bound"), "DateInput", "Input widget is created");
			ok(wrapper.classList.contains("ui-date-input"), "Input wrapper has ui-date-input class");
		}

		test("Input type='date'", 3, function () {
			var input = document.getElementById("in7");

			//after build
			buildTest(input);
			equal(input.getAttribute("aria-disabled"), "false", "Input widget is enabled");
		});

		test("Disabled input type='date'", 3, function () {
			var input = document.getElementById("in7-dis");

			//after build
			buildTest(input);
			ok(input.classList.contains("ui-disabled"), "Input has ui-disabled class");
		});

		test("Input type='date' destroy method", 4, function () {
			var input = document.getElementById("in7"),
				instance = tau.engine.instanceWidget(input, "DateInput");

			buildTest(input);
			instance.destroy(input);

			//Set input as active element
			input.focus();
			ok(document.activeElement === input, "Input is an active element");

			//Keyup event doesn't' move focus from input to wrapper because event listener is removed.
			tau.event.trigger(input, "keyup");
			ok(document.activeElement === input, "Input is still active element");
		});

	});
}(document));
