/*
 * Unit Test: virtual grid
 *
 * Kangsik Kim <kangsik81.kim@samsung.com>
 */

(function ($) {
	module("Virtualgrid");

	var unit_virtualgrid = function ( widget, type ) {
		var virtualGrid;

		/* Create */
		virtualGrid = widget.virtualgrid("create");
		ok(virtualGrid, "Create")
	};

	test( "Virtualgrid", function () {
		unit_virtualgrid( $("#virtualgrid-test"), "virtualgrid" );
	});
}( jQuery ));
