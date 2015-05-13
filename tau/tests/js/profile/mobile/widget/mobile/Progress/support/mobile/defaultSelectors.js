/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("progress", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isProgress(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Progress')), "Progress was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Progress", "Progress widget bound: " + selector);
	}
	test( "Progress default selectors" , function () {
		isProgress(document.getElementById('by-data-role'), '[data-role="progress"]');
		isProgress(document.getElementById('by-class-selector'), '.ui-progress');
	});

}(window.document));