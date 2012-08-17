/*
 * Unit Test: Gallery3d
 *
 * Wonseop Kim <wonseop.kim@samsung.com>
 */

(function ($) {
	$.mobile.defaultTransition = "none";

	module("Galley3d");

	asyncTest( "create & select", function() {
		var widget = $( "#galley3dTest1" ),
			imageList = [],
			path = widget.attr( "data-json-url" ),
			key = widget.attr( "data-json-key" ),
			elem = "ui-gallery3d";

		$.ajax({
			async : false,
			url : path,
			dataType: "json",
			success : function ( result ) {
				imageList = result[key];
			}
		});

		/* Create */
		widget.gallery3d();
		ok( widget.hasClass( elem ), "Create" );

		/* API */
		widget.gallery3d( "select", 1 );
		setTimeout( function () {
			equal( widget.gallery3d( "select" ), imageList[1].src, "API : select" );
			start();
		}, 2400 );
	});

	asyncTest( "remove", function() {
		var widget = $( "#galley3dTest2" ),
			imageList = [],
			path = widget.attr( "data-json-url" ),
			key = widget.attr( "data-json-key" ),
			currentSource;

		$.ajax({
			async : false,
			url : path,
			dataType: "json",
			success : function ( result ) {
				imageList = result[key];
			}
		});

		widget.gallery3d();
		currentSource = widget.gallery3d( "select" );

		/* API */
		widget.gallery3d( "remove" );
		notEqual( widget.gallery3d( "select" ), currentSource, "API : remove" );
		start();
	});

	asyncTest( "move", function() {
		var widget = $( "#galley3dTest3" ),
			imageList = [],
			path = widget.attr( "data-json-url" ),
			key = widget.attr( "data-json-key" ),
			currentSource;

		$.ajax({
			async : false,
			url : path,
			dataType: "json",
			success : function ( result ) {
				imageList = result[key];
			}
		});

		widget.gallery3d();
		currentSource = widget.gallery3d( "select" );

		/* API */
		widget.gallery3d( "moveNext" );
		setTimeout( function () {
			equal( widget.gallery3d( "select" ), imageList[1].src, "API : moveNext" );
			start();

			stop();
			widget.gallery3d( "movePrev" );
			setTimeout( function () {
				equal( widget.gallery3d( "select" ), imageList[0].src, "API : movePrev" );
				start();
			}, 300 );
		}, 2400 );
	});

}( jQuery ));
