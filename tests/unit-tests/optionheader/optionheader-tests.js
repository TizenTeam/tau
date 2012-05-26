/*
 * optionheader unit tests
 */

(function ($) {
	module( "Option header" );

	var unit_optionheader = function ( widget, buttonCount) {
		var created_optionheader = widget.optionheader(),
			obj_optionheader = created_optionheader.data( "optionheader" );

		ok( created_optionheader, "Create" );

		/* Check Option */
		equal( obj_optionheader.options.showIndicator, true, "Option test -> Indicator" );
		equal( obj_optionheader.options.theme, "s", "Option test -> theme" );
		equal( obj_optionheader.options.startCollapsed, false, "Option test -> startCollapsed" );
		equal( obj_optionheader.options.expandable, true, "Option test -> expandable" );
		equal( obj_optionheader.options.duration, 0.25, "Option test -> duration" );
		equal( obj_optionheader.options.collapseOnInit, true, "Option test -> collapseOnInit" );

		/* parameter check*/
		equal( created_optionheader.find(":jqmData(role='button')").length, buttonCount, "Parameter test -> button length" );

		if ( created_optionheader.is(":jqmData(for)") ) {
			created_optionheader.siblings().each(function ( index ) {
				if ( $(this).attr("id") ==	created_optionheader.jqmData("for") ) {
					equal( $(this).jqmData("icon"), "optiontray", "Parameter test -> icon test" );
				}
			});
		}
		/* Check APIs */
		asyncTest( "option header expand test", function () {
			created_optionheader.optionheader( "expand" );
			setTimeout( function () {
				equal( created_optionheader.height() > 10 , true, "API test -> expand()" );
				start();
				created_optionheader.optionheader( "collapse" );
				asyncTest( "option header collapse test", function () {
					setTimeout( function () {
						equal( created_optionheader.height() > 10 , false, "API test -> collapse()" );
						start();
					}, 1000 );
				});
			}, 1000 );
		});

		obj_optionheader.options = false;
		created_optionheader.optionheader( "toggle", true );
		if ( obj_optionheader.options == false ) {
			equal( obj_optionheader.isCollapsed , false, "API test -> toggle() collapse" );
		}

		obj_optionheader.options = true;
		created_optionheader.optionheader( "toggle", true );
		if ( obj_optionheader.options == true ) {
			equal( obj_optionheader.isCollapsed , true, "API test -> toggle() expand" );
		}
	/* Check Markup */
	};

	test( "option header 2btn test", function () {
		unit_optionheader( $("#myoptionheader1"), 2 );
	});

	test( "option header 3btn test", function () {
		unit_optionheader( $("#myoptionheader2"), 3 );
	});

	test( "option header 4btn test", function () {
		unit_optionheader( $("#myoptionheader3"), 4 );
	});
})(jQuery);
