/*
 * tabbar unit tests
 */

(function ($) {
	$.mobile.defaultTransition = "none";

	module( "Tabbar" );

	var unit_tabbar = function ( widget, drayStyle ) {
		var tabbar,
			tabbar_style,
			item_count,
			activeIndex,
			deactiveReturn,
			activeReturn,
			created_tabbar = widget.tabbar();

		/* Create */
		ok( created_tabbar, "Create" );

		if ( drayStyle ) {
			if ( drayStyle == "icon" ) {
				equal( created_tabbar.find( "a" ).is(".ui-btn-icon_only" ), true, "Icon only style test");
			} else if ( drayStyle == "text" ) {
				equal( created_tabbar.is(".ui-tabbar-noicons" ), true, "Text only style test");
			}
		}

		/* Check APIs */
		activeIndex = created_tabbar.find(".ui-btn-active").index();
		created_tabbar.tabbar( "disable", activeIndex );
		deactiveReturn = created_tabbar.find("li:eq(" + activeIndex + ")").is(".ui-disabled");

		equal( deactiveReturn, true, "List Deactive test" );

		created_tabbar.tabbar("enable", activeIndex);
		activeReturn = created_tabbar.find("li:eq(" + activeIndex + ")").is(".ui-disabled");
		equal( activeReturn, false, "List Active test" );
	};

	test( "tabbar text style test", function () {
		unit_tabbar( $("#tabbar-test-text-only"), "text" );
	});
})(jQuery);
