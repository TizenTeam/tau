/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("collapsible", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isCollapsible(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Collapsible')), "Collapsible was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Collapsible", "Collapsible widget bound: " + selector);
	}
	test( "Collapsible default selectors" , function () {
		isCollapsible(document.getElementById('by-data-role'), '[data-role="collapsible"]');
		isCollapsible(document.getElementById('by-class-selector'), '.ui-collapsible');
	});

}(window.document));