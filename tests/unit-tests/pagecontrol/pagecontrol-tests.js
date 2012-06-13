/**
 * pagecontrol test
 */
( function ( $ ) {
	$.mobile.defaultTransition = "none";

	module( "PageControl" );

	test( "Basic pagecontrol test", function ( ) {
		var pc = $( '<div data-role="pagecontrol"></div>' )
				.attr( {
				'data-max': 10,
				'data-value': 2
				} ),
			nb;

		pc.pagecontrol( );

		ok( pc, "pagecontrol object creation" );
		nb = pc.children( 'div.page_n' )[1];	// 2nd button
		console.dir( nb );
		ok( $(nb).hasClass( 'page_n_2' ), "first button should be activated" );
		equal( $( pc ).pagecontrol( "value" ), 2, "value() method must return 2" );

		nb = pc.children( 'div.page_n' )[9];
		ok( nb, "last number button should exist" );
		pc.one( "change", function( ev, val ) {
			equal( val, 10, "pagecontrol element's value must be set when click event comes." );
			ok( $( nb ).hasClass( 'page_n_10' ), "after click, clicked button should be changed to number type" );
			equal( $( pc ).pagecontrol( "value" ), 10, "value() method must return 10" );

			$( pc ).pagecontrol( "value", 5 );
			equal( $( pc ).pagecontrol( "value" ), 5, "value() method must return 5 after running .value(5)" );

			} );
		$(nb).trigger( "click" );
	} );

} ) ( jQuery );

