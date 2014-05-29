/*
 * Unit Test: Progressbar
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("Progressbar");

	var unit_progressbar = function ( widget ) {
		var progress,
			i,
			value,
			get_width = function ( widget ) {
				return widget.progressbar( "option", "value" );
			};

		widget.progressbar();

		/* Create */
		equal( widget.hasClass("ui-progressbar"), true, "Create" );

		/* Value */
		for (i = 0; i < 5; i++) {
			value = Math.floor( Math.random() * 100 );
			widget.progressbar( "value", value );
			equal( get_width( widget ), value, "API: value" );
		}
	};

	test( "progressbar", function () {
		unit_progressbar( $("#progressbar") );
	});
}( jQuery ));
