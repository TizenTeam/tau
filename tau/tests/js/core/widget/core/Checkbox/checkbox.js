(function (window, document) {
	"use strict";

	test("Checkbox - Create", 2, function() {
		var el = document.getElementById("checkbox-1");

		tau.engine.instanceWidget(el, "Checkbox");

		equal(el.getAttribute("data-tau-bound"), "Checkbox", "Checkbox widget is created");
		ok(el.classList.contains("ui-checkbox"), "Checkbox has ui-checkbox class");
	});

	test("Checkbox - Enable/Disable State", 1, function() {
		var elDisabled = document.getElementById("checkbox-3"),
			widgetDisabled = tau.engine.instanceWidget(elDisabled, "Checkbox");

		ok(elDisabled.classList.contains("ui-state-disabled"), "Checkbox has ui-state-disabled class");
	});
})(window, window.document);

