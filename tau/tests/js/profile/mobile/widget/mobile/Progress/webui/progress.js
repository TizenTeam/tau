/*
 * Unit Test: Progress
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("Progress");

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

	test( "pending bar", function () {
		unit_progress( $("#pending"), "pending" );
	});

	test( "processing circle", function () {
		unit_progress( $("#progressing"), "circle" );
	});
}( jQuery ));
