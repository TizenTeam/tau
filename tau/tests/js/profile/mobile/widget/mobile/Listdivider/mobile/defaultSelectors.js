/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("listdivider", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isListDivider(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'ListDivider')), "ListDivider was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "ListDivider", "ListDivider widget bound: " + selector);
	}
	test( "ListDivider default selectors" , function () {
		isListDivider(document.getElementById('by-data-role'), '[data-role="list-divider"]');
		isListDivider(document.getElementById('by-class-selector'), '.ui-list-divider');
	});

}(window.document));