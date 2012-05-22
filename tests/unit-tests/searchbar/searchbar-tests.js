/*
 * Unit Test: Searchbar list
 *
 * Wongi Lee <wongi11.lee@samsung.com>
 */

$( document ).ready( function () {

	module( "Searchbar");

	// trigger pagecreate
	$( "#searchbar-unit-test" ).page();

	asyncTest( "Searchbar", function () {
		/* Initialize */
		var $divSearchbar = $( "div.input-search-bar"),
			$input = $("input");

		equal( $divSearchbar.length, 1, "initialized");
		equal( $divSearchbar.find( "div.ui-input-search" ).length, 1 );
		equal( $divSearchbar.find( "div.ui-input-search input.ui-input-text" ).length, 1 );
		equal( $divSearchbar.find( "div.ui-input-search a.ui-input-clear" ).hasClass( "ui-input-clear-hidden" ), true );
		equal( $divSearchbar.find( "div.ui-input-search div.ui-image-search" ).length, 1 );
		equal( $divSearchbar.find( "a.ui-input-cancel" ).hasClass( "ui-btn" ), true );
		equal( $divSearchbar.find( "a.ui-input-cancel" ).hasClass( "ui-btn-icon-cancel" ), true );
		equal( $("#searchbar-content p").filter( function( index ){
			return $( this ).css( "display" ) != "none";
		} ).length, 30 );

		/* Public Method */
		/* disable */
		$("#searchInput").searchbar("disable");
		equal( $( "div.ui-input-search" ).hasClass( "ui-disabled" ), true, "disable" );
		equal( $( "#searchInput" ).attr( "disabled" ), "disabled" );

		/* enable */
		$("#searchInput").searchbar("enable");
		equal( $( "div.ui-input-search" ).hasClass( "ui-disabled" ), false, "enable" );
		equal( $( "#searchInput" ).attr( "disabled" ), undefined );

		/* Event */
		/* Search : Input and trigger change */
		$input.focus();
		equal( $( "div.ui-image-search" ).css( "display" ), "none", "Input and trigger change" );

		$input.val( "a" ).trigger( "change" );

		equal( $("#searchbar-content p").filter( function( index ){
			return $( this ).css( "display" ) != "none";
		} ).length, 24 );

		$input.val( "ar" ).trigger( "change" );
		equal( $("#searchbar-content p").filter( function( index ){
			return $( this ).css( "display" ) != "none";
		} ).length, 10 );

		$input.val( "are" ).trigger( "change" );
		equal( $("#searchbar-content p").filter( function( index ){
			return $( this ).css( "display" ) != "none";
		} ).length, 1 );

		/* Clear button preesed. */
		$( "a.ui-input-clear" ).trigger( "tap" );
		equal( $("#searchbar-content p").filter( function( index ){
			return $( this ).css( "display" ) != "none";
		} ).length, 30 );

		equal( $divSearchbar.find( "div.ui-input-search a.ui-input-clear" ).hasClass( "ui-input-clear-hidden" ), true, "Clear button pressed" );
		equal( $divSearchbar.find( "a.ui-input-cancel" ).hasClass( "ui-btn" ), true );
		equal( $divSearchbar.find( "a.ui-input-cancel" ).hasClass( "ui-btn-icon-cancel" ), true );

		/* Cancel button pressed. */
		$( "a.ui-btn-icon-cancel" ).trigger( "tap" );
		notEqual( $( "div.ui-image-search" ).css( "dispaly" ), "none" );

		/* Page area pressed. */
		$input.focus();
		$( "#searchbar-unit-test" ).trigger( "tap" );
		equal( $divSearchbar.find( "a.ui-input-cancel" ).hasClass( "ui-btn-cancel-hide" ), true , "page area touched");

		start();
	} );
} );
