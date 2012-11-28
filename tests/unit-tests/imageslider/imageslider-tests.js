/*
 * Unit Test: Imageslider 
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("Imageslider");

	var unit_imageslider = function ( widget, count ) {
		var imagesldier,
			refresh = function ( widget ) {
				widget.imageslider("refresh");
				return widget.find(".ui-imageslider-bg");
			};

		/* Create */
		widget.imageslider();

		imageslider = widget.find(".ui-imageslider-bg");
		ok( imageslider, "Create" );

		/* Initialize */
		equal( imageslider.length, count, "Initialize" );

		/* API: add */
		widget.imageslider("add", "05.jpg");
		widget.imageslider("add", "06.jpg");
		imageslider = refresh( widget );
		equal( imageslider.length, count + 2, "API: add" );

		/* API: del */
		widget.imageslider("remove");
		imageslider = refresh( widget );
		equal( imageslider.length, count + 1, "API: del" );
	};

	test( "imageslider", function () {
		unit_imageslider( $("#imageslider"), 4 );
	});
}( jQuery ));
