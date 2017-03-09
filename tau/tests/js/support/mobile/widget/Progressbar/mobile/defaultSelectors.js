/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("support/profile/mobile/widget/mobile/Progressbar", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isProgressBar(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'ProgressBar')), "ProgressBar was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "ProgressBar", "ProgressBar widget bound: " + selector);
	}
	test( "ProgressBar default selectors" , function () {
		var progressbydata = tau.widget.Progress(document.getElementById('by-data-role')),
			progressbyclass = tau.widget.Progress(document.getElementById('by-class-selector'));
		isProgressBar(progressbydata, '[data-role="progressbar"]');
		isProgressBar(progressbyclass, '.ui-progressbar');
	});

}(window.document));