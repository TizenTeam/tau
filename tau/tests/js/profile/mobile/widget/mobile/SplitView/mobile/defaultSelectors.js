/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("splitview", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isSplitView(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'SplitView')), "SplitView was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "SplitView", "SplitView widget bound: " + selector);
	}
	test("SplitView default selectors" , function () {
		isSplitView(document.getElementById('by-data-role'), "[data-role='splitview']");
		isSplitView(document.getElementById('by-class-selector'), ".ui-splitview");
	});

}(window.document));