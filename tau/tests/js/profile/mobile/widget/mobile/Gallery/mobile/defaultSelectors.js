/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("gallery", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isGallery(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Gallery')), "Gallery was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Gallery", "Gallery widget bound: " + selector);
	}
	test( "Gallery default selectors" , function () {
		isGallery(document.getElementById('by-data-role'), '[data-role="gallery"]');
		isGallery(document.getElementById('by-class-selector'), '.ui-gallery');
	});

}(window.document));