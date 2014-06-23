/*
 * mobile button unit tests
 */
(function($){
	$.mobile.page.prototype.options.keepNative = "button.should-be-native";

	test( "button elements in the keepNative set shouldn't be enhanced", function() {
		deepEqual( $("button.should-be-native").siblings("div.ui-slider").length, 0 );
	});

	test( "button elements should be enhanced", function() {
		// [changed]
		// ok( $("#enhanced").hasClass( "ui-btn" ) );
		// in TAU button is placed inside container, which has ui-btn class
		ok( $("#enhanced").parent().hasClass( "ui-btn" ) );
	});

	test( "button markup text value should be changed on refresh", function() {
		var textValueButton = $("#hidden-element-addition"), valueButton = $("#value");

		// the value shouldn't change unless it's been altered
		textValueButton.button( 'refresh' );
		deepEqual( textValueButton.val(), "foo" );

		// use the text where it's provided
		deepEqual( textValueButton.val(), "foo" );
		textValueButton.val( "bar" ).button( 'refresh' );
		deepEqual( textValueButton.val(), "bar" );

		// prefer the text to the value
		textValueButton.text( "bar" ).val( "baz" ).button( 'refresh' );
		deepEqual( textValueButton.text(), "bar" );
	});

	test( "theme should be inherited", function() {
		var $inherited = $( "#theme-check" ),
		    $explicit = $( "#theme-check-explicit" );

		//deepEqual( $inherited.css( "background-color" ), "rgb(51, 51, 51)" ); /* The RGB value should match the background color we set for ui-btn-b in the default theme */

		// [changed]
		// ok( $explicit.hasClass( "ui-btn-a" ), "should not inherit" );
		// in TAU button's container has class ui-btn-up-THEME
		ok( $explicit.parent().hasClass( "ui-btn-up-a" ), "should not inherit" );
	});

	test( "Enhanced button elements should allow for phrasing content.", function() {
		var $htmlstring = $( "#contains-html" ),
		    $htmlval = $( "#val-contains-html" );

		ok( $htmlstring.find("sup").length, "HTML contained within a button element should carry over to the enhanced version" );
	});

	test( "Button's disabled state synced via refresh()", function() {
		var button = $( "#disabled-state" );

		// [changed]
		// button.prop( "disabled", true ).button( "refresh" );
		button.button();
		button.attr( "disabled", "true" );
		button.button( "refresh" );

		// [changed]
		// deepEqual( button.parent().hasClass( "ui-state-disabled" ), true,
		//  "class ui-state-disabled has been added to the wrapper" );
		// in TAU this class is added to button's element, not container
		deepEqual( button.hasClass( "ui-state-disabled" ), true,
			"class ui-state-disabled has been added to the wrapper" );

		// [changed]
		// deepEqual( button.button( "option", "disabled" ), true, "option disabled is now true" );
		// in TAU button does not have option 'disabled'
	});

})( jQuery );
