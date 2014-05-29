$( document ).ready( function () {

	module( "Searchbar" );

	// trigger pagecreate
	$( "#searchbar-unit-test" ).page();

	asyncTest( "Searchbar", function () {
		/* Initialize */
		var $divSearchbar = $( "#searchbar-unit-test div.input-search-bar" ),
			$input = $( "input" );

		/* Clear button pressed. */
		$( "a.ui-input-cancel" ).trigger( "click" );
		equal( $("#searchbar-content p").filter( function ( index ) {
			return $( this ).css( "display" ) != "none";
		} ).length, 30 );
		start();
	} );
	
	test('disable', function () {
		var $input = $( "#searchInput" );
		$input.searchbar();
		$input.searchbar('disable');
		ok($input.hasClass('ui-disabled'), 'has class ui-disabled');
	});
} );
