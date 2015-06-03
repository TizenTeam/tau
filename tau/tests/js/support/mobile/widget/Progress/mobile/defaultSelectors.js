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
		ok(!!(tau.engine.getBinding(element, 'Progress')), "Progress was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Progress", "ProgressBar widget bound: " + selector);
	}
	test( "ProgressBar default selectors" , function () {
		var progressbydata = tau.widget.Progress(document.getElementById('by-data-role')),
			progressbyclass = tau.widget.Progress(document.getElementById('by-class-selector'));
		isProgressBar(progressbydata, '[data-role="progressbar"]');
		isProgressBar(progressbyclass, '.ui-progressbar');
	});

}(window.document));