/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("slider", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isSlider(element, selector) {
		ok(!!(tau.engine.getBinding(element, "Slider")), "Slider was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Slider", "Slider widget bound: " + selector);
	}
	test("Slider default selectors" , function () {
		isSlider(document.getElementById('select-range'), "select[data-role='range']");
		isSlider(document.getElementById('by-class-selector'), "select.ui-slider");
	});

}(window.document));