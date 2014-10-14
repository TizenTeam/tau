/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("gallery3d", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isGallery3D(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Gallery3D')), "Gallery3D was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Gallery3D", "Gallery3D widget bound: " + selector);
	}
	test( "Gallery3D default selectors" , function () {
		isGallery3D(document.getElementById('by-data-role'), '[data-role="gallery3d"]');
		isGallery3D(document.getElementById('by-class-selector'), '.ui-gallery3d');
	});

}(window.document));