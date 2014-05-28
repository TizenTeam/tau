/*
 * Unit Test: Gallery3d
 *
 * Wonseop Kim <wonseop.kim@samsung.com>
 */

(function ($) {
	'use strict';
	var getGlContext = function () {
			var canvas = document.createElement('canvas');
			return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		};

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

		/* Create
		 *
		 * (WebGL support required) Execute tests when the browser is supporting WebGL
		 */
		if (getGlContext()) {
			widget.gallery3d();
			ok( widget.hasClass( elem ), "Create" );

			/* API */
			/*
			 * method "select" returns object with property "src" instead of string
			 * see: webui tests
			 */
			// Latest version of widget Gallery3d do not supports of tags: data-json-url, data-json-key
			widget.gallery3d( "add", imageList[0].src );
			widget.gallery3d( "add", imageList[1].src );
			widget.gallery3d( "add", imageList[2].src );
			widget.gallery3d( "select", 1 );
			setTimeout( function () {
				equal( widget.gallery3d( "select" ).src, imageList[1].src, "API : select" );
				start();
			}, 2400 );
		} else {
			start();
			ok(true, 'Browser not supports WebGL');
		}
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

		if (getGlContext()) {
			widget.gallery3d();
			// Latest version of widget Gallery3d do not supports of tags: data-json-url, data-json-key
			widget.gallery3d( "add", imageList[0].src );
			widget.gallery3d( "add", imageList[1].src );
			widget.gallery3d( "add", imageList[2].src );
			currentSource = widget.gallery3d( "select" );

			/* API */
			widget.gallery3d( "remove" );
			notEqual( widget.gallery3d( "select" ), currentSource, "API : remove" );
			start();
		} else {
			start();
			ok(true, 'Browser not supports WebGL');
		}
	});

	asyncTest( "move next", function() {
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

		if (getGlContext()) {
			widget.gallery3d();
			// Latest version of widget Gallery3d do not supports of tags: data-json-url, data-json-key
			currentSource =
			widget.gallery3d( "add", imageList[0].src );
			widget.gallery3d( "add", imageList[1].src);
			widget.gallery3d( "add", imageList[2].src);
			/* API */
			/*
			 * method "select" returns object with property "src" instead of string
			 * see: webui tests
			 * old method "moveNext" was replaced by "next"
			 * old method "movePrev" was replaced by "prev"
			 */
			widget.gallery3d( "next" );
			setTimeout( function () {
				equal( widget.gallery3d( "select" ).src, imageList[1].src, "API : next" );
				start();
			}, 2400 );
		} else {
			start();
			ok(true, 'Browser not supports WebGL');
		}
	});

	asyncTest( "move prev", function() {
		var widget = $( "#galley3dTest3" ),
			imageList = [],
			path = widget.attr( "data-json-url" ),
			key = widget.attr( "data-json-key" );

		$.ajax({
			async : false,
			url : path,
			dataType: "json",
			success : function ( result ) {
				imageList = result[key];
			}
		});

		if (getGlContext()) {
			widget.gallery3d();
			// Latest version of widget Gallery3d do not supports of tags: data-json-url, data-json-key
			widget.gallery3d( "add", imageList[0].src, 0);
			widget.gallery3d( "add", imageList[1].src ,1);
			widget.gallery3d( "add", imageList[2].src, 2);
			/* API */
			/*
			 * method "select" returns object with property "src" instead of string
			 * see: webui tests
			 * old method "moveNext" was replaced by "next"
			 * old method "movePrev" was replaced by "prev"
			 */
			widget.gallery3d( "prev" );
			setTimeout( function () {
				equal( widget.gallery3d( "select" ).src, imageList[2].src, "API : next" );
				start();
			}, 2400 );
		} else {
			start();
			ok(true, 'Browser not supports WebGL');
		}
	});

}( jQuery ));
