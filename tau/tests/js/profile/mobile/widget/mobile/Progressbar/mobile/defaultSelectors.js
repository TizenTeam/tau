/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("progressbar", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isProgressBar(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'ProgressBar')), "ProgressBar was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "ProgressBar", "ProgressBar widget bound: " + selector);
	}
	test( "ProgressBar default selectors" , function () {
		isProgressBar(document.getElementById('by-data-role'), '[data-role="progressbar"]');
		isProgressBar(document.getElementById('by-class-selector'), '.ui-progressbar');
	});

}(window.document));