/*
 * Unit Test: Gallery3d
 *
 * Wonseop Kim <wonseop.kim@samsung.com>
 * Tomasz Lukawski <t.lukawski@samsung.com>
 */
/*jslint nomen: true */
/*global window:false, setTimeout: false,
 test:false, ok:false, equal:false, module:false, deepEqual:false, expect:false,
 asyncTest: false, notEqual: false, start: false,
 $: false
 */
(function () {
	'use strict';
	var createTest = function (gallery3d) {
			ok(gallery3d.hasClass('ui-gallery3d'), 'Create');
		};

	module('Gallery3d');

	asyncTest('gallery3d', function () {
		var gallery3d = $('#gallery3d'),
			imageList = [
				{ src: '../test/01.jpg' },
				{ src: '../test/02.jpg' }
			],
			currentItem,
			image = { 'src' : '../test/05.jpg' };

		/* Create */
		gallery3d.gallery3d();
		createTest(gallery3d);

		/* API */
		gallery3d.gallery3d('add', image);
		currentItem = gallery3d.gallery3d('select');
		equal(currentItem.src, image.src, 'API : add (by object)');

		gallery3d.gallery3d('add', '../test/04.jpg');
		currentItem = gallery3d.gallery3d('select');
		equal(currentItem.src, '../test/04.jpg', 'API : add (by image\'s path');

		equal(gallery3d.gallery3d('length'), 2, 'API : length');

		gallery3d.gallery3d('remove');
		notEqual(gallery3d.gallery3d('select'), currentItem, 'API : remove');

		gallery3d.gallery3d('empty');
		equal(gallery3d.gallery3d('length'), 0, 'API : empty');

		gallery3d.gallery3d('add', imageList[0])
			.gallery3d('add', imageList[1]);

		gallery3d.gallery3d('select', 1);
		setTimeout(function () {
			equal(gallery3d.gallery3d('select'), imageList[0], 'API : select');
			gallery3d.gallery3d('next');
		}, 600);

		setTimeout(function () {
			equal(gallery3d.gallery3d('select'), imageList[1], 'API : next');
			gallery3d.gallery3d('prev');
		}, 1200);

		setTimeout(function () {
			equal(gallery3d.gallery3d('select'), imageList[0], 'API : prev');
			start();
		}, 1800);
	});
}());
