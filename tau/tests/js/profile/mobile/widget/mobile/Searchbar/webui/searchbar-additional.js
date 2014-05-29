/*
 * Unit Test : Searchbar list
 *
 * Wongi Lee <wongi11.lee@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok, notEqual*/
$( document ).ready( function ( ) {

	module( "Searchbar" );

	// trigger pagecreate
	$( "#searchbar-unit-test" ).page( );

	var searctbar_test = function ( widget, options ) {
		var $divSearchbar = $( "#searchbar-unit-test div.input-search-bar" ),
			$input = $( "input" );

		equal( $divSearchbar.length, 1, "initialized" );
		equal( $divSearchbar.find( "div.ui-input-search" ).length, 1, 'container exists');
		equal( $divSearchbar.find( "div.ui-input-search input.ui-input-text" ).length, 1, 'Input exists');
		equal( $divSearchbar.find( "div.ui-input-search a.ui-input-clear" ).hasClass( "ui-input-clear-hidden" ), true, 'button has propor class');
		equal( $divSearchbar.find( "div.ui-input-search div.ui-image-search" ).length, 1, 'icon has proper class');

		equal( $("#searchbar-content p" ).filter( function ( index ) {
			return $( this ).css( "display" ) != "none";
		} ).length, 30, 'p count' );

		/* Public Method */
		/* disable */
		$( "#searchInput" ).searchbar( "disable" );
		equal( $( "#searchInput" ).hasClass( "ui-disabled" ), true, "disable" );
		equal( $( "#searchInput" ).attr( "disabled" ), "disabled", '' );


		$input.val( "are" ).trigger( "change" );
		equal( $("#searchbar-content p" ).filter( function ( index ) {
			return $( this ).css( "display" ) != "none";
		} ).length, 1 , "After search bar was disabled testing chage event" );

		/* enable */
		$( "#searchInput" ).searchbar( "enable" );
		equal( $( "#searchbar-unit-test div.ui-input-search" ).hasClass( "ui-disabled" ), false, "enable" );
		equal( $( "#searchInput" ).attr( "disabled" ), undefined, '' );

		/* Event */
		/* Search : Input and trigger change */
		$input.focus( );
		equal( $( "div.ui-image-search" ).css( "display" ), "block", "Input and trigger change" );

		$input.val( "a" ).trigger( "change" );

		$input.val( "are" ).trigger( "change" );
		equal( $("#searchbar-content p" ).filter( function ( index ) {
			return $( this ).css( "display" ) != "none";
		} ).length, 1, '' );

		$input.val( "12" ).trigger( "change" );
		equal( $("#searchbar-content p" ).filter( function ( index ) {
			return $( this ).css( "display" ) != "none";
		} ).length, 0, '' );

		/* Clear button pressed. */
		$( "a.ui-input-clear" ).trigger( "click" );
		equal( $("#searchbar-content p" ).filter( function ( index ) {
			return $( this ).css( "display" ) != "none";
		} ).length, 30, '' );

		equal( $divSearchbar.find( "div.ui-input-search a.ui-input-clear" ).hasClass( "ui-input-clear-hidden" ), true, "Clear button pressed" );

		if ( options.button ) {
			/* Button test */
			equal( $( ".ui-btn" ).hasClass( "ui-btn" ), true, '' );
			equal( $divSearchbar.find( "> .ui-btn" ).jqmData("icon" ), options.button, '' );
		}

		if ( options.cancel == true ) {
			/* Cancel test*/
			equal( $( ".ui-input-cancel" ).hasClass( "ui-btn" ), true, '' );
			equal( $( ".ui-input-cancel" ).hasClass( "ui-btn-icon-cancel" ), true, '' );

			equal( $( ".ui-input-cancel" ).hasClass( "ui-btn" ), true, '' );
			equal( $( ".ui-input-cancel" ).hasClass( "ui-btn-icon-cancel" ), true, '' );

			/* Cancel button pressed. */
			$( "a.ui-btn-icon-cancel" ).trigger( "click" );
			notEqual( $( "div.ui-image-search" ).css( "display" ), "none", '' );
		}
	} ;

	test( "Searchbar", function ( ) {
		/* Initialize */
		searctbar_test( $('#searchInput'), {button : 'call', cancel : true} ) ;
	} );

} );
