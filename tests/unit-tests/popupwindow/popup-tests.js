/*
 * Unit Test: Popup window
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("Popup Window");

	var unit_popup = function ( widget, type ) {
		var popupwindow = function ( widget ) {
				return widget.parent(".ui-popupwindow");
			},
			check_text = function ( widget, selector, type ) {
				if ( !widget.find( selector ).length ) {
					return;
				}
				equal( widget.find( selector ).text(), type, type );
			};

		/* Create */
		widget.popupwindow();
		ok( popupwindow( widget ), "Create" );

		/* Open */
		widget.popupwindow("open");
		ok( parseInt( popupwindow( widget ).css("top") ) > 0, "API: open" );

		/* Close */
		widget.popupwindow("close");
		ok( popupwindow( widget ).hasClass("ui-selectmenu-hidden") ||
			popupwindow( widget ).hasClass("reverse out"),
			"API: close" );

		/* Close the popup by click the screen */
		widget.popupwindow("open");
		$(".ui-selectmenu-screen").trigger("vclick");
		ok( popupwindow( widget ).hasClass("ui-selectmenu-hidden") ||
			popupwindow( widget ).hasClass("reverse out"),
				"Close the popup by click the screen" );

		/* Check Texts */
		check_text( widget, ":jqmData(role='text')", "text" );
		check_text( widget, ":jqmData(role='title')", "title" );
		check_text( widget, ".ui-btn", "button" );
	};

	test( "Center Info", function () {
		unit_popup( $("#center_info"), "center_info" );
	});

	test( "Center Title", function () {
		unit_popup( $("#center_title"), "center_title" );
	});

	test( "Center Basic 1 Button", function () {
		unit_popup( $("#center_basic_1btn"), "center_basic_1btn" );
	});

	test( "Center Title 1 Button", function () {
		unit_popup( $("#center_title_1btn"), "center_title_1btn" );
	});

}( jQuery ));
