/*
 * Unit Test: Searchbar list
 *
 * Wongi Lee <wongi11.lee@samsung.com>
 */

$( document ).ready( function () {

	module( "Searchbar" );

	// trigger pagecreate

	asyncTest( "Searchbar", function () {
		/* Initialize */
		var $divSearchbar = $( "#searchbar-unit-test div.input-search-bar" ),
			$input = $( "input" );

		equal( $divSearchbar.length, 1, "initialized" );
		equal( $divSearchbar.find( "div.ui-input-search" ).length, 1, '' );
		equal( $divSearchbar.find( "div.ui-input-search input.ui-input-text" ).length, 1, '' );
		equal( $divSearchbar.find( "div.ui-input-search a.ui-input-clear" ).hasClass( "ui-input-clear-hidden" ), true, '' );
		equal( $divSearchbar.find( "div.ui-input-search div.ui-image-search" ).length, 1, '' );

		equal( $("#searchbar-content p").filter( function ( index ) {
			return $( this ).css( "display" ) != "none";
		} ).length, 30 );

		/* Public Method */
		/* disable */
		$( "#searchInput" ).searchbar( "disable" );
		equal( $( "#searchInput" ).hasClass( "ui-disabled" ), true, "disable" );
		equal( $( "#searchInput" ).attr( "disabled" ), "disabled", '' );

		/* enable */
		$( "#searchInput" ).searchbar( "enable" );
		equal( $( "#searchInput" ).hasClass( "ui-disabled" ), false, "enable" );
		equal( $( "#searchInput" ).attr( "disabled" ), undefined, '' );

		/* Event */
		/* Search : Input and trigger change */
		$input.focus();
		equal( $( "div.ui-image-search" ).css( "display" ), "block", "Input and trigger change" );

		$input.val( "a" ).trigger( "change" );

		$input.val( "are" ).trigger( "change" );
		equal( $("#searchbar-content p").filter( function ( index ) {
			return $( this ).css( "display" ) != "none";
		} ).length, 1, '' );

		/* Clear button pressed. */
		$( "a.ui-input-clear" ).trigger( "click" );
		equal( $("#searchbar-content p").filter( function ( index ) {
			return $( this ).css( "display" ) != "none";
		} ).length, 30,'' );

		equal( $divSearchbar.find( "div.ui-input-search a.ui-input-clear" ).hasClass( "ui-input-clear-hidden" ), true, "Clear button pressed", '' );

		/* Button test */
		equal( $( ".ui-btn" ).hasClass( "ui-btn" ), true, '' );
		equal( $divSearchbar.find( "> .ui-btn" ).jqmData("icon"), "call", '' );

		/* Cancel test*/
		equal( $( ".ui-input-cancel" ).hasClass( "ui-btn" ), true, '' );
		equal( $( ".ui-input-cancel" ).hasClass( "ui-btn-icon-cancel" ), true, '' );

		equal( $( ".ui-input-cancel" ).hasClass( "ui-btn" ), true, '' );
		equal( $( ".ui-input-cancel" ).hasClass( "ui-btn-icon-cancel" ), true, '' );

		/* Cancel button pressed. */
		$( "a.ui-btn-icon-cancel" ).trigger( "click" );
		notEqual( $( "div.ui-image-search" ).css( "display" ), "none", '' );

		start();
	} );
} );
