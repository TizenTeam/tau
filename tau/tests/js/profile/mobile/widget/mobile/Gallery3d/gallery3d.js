/*
 * Unit Test: Gallery3d
 *
 * Wonseop Kim <wonseop.kim@samsung.com>
 * Tomasz Lukawski <t.lukawski@samsung.com>
 */
/*jslint nomen: true */
/*global window:false, document:false, setTimeout: false, console: false,
 test:false, ok:false, equal:false, module:false, deepEqual:false, expect:false,
 asyncTest: false, notEqual: false, start: false, raises: false, throws: false,
 $: false
 */
(function () {
	'use strict';
	var glSupport,
		getGlContext = function () {
			var canvas = document.createElement('canvas');
			return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		};

	module('Gallery3d', {
		setup: function () {
			glSupport = getGlContext() ?  true : false;
		}
	});

	test('gallery3d', function () {
		var gallery3d = $('#gallery3d');

		/* Create */
		if (glSupport) {
			gallery3d.gallery3d();
			ok(gallery3d.hasClass('ui-gallery3d'), 'Create');
		} else {
			throws(function () {
				gallery3d.gallery3d();
				throw new Error();
			}, 'Gallery3d throws exception if browser not supports WebGL');
		}
	});
}());
