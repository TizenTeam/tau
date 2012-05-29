/*
 * Unit Test: Virtual list
 *
 * Wongi Lee <wongi11.lee@samsung.com>
 */

$( document ).ready( function () {

	module( "Virtual List");

	function startVirtualListTest(){
		var $vlContainer = $( "ul.ui-virtual-list-container" ),
			$vlElements = $( "ul.ui-virtual-list-container li" ),
			vlHeight = $vlContainer.css( "height" ),
			vlOptions = $( "#virtuallist-normal_1line_ul" ).virtuallistview( "option" );

		test( "Virtual list test", function () {
			/* Initialize and create method */
			ok( $vlContainer );
			equal( $vlElements.length, 100 );
			ok( parseInt( vlHeight, 10 ) > 3000 );

			/* Options */
			equal( vlOptions.id, "#virtuallist-normal_1line_ul" );
			equal( vlOptions.childSelector, " li" );
			equal( vlOptions.dbtable, "JSON_DATA" );
			equal( vlOptions.template, "tmp-1line" );
			equal( vlOptions.row, 100 );
			equal( vlOptions.dbkey, false );
			equal( vlOptions.scrollview, true );

			ok ( ( function () {
				var i = 0,
					newJSON = new Array(),
					newItem,
					firstLI,
					result = true;

				/* make short JSON array */
				for ( i = 0; i < 200; i++ ) {
					newJSON.push( window.JSON_DATA[ ( i + 100 ) ] );
				}

				/* Call recreate */
				$( "#virtuallist-normal_1line_ul" ).virtuallistview( "recreate", newJSON );

				$vlContainer = $( "ul.ui-virtual-list-container" );
				$vlElements = $( "ul.ui-virtual-list-container li" );

				/* Check new List */
				ok( $vlContainer );
				equal( $vlElements.length, 100 );
				ok( parseInt( vlHeight, 10 ) > 3000 );

				newItem = window.JSON_DATA[ 100 ];

				firstLI = $( "ul.ui-virtual-list-container li:first" );

				try {
					equal( newItem.NAME, $( firstLI ).find( "span.ui-li-text-main" ).text() );
				} catch ( exception ) {
					console.log( exception );
					return false;
				}

				return true;
			}() ), "recreate()" );

			/* Destroy method */
			ok ( ( function () {
				/* Call destroy */
				$( "#virtuallist-normal_1line_ul" ).virtuallistview( "destroy" );

				destoyedVlElements = $( "ul.ui-virtual-list-container li" );
				console.log( destoyedVlElements.length );

				try {
					equal ( destoyedVlElements.length, 0 );
				} catch ( exception ) {
					console.log( "destroy : " + exception );
					return false;
				}
				return true;
			}() ), "destroy()" );
		} );
	}

	/* Load Dummy Data and Init Virtual List widget*/
	if ( window.JSON_DATA ) {
		$( "ul" ).filter( function () {
			return $( this ).data( "role" ) == "virtuallistview";
		} ).addClass( "vlLoadSuccess" );

		// trigger pagecreate
		$( "#virtuallist-unit-test" ).page();

		$( "ul.ui-virtual-list-container" ).virtuallistview( "create" );

		startVirtualListTest();
	} else {
		console.log ( "Virtual List Init Fail." );
	}
} );
