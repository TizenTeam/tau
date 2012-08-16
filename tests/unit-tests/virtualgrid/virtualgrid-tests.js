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
		virtualGrid = widget.virtualgrid("create" , {
			itemData: function ( idx ) {
				return JSON_DATA[ idx ];
			},
			numItemData: JSON_DATA.length,
			cacheItemData: function ( minIdx, maxIdx ) { }
		});
		ok(virtualGrid, "Create");

		$(".virtualgrid_demo_page").bind("select", function ( event ) {
			ok(true, "Event : select");
		});

		$(".virtualgrid_demo_page").bind("test.resize", function ( event ) {
			var prevColCnt = 0;

			$item = $(".ui-virtualgrid-wrapblock-y:first");
			prevColCnt = $item.children().length;
			$("#virtualgrid-test").css("width", "1500px");
			widget.virtualgrid("resize");
			$item = $(".ui-virtualgrid-wrapblock-y:first");
			notEqual( $item.children().length, prevColCnt, "Event : resize");
		});

		$($(".virtualgrid_demo_page").find(".ui-scrollview-view")).find(".ui-virtualgrid-wrapblock-y:first").addClass("center");
		widget.virtualgrid("centerTo", "center");
		$items = $($(".virtualgrid_demo_page").find(".ui-scrollview-view")).find(".ui-virtualgrid-wrapblock-y");
		for ( idx = 0 ; idx < $items.length ; idx += 1 ) {
			if ( $($items[idx]).hasClass("center") ) {
				index = idx;
				break;
			}
		}

		notEqual( index, 0, "API : centerTo");

		$item = $($(".ui-virtualgrid-wrapblock-y:first").children()[0]);
		$item.trigger("click");
		$item.trigger("test.resize");
	};

	$(document).bind("dataloaded" , function () {
		test( "Virtualgrid", function () {
			unit_virtualgrid( $("#virtualgrid-test"), "virtualgrid" );
		});
	});
}( jQuery ));
