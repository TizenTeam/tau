/*
 * Unit Test: virtual grid
 *
 * Kangsik Kim <kangsik81.kim@samsung.com>
 * Woosung Sohn <woosungim.sohn@samsung.com>
 */

( function ( $ ) {
	module( "Virtualgrid" );

	var startVirtualGridTest = function ( virtualGrid ) {
		var $vgView,
			$vgScrollView,
			$vgWrapBlocks,
			$vgTmplElement,
			vgOptions = $( "#virtualgrid-test" ).virtualgrid( "option" ),
			vgHeight,
			idx,
			index = -1,
			$item,
			prevColCnt = 0;

		$vgView = $( ".ui-virtualgrid-view" );
		$vgScrollView = $vgView.find( ".ui-scrollview-view" );
		$vgWrapBlocks = $vgView.find( ".ui-virtualgrid-wrapblock-y" );
		$vgTmplElement = $vgWrapBlocks.find( ".ui-demo-namecard-pic" );
		vgHeight = $vgView.css( "height" ),

		test( "Virtualgrid", function () {
			$vgView.on( "select", function ( event ) {
				ok( true, "Event : select" );
			});

			ok( $vgView, "Markup : View element" );
			ok( parseInt( vgHeight, 10 ) > 100, "Markup : The height of a view element");
			ok( $vgScrollView.length, "Markup : A Scrollview inside VirtualGrid" );
			ok( $vgWrapBlocks.length > 10, "Markup : Wrap block" );
			ok( $vgWrapBlocks.first().children().length > 1, "Markup : Children nodes of a wrap block");
			ok( $vgTmplElement.length, "Markup : A div element created via template");

			equal( vgOptions.template, "tizen-demo-namecard", "Option : template" );
			equal( vgOptions.direction, "y", "Option : direction" );
			equal( vgOptions.rotation, true, "Option : rotation" );

			$( "#virtualgrid-test" ).virtualgrid( "centerTo", "card_0009" );
			for ( idx = 0 ; idx < $vgWrapBlocks.length ; ++idx ) {
				if ( $( $vgWrapBlocks[idx] ).hasClass( "card_0000" ) ) {
					index = idx;
					break;
				}
			}

			ok( virtualGrid, "Method : create" );
			notEqual( index, 0, "Method : centerTo" );

			$item = $vgWrapBlocks.first();
			prevColCnt = $item.children().length;
			$( "#virtualgrid-test" ).width( 250 );
			$( "#virtualgrid-test" ).virtualgrid( "resize" );
			console.log( "resize : " + $item.children().length + ", " + prevColCnt );
			notEqual( $item.children().length, prevColCnt, "Method : resize" );

			$item = $( $vgWrapBlocks.first().children()[0] );
			$item.trigger( "click" );
		});
	};

	$( document ).bind( "dataloaded" , function () {
		var virtualGrid = $( "#virtualgrid-test" ).virtualgrid( "create" , {
			itemData: function ( idx ) {
				return JSON_DATA[ idx ];
			},
			numItemData: JSON_DATA.length,
			cacheItemData: function ( minIdx, maxIdx ) { }
		});

		startVirtualGridTest( virtualGrid );
	});
}( jQuery ));
