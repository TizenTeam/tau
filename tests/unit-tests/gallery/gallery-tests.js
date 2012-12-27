/*
 * Unit Test: gallery 
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("gallery");

	var unit_gallery = function ( widget, count ) {
		var imagesldier,
			refresh = function ( widget ) {
				widget.gallery("refresh");
				return widget.find(".ui-gallery-bg");
			};

		/* Create */
		widget.gallery();

		gallery = widget.find(".ui-gallery-bg");
		ok( gallery, "Create" );

		/* Initialize */
		equal( gallery.length, count, "Initialize" );

		/* API: add */
		widget.gallery("add", "05.jpg");
		widget.gallery("add", "06.jpg");
		gallery = refresh( widget );
		equal( gallery.length, count + 2, "API: add" );

		/* API: del */
		widget.gallery("remove");
		gallery = refresh( widget );
		equal( gallery.length, count + 1, "API: del" );
	};

	test( "gallery", function () {
		unit_gallery( $("#gallery"), 4 );
	});
}( jQuery ));
