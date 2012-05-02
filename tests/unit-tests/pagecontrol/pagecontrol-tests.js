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
				'data-initVal': 1
				} ),
			nb;

		pc.pagecontrol( );

		ok( pc, "pagecontrol object creation" );
		nb = pc.children( 'div.page_n' )[0];	// 1st button
		console.dir( nb );
		ok( $(nb).hasClass( 'page_n_1' ), "first button should be activated" );

		nb = pc.children( 'div.page_n' )[9];
		ok( nb, "last number button should exist" );
		pc.one( "change", function( ev, val ) {
			equal( val, 10, "pagecontrol element's value must be set when click event comes." );
			} );
		$(nb).trigger( "click" );
		ok( $( nb ).hasClass( 'page_n_10' ), "after click, clicked button should be changed to number type" );
	} );

} ) ( jQuery );

