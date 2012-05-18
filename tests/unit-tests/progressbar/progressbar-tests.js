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

	var unit_progress = function ( widget, type ) {
		var progress,
			elem = ".ui-progress-" + type,
			_class = "ui-progress-" + type + "-running";

		widget.progress();

		/* Create */
		progress = widget.find( elem );
		ok( progress, "Create" );

		/* Option */
		equal( widget.progress( "option", "style" ), type, "Option: style" );

		/* Running */
		widget.progress( "running", true );
		progress = widget.find( elem );
		equal( progress.hasClass( _class ), true, "API: running" );

		/* Stop */
		widget.progress( "running", false );
		progress = widget.find( elem );
		equal( progress.hasClass( _class ), false, "API: stop" );
	};

	test( "progressbar", function () {
		unit_progressbar( $("#progressbar") );
	});

	test( "pending bar", function () {
		unit_progress( $("#pending"), "pending" );
	});

	test( "processing circle", function () {
		unit_progress( $("#progressing"), "circle" );
	});
}( jQuery ));
