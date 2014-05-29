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
			i,
			uiContentParent = list.parents(".ui-content").parent();

		widget = uiContentParent.find(".ui-fastscroll");
		ok( widget , "Markup check: fast scroll");
		fastpopup = uiContentParent.find(".ui-fastscroll-popup");
		ok( fastpopup , "Markup check: fastscroll popup");

		/* Create */
		ok( widget.hasClass("ui-fastscroll"), "Create");
		shortcut = widget.find("li");
		divider = list.find(".ui-li-divider");

		/* Shortcuts */
		for ( i = 0; i < divider.length; i++ ) {
			equal( $( divider[i] ).text( ), $( shortcut[i + 1] ).text( ), "Shortcut");
		}
	};

	test("shortcut", function ( ) {
		unit_fastscroll( $("#shortcut") );
	} );

}( jQuery ) );
