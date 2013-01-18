/*
 * Unit Test: Extendable list
 *
 * Wongi Lee <wongi11.lee@samsung.com>
 */

$( document ).ready( function () {

	module( "Extendable List");

	function startExtendableListTest(){
		var $elContainer = $( "ul#extendable_list_main" ),
			$elElements = $( "ul#extendable_list_main li" ),
			elOptions = $( "ul#extendable_list_main" ).extendablelist( "option" );
		console.dir( elOptions );

		test( "Extendable list test", function () {
			/* Initialize and create method */
			ok( $elContainer );
			equal( $elElements.length, 51 );	/* 50 <li> items + one button. */

			/* Options */
			equal( elOptions.id, "#extendable_list_main" );
			equal( elOptions.childSelector, " li" );
			equal( elOptions.template, "tmp-1line" );
			equal( elOptions.extenditems, 50 );
			equal( elOptions.scrollview, true );

			/* Click Load more button */
			ok ( ( function () {
				/* Click Button  */
				$( "#load_more_message" ).click();

				$elElements = $( "ul#extendable_list_main li" );
				console.log( $elElements.length );

				try {
					equal ( $elElements.length, 101 );
				} catch ( exception ) {
					console.log( "click load more button  : " + exception );
					return false;
				}
				return true;
			}() ), "Click Load More button()" );

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
				$( "ul#extendable_list_main" ).extendablelist( "recreate", newJSON );

				$elContainer = $( "ul#extendable_list_main" );
				$elElements = $( "ul#extendable_list_main li" );

				/* Check new List */
				ok( $elContainer );
				equal( $elElements.length, 51 );	/* 50 <li> items + one button. */

				newItem = window.JSON_DATA[ 100 ];

				firstLI = $( "ul#extendable_list_main li:first" );

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
				$( "ul#extendable_list_main" ).extendablelist( "destroy" );

				var destoyedelElements = $( "ul#extendable_list_main li" );
				console.log( destoyedelElements.length );

				try {
					equal ( destoyedelElements.length, 0 );
				} catch ( exception ) {
					console.log( "destroy : " + exception );
					return false;
				}
				return true;
			}() ), "destroy()" );
		} );
	}

	/* Load Dummy Data and Init Extendable List widget*/
	if ( window.JSON_DATA ) {
		$( "ul" ).filter( function () {
			return $( this ).data( "role" ) == "extendablelist";
		} ).addClass( "elLoadSuccess" );

		// trigger pagecreate
		$( "#extendablelist-unit-test" ).page();

		$( "ul#extendable_list_main" ).extendablelist( "create" );

		startExtendableListTest();
	} else {
		console.log ( "Extendable List Init Fail." );
	}
} );
