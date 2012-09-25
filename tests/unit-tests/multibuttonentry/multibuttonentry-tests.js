/*
 * Unit Test: multibuttonentry
 *
 * Kangsik Kim <kangsik81.kim@samsung.com>
 * Minkyeong Kim <minkyeong.kim@samsung.com>
 */

(function ( $ ) {
	module( "Multibuttonentry" );

	var unit_multibuttonentry = function ( widget, type ) {
		var multibuttonentry,
			inputText,
			outputText,
			status;

		/* Create */
		multibuttonentry = widget.multibuttonentry();
		ok( multibuttonentry.length > 0, "Create" );

		/* length */
		equal( multibuttonentry.multibuttonentry( "length" ), 0, "API : length" );

		/* Add */
		multibuttonentry.multibuttonentry( "add", "string1" );
		equal( multibuttonentry.multibuttonentry( "length" ), 1, "API : add( 'string1' )" );
		multibuttonentry.multibuttonentry( "add", "string2" );
		equal( multibuttonentry.multibuttonentry( "length" ), 2, "API : add( 'string2' )" );
		multibuttonentry.multibuttonentry( "add", "string3" );
		equal( multibuttonentry.multibuttonentry( "length" ), 3, "API : add( 'string3' )" );

		/* Select */
		multibuttonentry.multibuttonentry( "select", 1 );
		outputText = multibuttonentry.multibuttonentry( "select" );
		equal( outputText, "string2", "API : select( 1 )" );

		/* Focus Out */
		multibuttonentry.multibuttonentry( "focusOut" );
		status = multibuttonentry.hasClass( "ui-multibuttonentry-focusout" );
		equal( status, true, "API : focusOut" );

		/* Focus In */
		multibuttonentry.multibuttonentry( "focusIn" );
		status = multibuttonentry.hasClass( "ui-multibuttonentry-focusin" );
		equal( status, true,  "API : focusIn" );

		/* Remove */
		multibuttonentry.multibuttonentry( "remove", 0 );
		equal( multibuttonentry.multibuttonentry( "length" ), 2 , "API : remove( 0 )" );

		/* Reamove all */
		multibuttonentry.multibuttonentry( "remove" );
		equal( multibuttonentry.multibuttonentry( "length" ), 0, "API : remove" );

		/* input */
		inputText = "multibuttonentry";
		multibuttonentry.multibuttonentry( "inputText", inputText );
		outputText = multibuttonentry.multibuttonentry( "inputText" );
		equal( outputText, inputText, "API : input( '" + outputText + "' )" );
	};

	test( "Multibuttonentry", function () {
		unit_multibuttonentry( $( "#multibuttonetnry-test" ), "multibuttonetnry" );
	});

}( jQuery ));
