(function (window, document) {
	"use strict";

	module("core/widget/core/Radio");

	test("Radio - Create", 2, function() {
		var el = document.getElementById("radio-choice-1");

		tau.engine.instanceWidget(el, "Radio");

		equal(el.getAttribute("data-tau-bound"), "Radio", "Radio widget is created");
		ok(el.classList.contains("ui-radio"), "Radio has ui-radio class");
	});

	test("Radio - Enable/Disable State", 1, function() {
		var elDisabled = document.getElementById("radio-choice-2"),
			widgetDisabled = tau.engine.instanceWidget(elDisabled, "Radio");

		ok(elDisabled.classList.contains("ui-state-disabled"), "Radio has ui-state-disabled class");
	});
})(window, window.document);

