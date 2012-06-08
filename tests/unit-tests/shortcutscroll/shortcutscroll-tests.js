/*
 * Unit Test: Shortcut Scroll
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("Shortcut Scroll");

	var unit_shortcutscroll = function ( list ) {
		var widget,
			shortcut,
			divider;

		widget = list.parentsUntil(".ui-content").parent().find(".ui-shortcutscroll");

		/* Create */
		ok( widget.hasClass("ui-shortcutscroll"), "Create" );

		shortcut = widget.find("li");
		divider = list.find(".ui-li-divider");

		/* Shortcuts */
		for ( i = 0; i < divider.length; i++ ) {
			equal( $( divider[i] ).text(), $( shortcut[i] ).text(), "Shortcut");
		}
	};

	test( "shortcut", function () {
		unit_shortcutscroll( $("#shortcut") );
	});

}( jQuery ));
