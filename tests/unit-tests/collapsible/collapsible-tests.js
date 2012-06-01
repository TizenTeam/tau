/*
 * collapse unit tests
 */

(function ($) {
	module( "collapse test" );

	var unit_collapse = function ( widget ) {
		var created_collapse = widget.collapsible(),
			obj_collapse = created_collapse.data( "collapsible" );

		ok( created_collapse, "Create" );

		/* Check Option */
		equal( obj_collapse.options.expandCueText, " click to expand contents", "Collapsed test -> expandCueText" );
		equal( obj_collapse.options.collapseCueText, " click to collapse contents", "Collapsed test -> collapseCueText" );
		equal( obj_collapse.options.collapsed, true, "Collapsed test -> collapsed" );
		equal( obj_collapse.options.heading, "h1,h2,h3,h4,h5,h6,legend", "Collapsed test -> heading" );
		equal( obj_collapse.options.theme, null, "Collapsed test -> theme" );
		equal( obj_collapse.options.contentTheme, null, "Collapsed test -> contentTheme" );

		/* Check event */
		created_collapse.trigger("collpase");
		equal( created_collapse.hasClass("ui-collapsible-collapsed") , true, "API test -> collapse" );

		created_collapse.trigger("expand");
		equal( created_collapse.hasClass("ui-collapsible-collapsed") , false, "API test -> expand" );
	};

	test( "collapse test", function () {
		unit_collapse( $("#collapsedContent") );
	});
})(jQuery);
