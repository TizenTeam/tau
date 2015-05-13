/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("activityindicator", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isActivityIndicator(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'ActivityIndicator')), "ActivityIndicator was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "ActivityIndicator", "ActivityIndicator widget bound: " + selector);
	}
	test( "ActivityIndicator default selectors" , function () {
		isActivityIndicator(document.getElementById('by-data-role'), '[data-role="activity-indicator"]');
		isActivityIndicator(document.getElementById('by-class-selector'), '.ui-activity-indicator');
	});

}(window.document));