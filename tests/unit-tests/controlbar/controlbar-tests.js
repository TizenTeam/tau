/*
 * controlbar unit tests
 */

(function ($) {
	$.mobile.defaultTransition = "none";

	module( "Controlbar" );

	var unit_controlbar = function ( widget, drayStyle ) {
		var controlbar,
			controlbar_style,
			item_count,
			activeIndex,
			deactiveReturn,
			activeReturn,
			created_controlbar = widget.controlbar();

		/* Create */
		ok( created_controlbar, "Create" );

		if ( drayStyle ) {
			if ( drayStyle == "icon" ) {
				equal( created_controlbar.find( "a" ).is(".ui-btn-icon_only" ), true, "Icon only style test");
			} else if ( drayStyle == "text" ) {
				equal( created_controlbar.is(".ui-controlbar-noicons" ), true, "Text only style test");
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

	test( "controlbar normal style test", function () {
		unit_controlbar( $("#controlbar-test") );
	});

	test( "controlbar icon style test", function () {
		unit_controlbar( $("#controlbar-test-icon-only"), "icon" );
	});

	test( "controlbar text style test", function () {
		unit_controlbar( $("#controlbar-test-text-only"), "text" );
	});
})(jQuery);
