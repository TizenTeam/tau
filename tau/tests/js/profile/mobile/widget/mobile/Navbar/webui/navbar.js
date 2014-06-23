/*
 * navigationbar unit tests
*/

(function ($) {
	module( "Navigationbar" );

	var unit_navigationbar = function ( widget, anchorCount, extendedValue ) {
		/* Create */
		var created_navigationbar = $( widget );

		ok( created_navigationbar, "Create" );

		/* Check Parameters */
		equal( created_navigationbar.jqmData( "nstest-role" ), "header", "Basic test" );


		if ( extendedValue ) {
			equal( created_navigationbar.find( "input" ).length, anchorCount, "Groupcontrol button test" );
		} else {
			equal( created_navigationbar.children( "a" ).length, anchorCount, "button test" );
		}

		/* Check APIs */
	};

	test( "navigationbar no button test", function () {
		unit_navigationbar( $("#normalnavigation1"), 0 );
	});

	test( "navigationbar one button test", function () {
		unit_navigationbar( $("#normalnavigation2"), 1 );
	});

	test( "navigationbar two button test", function () {
		unit_navigationbar( $("#normalnavigation3"), 2 );
	});

	test( "navigationbar three button test", function () {
		unit_navigationbar( $("#normalnavigation4"), 3 );
	});

	test( "navigationbar extended two button test", function () {
		unit_navigationbar( $("#extendedstyle2btn"), 2, true );
	});

	test( "navigationbar extended three button test", function () {
		unit_navigationbar( $("#extendedstyle3btn"), 3, true );
	});

	test( "navigationbar extended four button test", function () {
		unit_navigationbar( $("#extendedstyle4btn"), 4, true );
	});
})(jQuery);
