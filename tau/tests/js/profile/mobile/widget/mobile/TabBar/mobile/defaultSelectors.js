/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("tabbar", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isTabBar(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'TabBar')), "TabBar was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "TabBar", "TabBar widget bound: " + selector);
	}
	test("TabBar default selectors" , function () {
		isTabBar(document.getElementById('by-data-role'), "[data-role='tabbar']");
		isTabBar(document.getElementById('by-class-selector'), ".ui-tabbar");
	});

}(window.document));