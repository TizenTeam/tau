/*
 * controlbar unit tests
 */

(function ($) {
	$.mobile.defaultTransition = "none";

	module( "Controlbar" );

	var unit_controlbar = function ( widget, type, drayStyle ) {
		var controlbar,
			controlbar_style,
			item_count,
			activeIndex,
			deactiveReturn,
			activeReturn,
			created_controlbar = widget.controlbar();

		/* Create */
		ok( created_controlbar, "Create" );

		/* Check Parameters */
		equal( type, created_controlbar.jqmData("style"), "Parameter: data-style" );

		if ( drayStyle ) {
			if ( drayStyle == "icon" ) {
				equal( created_controlbar.find( "a" ).is(".ui-btn-icon_only" ), true, "Icon only style test");
			} else if ( drayStyle == "text" ) {
				equal( created_controlbar.is(".ui-navbar-noicons" ), true, "Text only style test");
			}
		}

		/* Check APIs */
		activeIndex = created_controlbar.find(".ui-btn-active").index();
		created_controlbar.controlbar( "disable", activeIndex );
		deactiveReturn = created_controlbar.find("li:eq(" + activeIndex + ")").is(".ui-disabled");

		equal( deactiveReturn, true, "List Deactive test" );

		created_controlbar.controlbar("enable", activeIndex);
		activeReturn = created_controlbar.find("li:eq(" + activeIndex + ")").is(".ui-disabled");
		equal( activeReturn, false, "List Active test" );
	};

	test( "controlbar normal style test -> tabbar", function () {
		unit_controlbar( $("#controlbar-tabbar-test"), "tabbar" );
	});

	test( "controlbar icon style test -> tabbar", function () {
		unit_controlbar( $("#controlbar-tabbar-test-icon-only"), "tabbar", "icon" );
	});

	test( "controlbar text style test -> tabbar", function () {
		unit_controlbar( $("#controlbar-tabbar-test-text-only"), "tabbar", "text" );
	});

	test( "controlbar normal style test -> toolbar", function () {
		unit_controlbar( $("#controlbar-toolbar-test"), "toolbar" );
	});

	test( "controlbar icon style test -> toolbar", function () {
		unit_controlbar( $("#controlbar-toolbar-test-icon-only"), "toolbar", "icon" );
	});

	test( "controlbar text style test -> tabbar", function () {
		unit_controlbar( $("#controlbar-toolbar-test-text-only"), "toolbar", "text" );
	});
})(jQuery);
