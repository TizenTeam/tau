/*
 * Unit Test: Mapview
 *
 * Wonseop Kim <wonseop.kim@samsung.com>
 */

( function ( $ ) {
	module("Mapview");

	var unit_mapview = function ( widget ) {
		var elem = "ui-mapview",
			zoomLevel,
			pointObject,
			polygonObject,
			result;

		/* Create */
		$("#map").mapview();
		ok( widget.hasClass( elem ), "Create" );

		/* API */
		result = widget.mapview( "toPixel", [ 126, 37 ] );
		deepEqual( result[ 0 ], -129, "API : toPixel" );

		result = widget.mapview( "toMap", [ 50, 354 ] );
		result[ 0 ] = parseInt( result[ 0 ], 10 );
		result[ 1 ] = parseInt( result[ 1 ], 10 );
		deepEqual( result, [ 126, 37 ], "API : toMap" );

		zoomLevel = widget.mapview( "option", "zoom" );
		widget.mapview( "zoom", 1 );
		deepEqual( widget.mapview( "option", "zoom" ), ++zoomLevel, "API : zoom(+1)" );
		widget.mapview( "zoom", -1 );
		deepEqual( widget.mapview( "option", "zoom" ), --zoomLevel, "API : zoom(-1)" );

		pointObject = {
			type: "Point",
			coordinates: [ 126.98301, 37.55653 ]
		};
		polygonObject = {
			type: "Polygon",
			coordinates: [ [ 126.98301, 37.55653 ], [ 126.98501, 37.55753 ], [ 126.98301, 37.55953 ] ]
		};
		widget.mapview( "append", pointObject );
		result = widget.mapview( "find", pointObject, 10 );
		ok( result.length === 1, "API : find( object, pixelTolerance )" );
		deepEqual( result[0], pointObject, "API : append" );

		widget.mapview( "remove", pointObject );
		result = widget.mapview( "find", pointObject, 10 );
		deepEqual( result.length, 0, "API : remove" );

		widget.mapview( "append", pointObject );
		widget.mapview( "append", polygonObject );
		result = widget.mapview( "find", "*" );
		ok( result.length === 2, "API : find( selector )" );
		widget.mapview( "empty" );
		result = widget.mapview( "find", "*" );
		deepEqual( result.length, 0, "API : empty" );

		widget.mapview( "location", "London", function ( results ) {
			var lon = parseFloat( results[0].lon, 10 ),
				lat = parseFloat( results[0].lat, 10 );
			deepEqual( widget.mapview( "option", "center" ), [ lon, lat ], "API : location" );
			start();
		});
	};

	asyncTest( "Mapview", function () {
		unit_mapview( $( "#map" ) );
	});
} ( jQuery ) );
