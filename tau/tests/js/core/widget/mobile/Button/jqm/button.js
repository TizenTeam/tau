/*
 * Unit Test: Button
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 *
 */
$ ( document ).ready ( function ( ) {

	module("button", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	$('#page1').one('pageshow', function() {
		/*
		* @todo - resolve problem with this test!
		* This test should be after test "button elements should be enhanced"!
		*/
		test( "button markup text value should be changed on refresh", function() {
				var textValueButton = $("#text"), valueButton = $("#value");

				// the value shouldn't change unless it's been altered
				textValueButton.button( 'refresh' );
				deepEqual( textValueButton.siblings().text(), "foo", 'test1');

				// use the text where it's provided
				/**
				 * @TODO
				 * this wont work since we don support dynamic
				 * value change of button
				 */
				deepEqual( textValueButton.siblings().text(), "foo", 'test2' );
				textValueButton.text( "bar" ).button( 'refresh' );
				deepEqual( textValueButton.siblings().text(), "bar", 'test3' );

				// use the val if it's provided where the text isn't
				deepEqual( valueButton.siblings().text(), "foo", 'test4' );
				valueButton.val( "bar" ).button( 'refresh' );
				deepEqual( valueButton.siblings().text(), "bar", 'test5' );

				// prefer the text to the value
				textValueButton.text( "bar" ).val( "baz" ).button( 'refresh' );
				deepEqual( textValueButton.siblings().text(), "bar", 'test6' );
		});

		test( "button elements in the keepNative set shouldn't be enhanced", function() {
			deepEqual( $("button.should-be-native").siblings("div.ui-slider").length, 0 );
		});

		test( "button elements should be enhanced", function() {
				//todo
				$("#enhanced").button();

				ok( $("#enhanced").hasClass( "ui-btn-hidden" ) );
		});

		test( "theme should be inherited", function() {
				var $inherited = $( "#theme-check" ),
					$explicit = $( "#theme-check-explicit" );

				//todo
				$inherited.button();
				$explicit.button();

				/**
				 * this behaviour was changed in webui
				 * the inherited theme coumes from content				
				 * element not page element
				 * ok( $inherited.closest("div").hasClass( "ui-btn-up-a" ), "should inherit from page" );
				 */
				ok( $inherited.closest("div").hasClass( "ui-btn-up-p" ), "should inherit from page" );
				ok( $explicit.closest("div").hasClass( "ui-btn-up-b" ), "should not inherit" );
		});

		test( "Enhanced button elements should allow for phrasing content.", function() {
			var $htmlstring = $( "#contains-html" ),
				$htmlval = $( "#val-contains-html" );

				//todo
				$htmlstring.button();
				$htmlval.button();

				ok( $htmlstring.parent().find(".ui-btn-text").find("sup").length, "HTML contained within a button element should carry over to the enhanced version" );
				ok( $htmlval.parent().find(".ui-btn-text").text().length > 1, "If the text is pulled from a button’s value, anything HTML-like should be disregarded." );
		});
	});
});
