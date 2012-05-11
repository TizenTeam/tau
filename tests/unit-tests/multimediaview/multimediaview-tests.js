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

			/* size */
			width = 256;
			height = 512;
			widget.multimediaview( "size", width, height );
			equal( "width : " + widget.width() + ", height : " + widget.height(),
				"width : " + width + ", height : " + height, "API: size" );

			/* fullscreen */
			fullscreenButton = widget.parent().find( ".ui-fullscreenbutton" );

			widget.multimediaview( "fullscreen", true );
			ok( fullscreenButton.hasClass( "ui-fullscreen-off" ), "API: fullscreen (on)" );

			widget.multimediaview("fullscreen", false );
			ok( fullscreenButton.hasClass( "ui-fullscreen-on" ), "API: fullscreen (off)" );
		}
	};

	test( "video", function () {
		unit_multimediaview( $("#video"), "video" );
	});

	test( "audio", function () {
		unit_multimediaview( $("#audio"), "audio" );
	});

}( jQuery ));
