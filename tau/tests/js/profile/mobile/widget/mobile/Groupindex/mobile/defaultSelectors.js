/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("groupindex", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isGroupIndex(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'GroupIndex')), "GroupIndex was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "GroupIndex", "GroupIndex widget bound: " + selector);
	}
	test( "GroupIndex default selectors" , function () {
		isGroupIndex(document.getElementById('by-data-role'), '[data-role="groupindex"]');
		isGroupIndex(document.getElementById('by-class-selector'), '.ui-group-index');
	});

}(window.document));