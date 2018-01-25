/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("fieldcontain", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isFieldContain(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'FieldContain')), "FieldContain was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "FieldContain", "FieldContain widget bound: " + selector);
	}
	test( "FieldContain default selectors" , function () {
		isFieldContain(document.getElementById('by-data-role'), '[data-role="fieldcontain"]');
		isFieldContain(document.getElementById('by-class-selector'), '.ui-fieldcontain');
	});

}(window.document));