/*
 * Unit Test: tokentextarea
 *
 * Kangsik Kim <kangsik81.kim@samsung.com>
 * Minkyeong Kim <minkyeong.kim@samsung.com>
 */

(function ( $ ) {
	module( "Tokentextarea" );

	var unit_tokentextarea = function ( widget, type ) {
		var tokentextarea,
			inputText,
			outputText,
			status;

		/* Create */
		tokentextarea = widget.tokentextarea();
		ok( tokentextarea.length > 0, "Create" );

		/* length */
		equal( tokentextarea.tokentextarea( "length" ), 0, "API : length" );

		/* Add */
		tokentextarea.tokentextarea( "add", "string1" );
		equal( tokentextarea.tokentextarea( "length" ), 1, "API : add( 'string1' )" );
		tokentextarea.tokentextarea( "add", "string2" );
		equal( tokentextarea.tokentextarea( "length" ), 2, "API : add( 'string2' )" );
		tokentextarea.tokentextarea( "add", "string3" );
		equal( tokentextarea.tokentextarea( "length" ), 3, "API : add( 'string3' )" );

		/* Select */
		tokentextarea.tokentextarea( "select", 1 );
		outputText = tokentextarea.tokentextarea( "select" );
		equal( outputText, "string2", "API : select( 1 )" );

		/* Focus Out */
		tokentextarea.tokentextarea( "focusOut" );
		status = tokentextarea.hasClass( "ui-tokentextarea-focusout" );
		equal( status, true, "API : focusOut" );

		/* Focus In */
		tokentextarea.tokentextarea( "focusIn" );
		status = tokentextarea.hasClass( "ui-tokentextarea-focusin" );
		equal( status, true, "API : focusIn" );

		/* input */
		inputText = "tokentextarea";
		tokentextarea.tokentextarea( "inputText", inputText );
		outputText = tokentextarea.tokentextarea( "inputText" );
		equal( outputText, inputText, "API : input( '" + outputText + "' )" );

		asyncTest("asyncTest", function () {
			var $widget = $( "<div data-role='tokentextarea'></div>" ).tokentextarea();
			$( ".ui-page" ).append( $widget );

			$widget.tokentextarea( "add", "string1" );
			$widget.tokentextarea( "add", "string2" );
			$widget.tokentextarea( "add", "string3" );
			$widget.tokentextarea( "remove", 0 );

			setTimeout( function () {
				/* Remove */
				equal( $widget.tokentextarea( "length" ), 2,  "API : remove( 0 )" );
				$widget.tokentextarea( "remove" );
			}, 400 );

			setTimeout( function () {
				/* Reamove all */
				equal( $widget.tokentextarea( "length" ), 0,  "API : remove()" );
				start();
				$widget.remove();
			}, 800 );
		});
	};

	test( "Tokentextarea", function () {
		unit_tokentextarea( $( "#tokentextarea-test" ), "tokentextarea" );
	});

}( jQuery ));
