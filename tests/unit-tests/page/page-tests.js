/*
 * page unit tests
 */

(function ($) {
	$.mobile.defaultTransition = "none";

	module( "Page" );

	var unit_page = function ( widget, backoption ) {
		var created_page = widget.page();

		/* Create */
		ok( created_page, "Create" );

		equal( created_page.children(".ui-footer" ).length, 1, "check if fixed bar exist" );

		if ( backoption  ) {
			equal( created_page.children(".ui-" + backoption ).find( "a" ).hasClass( "ui-btn-back" ), true );
		}
	};

	test( "Basic page create test", function () {
		unit_page( $("#main_page") );
	});

	test( "Back button page create test", function () {
		unit_page( $("#main_page_back"), "footer" );
	});

	test( "Back button page create test - header", function () {
		unit_page( $("#main_page_back_header"), "header" );
	});
})(jQuery);
