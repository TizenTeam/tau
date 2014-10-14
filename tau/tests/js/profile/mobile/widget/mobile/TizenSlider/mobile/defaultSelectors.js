/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("tizenslider", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isTizenSlider(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'TizenSlider')), "TizenSlider was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "TizenSlider", "TizenSlider widget bound: " + selector);
	}
	test("TizenSlider default selectors" , function () {
		isTizenSlider(document.getElementById('input-type-range'), "input[type='range']");
		isTizenSlider(document.getElementById('data-role-range'), "input[data-role='range']");
		isTizenSlider(document.getElementById('data-role-slider'), "input[data-role='slider']");
		isTizenSlider(document.getElementById('class-tizenslider'), "input.ui-tizenslider");
	});

}(window.document));