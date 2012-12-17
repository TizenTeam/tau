/*
 * Unit Test: FastScroll
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("FastScroll");

	var unit_fastscroll = function ( list ) {
		var widget,
			shortcut,
			divider;

		widget = list.parentsUntil(".ui-content").parent().find(".ui-fastscroll");

		/* Create */
		ok( widget.hasClass("ui-fastscroll"), "Create" );

		shortcut = widget.find("li");
		divider = list.find(".ui-li-divider");

		/* Shortcuts */
		for ( i = 0; i < divider.length; i++ ) {
			equal( $( divider[i] ).text(), $( shortcut[i] ).text(), "Shortcut");
		}
	};

	test( "shortcut", function () {
		unit_fastscroll( $("#shortcut") );
	});

}( jQuery ));
