/*
 * Unit Test: Core
 *
 * Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 */

$( "#corepage" ).live( "pageinit", function ( event ) {
	module("Core");

	test( "Disable text selection", function () {
		var all = $( event.target ).find("*"),
			haveDisabled = all.not( "input, [type='text'], textarea" ),
			haveEnabled = all.filter( "input, [type='text'], textarea" );
		$.mobile.tizen.disableSelection( $( event.target ) );

		haveDisabled.each( function () {
			strictEqual( $(this).css( "user-select" ), "none" );
		} );

		haveEnabled.each( function () {
			strictEqual( $(this).css( "user-select" ), "text" );
		} );
	} );

} );