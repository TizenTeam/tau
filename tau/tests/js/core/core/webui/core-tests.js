/*
 * Unit Test: Core
 *
 * Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 */

$( document ).ready( function ( ) {
	module("Core", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test( "Disable text selection", function () {
		var all = $( "#corepage" ).find("*"),
			haveDisabled = all.not( "input, [type='text'], textarea" ),
			haveEnabled = all.filter( "input, [type='text'], textarea" );
		$.mobile.tizen.disableSelection( $( "#corepage" ) );

		haveDisabled.each( function () {
			strictEqual( $(this).css( "-webkit-user-select" ), "none", 'Test proper slection for none');
		} );

		haveEnabled.each( function () {
			strictEqual( $(this).css( "-webkit-user-select" ), "text", 'Test proper slection for text' );
		} );
	} );
} );