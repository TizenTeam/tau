/*
 * Unit Test: Gallery3d
 *
 * Wonseop Kim <wonseop.kim@samsung.com>
 */

( function ( $ ) {
	$.mobile.defaultTransition = "none";

	module( "Galley3d" );

	asyncTest( "galley3d", function () {
		var widget = $( "#galley3dTest" ),
			imageList = [
				{ src: "../../../demos/tizen-winsets/widgets/test/01.jpg" },
				{ src: "../../../demos/tizen-winsets/widgets/test/02.jpg" }
			],
			elem = "ui-gallery3d",
			currentItem,
			image = { "src" : "../../../demos/tizen-winsets/widgets/test/05.jpg" };

		/* Create */
		widget.gallery3d();
		ok( widget.hasClass( elem ), "Create" );

		/* API */
		widget.gallery3d( "add", image );
		currentItem = widget.gallery3d( "select" );
		equal( currentItem.src, image.src, "API : add (by object)" );

		widget.gallery3d( "add", "../../../demos/tizen-winsets/widgets/test/04.jpg" );
		currentItem = widget.gallery3d( "select" );
		equal( currentItem.src, "../../../demos/tizen-winsets/widgets/test/04.jpg", "API : add (by image's path')" );

		equal( widget.gallery3d( "length" ), 2, "API : length" );

		widget.gallery3d( "remove" );
		notEqual( widget.gallery3d( "select" ), currentItem, "API : remove" );

		widget.gallery3d( "empty" );
		equal( widget.gallery3d( "length" ), 0, "API : empty" );

		widget.gallery3d( "add", imageList[1] )
			.gallery3d( "add", imageList[0] );

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
	});
}( jQuery ));
