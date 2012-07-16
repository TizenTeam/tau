/*
 * Unit Test: virtual grid
 *
 * Kangsik Kim <kangsik81.kim@samsung.com>
 */

(function ($) {
	module("Virtualgrid");

	var unit_virtualgrid = function ( widget, type ) {
		var virtualGrid,
			idx,
			index = 0,
			$items,
			$item;

		/* Create */
		virtualGrid = widget.virtualgrid("create");
		ok(virtualGrid, "Create");

		$(".virtualgrid_demo_page").bind("select", function (event){
			ok(true, "Event : select");
		});

		$($(".virtualgrid_demo_page").find(".ui-scrollview-view")).find(".ui-virtualgrid-wrapblock-y:first").addClass("center");
		widget.virtualgrid("centerTo", "center");
		$items = $($(".virtualgrid_demo_page").find(".ui-scrollview-view")).find(".ui-virtualgrid-wrapblock-y");
		for( idx = 0 ; idx < $items.length ; idx += 1 ) {
			if ( $($items[idx]).hasClass("center") ) {
				index = idx;
				break;
			}
		}

		notEqual( index, -1, "API : centerTo");

		$item = $($(".ui-virtualgrid-wrapblock-y:first").children()[0])
		$(".virtualgrid_demo_page").trigger("select");
	};

	$(document).bind("pagecreate", function () {
		test( "Virtualgrid", function () {
			unit_virtualgrid( $("#virtualgrid-test"), "virtualgrid" );
		});
	});
}( jQuery ));
