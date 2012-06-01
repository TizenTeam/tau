/*
 * Unit Test: Nocontents
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("Nocontents");

	var unit_nocontents = function ( widget, type ) {
		var background,
			text,
			i;

		/* Create */
		widget.nocontents();

		ok( widget.hasClass("ui-nocontents"), "Create" );

		/* Check Background */
		background = widget.children( ".ui-nocontents-icon-" + type );
		ok( background, "Background" );

		/* Check Texts */
		text = widget.children("p");

		for ( i = 0; i < text.length; i++ ) {
			ok( text.hasClass("ui-nocontents-text"), "Text" + i );

		}
	};

	test( "text type", function () {
		unit_nocontents( $("#nocontents_text"), "text" );
	});

	test( "picture type", function () {
		unit_nocontents( $("#nocontents_pic"), "picture" );
	});

	test( "multimedia type", function () {
		unit_nocontents( $("#nocontents_mul"), "multimedia" );
	});

	test( "unnamed type", function () {
		unit_nocontents( $("#nocontents_un"), "unnamed" );
	});
}( jQuery ));
