(function (window, document) {
	"use strict";

	tau.engine.defineWidget(
		"Button",
		"button, [data-role='button'], .ui-btn, input[type='button']",
		[],
		tau.widget.core.Button,
		"core",
		true
	);

	test("Button - Create", 2, function() {
		var el = document.getElementById("button1");

		tau.engine.instanceWidget(el, "Button");

		equal(el.getAttribute("data-tau-bound"), "Button", "Button widget is created");
		ok(el.classList.contains("ui-btn"), "Button has ui-btn class");
	});

	test("Button - Inline, Icon", 4, function() {
		var el = document.getElementById("button2");

		tau.engine.instanceWidget(el, "Button");

		ok(el.classList.contains("ui-inline"), "Button has ui-inline class");
		ok(el.classList.contains("ui-btn-icon"), "Button has ui-btn-icon class");
		ok(el.classList.contains("ui-btn-icon-only"), "Button has ui-btn-icon-only class");
		ok(el.classList.contains("ui-icon-call"), "Button has ui-icon-call class");
	});

	test("Button - Circle", 1, function() {
		var el = document.getElementById("button3");

		tau.engine.instanceWidget(el, "Button");

		ok(el.classList.contains("ui-btn-circle"), "Button has ui-btn-circle class");
	});

	test("Button - Icon Position", 4, function() {
		var el1 = document.getElementById("button4"),
			el2 = document.getElementById("button5"),
			el3 = document.getElementById("button6"),
			el4 = document.getElementById("button7");

		tau.engine.instanceWidget(el1, "Button");
		tau.engine.instanceWidget(el2, "Button");
		tau.engine.instanceWidget(el3, "Button");
		tau.engine.instanceWidget(el4, "Button");

		ok(el1.classList.contains("ui-btn-icon-top"), "Button has ui-btn-icon-top class");
		ok(el2.classList.contains("ui-btn-icon-bottom"), "Button has ui-btn-icon-bottom class");
		ok(el3.classList.contains("ui-btn-icon-left"), "Button has ui-btn-icon-left class");
		ok(el4.classList.contains("ui-btn-icon-right"), "Button has ui-btn-icon-right class");
	});

	test("Button - Enable/Disable State", 2, function() {
		var el = document.getElementById("button8"),
			widget = tau.engine.instanceWidget(el, "Button");

		widget.disable();
		ok(el.classList.contains("ui-state-disabled"), "Button has ui-state-disabled class");
		widget.enable();
		ok(!el.classList.contains("ui-state-disabled"), "Button hasn\'t ui-state-disabled class");
	});

	test("Button - Set/Get Method", 2, function() {
		var el = document.getElementById("button9"),
			widget = tau.engine.instanceWidget(el, "Button");

		equal(widget.value(), "Value", "Get Value");
		widget.value("Change");
		equal(widget.value(), "Change", "Set Value");
	});

})(window, window.document);

