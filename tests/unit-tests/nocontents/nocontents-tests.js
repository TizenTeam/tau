/*
 * Unit Test: Nocontents
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("Nocontents");

	var unit_nocontents = function ( widget, type ) {
		var nocontents,
			background,
			text;

		/* Create */
		widget.nocontents();

		nocontents = widget.children(".ui-nocontents");
		ok( nocontents, "Create" );

		/* Check Background */
		background = nocontents.children( ".ui-nocontents-icon-" + type );
		ok( background, "Background" );

		/* Check Parameters */
		text = nocontents.children( ".ui-nocontents-text" );

		text = text.first();
		equal( text.text(), widget.jqmData("text1"), "Parameter: data-text1" );

		text = text.next();
		equal( text.text(), widget.jqmData("text2"), "Parameter: data-text2" );
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
