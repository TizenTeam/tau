/*
 * Unit Test: listdivider
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 */

(function ($) {
	module("Listdivider");

	var unit_listdivider = function ( widget ) {
		var listdivdierDynamic = '<li data-role= "list-divider">Item styles</li>';
		equal( widget.find(":jqmData(role=list-divider)").length, 3, "List dividers count");
		widget.find(":jqmData(role=list-divider)").each( function( ) {
			equal( $(this).text().trim(), "Item styles", "List divider text check" )
		} );
		equal( widget.find('li.ui-li-divider').length, 3, "CSS check : list dividers count");

		$( listdivdierDynamic ).appendTo( widget );
		$( widget ).listview("refresh");

		equal( widget.find(":jqmData(role=list-divider)").length, 4, "List dividers count");
		widget.find(":jqmData(role=list-divider)").each( function( ) {
			equal( $(this).text().trim(), "Item styles", "List divider text check" )
		} );
	};

	var unit_listcheckdivider = function ( widget ) {
		unit_listdivider( widget );
		equal(  widget.find('li.ui-li-has-checkbox').length, widget.find('li.ui-li-divider').length - 1, "List checkbox divider count check");
	};

	test( "Listdivider", function () {
		$("#listview1").listview();
		unit_listdivider( $("#listview1") );
	});

	test( "listdivdier_group", function() {
		$("#listdivdier_group").page( );
		$("#listview2").listview();
		unit_listcheckdivider( $("#listview2") );
	});
}( jQuery ));
