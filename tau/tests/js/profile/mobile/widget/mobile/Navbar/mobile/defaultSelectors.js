/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("navbar", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isNavbar(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'NavBar')), "NavBar was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "NavBar", "NavBar widget bound: " + selector);
	}
	test( "NavBar default selectors" , function () {
		isNavbar(document.getElementById('by-data-role'), '[data-role="navbar"]');
		isNavbar(document.getElementById('by-class-selector'), '.ui-navbar');
	});

}(window.document));