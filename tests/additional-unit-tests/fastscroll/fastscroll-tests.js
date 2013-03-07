/*
 * Unit Test: FastScroll
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
( function ( $ ) {
	module("FastScroll");

	var unit_fastscroll = function ( list ) {
		var widget,
			shortcut,
			divider,
			fastpopup,
			i;

		widget = list.parentsUntil(".ui-content").parent( ).find(".ui-fastscroll");
		ok( widget , "Markup check: fast scroll");
		fastpopup = list.parentsUntil(".ui-content").parent( ).find(".ui-fastscroll-popup");
		ok( fastpopup , "Markup check: fastscroll popup");

		/* Create */
		ok( widget.hasClass("ui-fastscroll"), "Create");
		shortcut = widget.find("li");
		divider = list.find(".ui-li-divider");

		/* Shortcuts */
		for ( i = 0; i < divider.length; i++ ) {
			equal( $( divider[i] ).text( ), $( shortcut[i] ).text( ), "Shortcut");
		}
	};

	test("shortcut", function ( ) {
		unit_fastscroll( $("#shortcut") );
	} );

}( jQuery ) );
