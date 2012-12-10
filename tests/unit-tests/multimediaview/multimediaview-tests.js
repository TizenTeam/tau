/*
 * Unit Test: MultiMediaView
 *
 * Wonseop Kim <wonseop.kim@samsung.com>
 */

(function ($) {
	module("MultiMediaView");

	var unit_multimediaview = function ( widget, type ) {
		var control,
			fullscreenButton,
			width,
			height,
			played,
			timeupdated,
			ended,
			param;

		/* Create */
		widget.multimediaview();
		ok( widget.hasClass( "ui-multimediaview" ) , "Create" );

		if ( type === "video" ) {
			/* width */
			width = 100;
			widget.multimediaview( "width", width );
			equal( width, widget.width(), "API: width" );

			/* height */
			height = 200;
			widget.multimediaview( "height", height );
			equal( height, widget.height(), "API: height" );

			/* fullscreen */
			fullscreenButton = widget.parent().find( ".ui-fullscreenbutton" );

			widget.multimediaview( "fullScreen", true );
			ok( fullscreenButton.hasClass( "ui-fullscreen-off" ), "API: fullScreen (on)" );

			widget.multimediaview( "fullScreen", false );
			ok( fullscreenButton.hasClass( "ui-fullscreen-on" ), "API: fullScreen (off)" );
		}
	};

	test( "video", function () {
		unit_multimediaview( $( "#video" ), "video" );
	});

	test( "audio", function () {
		unit_multimediaview( $( "#audio" ), "audio" );
	});

}( jQuery ));
