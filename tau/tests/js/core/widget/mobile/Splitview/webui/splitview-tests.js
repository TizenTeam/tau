/*
 * Unit Test: splitview
 *
 * Sanghee Lee <sang-hee.lee@samsung.com>
 */

(function ( $ ) {
	module( "Splitview" );

	var unit_splitview = function ( widget, type ) {
		var splitview,
			$pane0,
			$pane1,
			$contents,
			$button,
			ratio = [];

		/* Create */
		splitview = widget.splitview();
		ok( splitview.length > 0, "Create" );

		equal( widget.children( ".ui-pane" ).length, 2, "Create: Removing panes after 2nd pane" );

		/* Options : fixed */
		splitview.splitview( "option", "fixed", true );
		equal( splitview.splitview( "option", "fixed" ), true, "Option : fixed" );

		/* Options : dividerVertical */
		splitview.splitview( "option", "dividerVertical", false );
		equal( splitview.splitview( "option", "dividerVertical" ), false, "Option : dividerVertical" );

		/* Options : ratio */
		splitview.splitview( "option", "ratio", [ 0.3, 0.7 ] );
		ratio = splitview.splitview( "option", "ratio" );
		ok( Math.abs( ratio[ 0 ] - 0.3 ) < 0.1 && Math.abs( ratio[ 1 ] - 0.7 ) < 0.1, "Option : ratio" );

		/* Methods : pane */
		splitview.splitview( "pane", "#pane0", $( "<a data-role='button' id='test'>button</a>" ) );
		button = splitview.splitview( "pane", "#pane0" )[0];
		equal( button.getAttribute( "id" ), "test", "Method : pane" );

		/* Methods : maximize */
		splitview.splitview( "maximize", "#pane0" );
		ratio = splitview.splitview( "option", "ratio" );
		ok( Math.abs( ratio[ 0 ] - 1.0 ) < 0.1 && Math.abs( ratio[ 1 ] ) < 0.1, "Method : maximize" );

		/* Methods : restore */
		splitview.splitview( "restore" );
		ratio = splitview.splitview( "option", "ratio" );
		ok( Math.abs( ratio[ 0 ] - 0.3 ) < 0.1 && Math.abs( ratio[ 1 ] - 0.7 ) < 0.1, "Method : restore" );
	};

	test( "Splitview", function () {
		unit_splitview( $( "#splitview-test" ), "splitview" );
	});

}( jQuery ));
