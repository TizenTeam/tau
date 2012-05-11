/*
 * Unit Test: Handler
 *
 * Wonseop Kim <wonseop.kim@samsung.com>
 */

(function ($) {
	module("Handler");

	var unit_handler = function ( widget ) {
		var elem = ".ui-handler",
			handler;

		/* Create */
		widget.scrollview();
		handler = widget.find( elem );
		ok( ( handler.length > 0 ), "Create" );

		/* API */
		widget.scrollview( "enableHandler", false );
		ok( handler.is( ":hidden" ), "API: enableHandler(false)" );
		widget.scrollview( "enableHandler", true );
		ok( handler.is( ":visible" ), "API: enableHandler(true)" );
	};

	test( "handler", function () {
		unit_handler( $("#handlerY") );
	});
}( jQuery ));
