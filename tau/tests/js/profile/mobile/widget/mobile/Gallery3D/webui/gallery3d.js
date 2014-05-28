/*
 * Unit Test: Gallery3d
 *
 * Wonseop Kim <wonseop.kim@samsung.com>
 */

( function ( $ ) {
	'use strict';
	var getGlContext = function () {
			var canvas = document.createElement('canvas');
			return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		};
	$.mobile.defaultTransition = "none";

	module( "Galley3d");

	asyncTest( "galley3d", function () {
		var widget = $( "#galley3dTest" ),
			imageList = [
				{ src: "../test/01.jpg" },
				{ src: "../test/02.jpg" }
			],
			elem = "ui-gallery3d",
			currentItem,
			image = { "src" : "../test/05.jpg" };

		/* API
		 * (WebGL support required) Execute tests when the browser is supporting WebGL
		 */
		if (getGlContext()) {
			/* Create */
			widget.gallery3d();
			ok( widget.hasClass( elem ), "Create" );

			widget.gallery3d( "add", image );
			currentItem = widget.gallery3d( "select" );
			equal( currentItem.src, image.src, "API : add (by object)" );

			widget.gallery3d( "add", "../test/04.jpg" );
			currentItem = widget.gallery3d( "select" );
			equal( currentItem.src, "../test/04.jpg", "API : add (by image's path')" );

			equal( widget.gallery3d( "length" ), 2, "API : length" );

			widget.gallery3d( "remove" );
			notEqual( widget.gallery3d( "select" ), currentItem, "API : remove" );

			widget.gallery3d( "empty" );
			equal( widget.gallery3d( "length" ), 0, "API : empty" );

			widget.gallery3d( "add", imageList[0] )
				.gallery3d( "add", imageList[1] );

			widget.gallery3d( "select", 1 );
			setTimeout( function () {
				equal( widget.gallery3d( "select" ), imageList[0], "API : select" );
				widget.gallery3d( "next" );
			}, 600 );

			setTimeout( function () {
				equal( widget.gallery3d( "select" ), imageList[1], "API : next" );
				widget.gallery3d( "prev" );
			}, 1200 );

			setTimeout( function () {
				equal( widget.gallery3d( "select" ), imageList[0], "API : prev" );
				start();
			}, 1800 );
		} else {
			start();
			throws(function () {
				widget.gallery3d();
				throw new Error();
			}, 'Gallery3d throws exception if browser not supports WebGL');
		}
	});
}( jQuery ));
