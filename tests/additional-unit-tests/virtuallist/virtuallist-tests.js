/*
 * Unit Test : Virtual list
 *
 * Wongi Lee <wongi11.lee@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok, JSON_DATA*/
$( document ).ready( function ( ) {

	module( "Virtual List" );

	function startVirtualListTest( ) {

		var $vlContainer = $( "ul.ui-virtual-list-container" ),
			$vlElements = $( "ul.ui-virtual-list-container li" ),
			vlHeight = $vlContainer.css( "height" ),
			vlOptions = $( "#virtuallist-normal_1line_ul" ).virtuallistview( "option" );

		test( "Virtual list test", function ( ) {
			var destoyedVlElements ;

			/* Initialize and create method */
			$( "#virtuallist-normal_1line_ul" ).virtuallistview( );
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


			/* Destroy method */
			ok ( ( function ( ) {
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
			} ( ) ), "destroy( )" );
		} );
	}

	var startVirtualListTestDynamic = function ( ) {
		/* dynamic testing */
		$('#virtuallist-normal_1line_ul').remove( );
		var VirtualMarkup = '<ul id= "virtuallist-normal_1line_ul" data-role= "virtuallistview" data-template= "tmp-1line" data-dbtable= "JSON_DATA" data-row= "100"></ul>';
		$('#virtuallist-unit-test').find(":jqmData(role=content)" ).append( VirtualMarkup ).trigger("create" );

		$.getScript( "../../../demos/tizen-winsets/widgets/list/virtuallist-db-demo.js", function ( data, textStatus ) {
			$( "ul" ).filter( function ( ) {
				return $( this ).data( "role" ) == "virtuallistview";
			} ).addClass( "vlLoadSuccess" );

			$("ul.ui-virtual-list-container" ).virtuallistview( "create", {
				itemData : function ( idx ) {
					return JSON_DATA[ idx ];
				},
				numItemData : JSON_DATA.length,
				cacheItemData : function ( minIdx, maxIdx ) {
				}
			} );
			startVirtualListTest( );
		} );

	} ;

	/* Load Dummy Data and Init Virtual List widget*/
	if ( window.JSON_DATA ) {
		$( "ul" ).filter( function ( ) {
			return $( this ).data( "role" ) == "virtuallistview";
		} ).addClass( "vlLoadSuccess" );

		// trigger pagecreate
		$( "#virtuallist-unit-test" ).page( );

		$( "ul.ui-virtual-list-container" ).virtuallistview( "create" );

		startVirtualListTest( );

		startVirtualListTestDynamic( ) ;


	} else {
		console.log ( "Virtual List Init Fail." );
	}
} );
