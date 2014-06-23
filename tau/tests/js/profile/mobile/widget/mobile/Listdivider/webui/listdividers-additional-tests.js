/*
 * Unit Test: listdividers
 *
 *
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$( document ).ready( function ( ) {

	module("List dividers", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	var unit_listdividers_test = function ( widget ) {
		var li ;

		/*markup*/
		equal( widget.hasClass("ui-listview"), true, "Markup check") ;
		equal( widget.find('li.ui-li').length, 24, "Markup check") ;
		equal( widget.find(":jqmData(role=list-divider)").length, 8, "List dividers count");
		equal( widget.find('li.ui-li-divider').length, 8, "Markup check : list dividers count") ;

		li = "<li>1line</li>";
		$( li ).appendTo( widget );
		$( widget ).listview("refresh");
		equal( widget.find('li.ui-li').length, 25, "Markup check") ;
	} ;

	test("ListDividers", function ( ) {
		// trigger pagecreate
		$("#listdividers-unit-test").page( );
		/* Initialize */
		$('#listdividerssample').listview( );
		unit_listdividers_test( $('#listdividerssample'), {button : 'call', cancel : true} ) ;

	} );

	test("ListDividers- dynamic", function ( ) {
		var createEvent = false,
			listHTMML = '<ul data-role= "listview"id= "listdividerssample1">' +
											'<li data-role= "list-divider">A</li>' +
											'<li><a href= "#">Adam Kinkaid</a></li>' +
											'<li><a href= "#">Alex Wickerham</a></li>' +
											'<li><a href= "#">Avery Johnson</a></li>' +
											'<li data-role= "list-divider"data-style= "dialogue">B</li>' +
											'<li><a href= "#">Bob Cabot</a></li>' +
											'<li data-role= "list-divider"data-style= "check">C</li>' +
											'<li><a href= "#">Caleb Booth</a></li>' +
											'<li><a href= "#">Christopher Adams</a></li>' +
											'<li><a href= "#">Culver James</a></li>' +
											'<li data-role= "list-divider"data-style= "expandable">D</li>' +
											'<li><a href= "#">David Walsh</a></li>' +
											'<li><a href= "#">Drake Alfred</a></li>' +
											'<li data-role= "list-divider"data-style= "checkexpandable">E</li>' +
											'<li><a href= "#">Elizabeth Bacon</a></li>' +
											'<li><a href= "#">Emery Parker</a></li>' +
											'<li><a href= "#">Enid Voldon</a></li>' +
											'<li data-role= "list-divider">F</li>' +
											'<li><a href= "#">Francis Wall</a></li>' +
											'<li data-role= "list-divider">G</li>' +
											'<li><a href= "#">Graham Smith</a></li>' +
											'<li><a href= "#">Greta Peete</a></li>' +
											'<li data-role= "list-divider">H</li>' +
											'<li><a href= "#">Harvey Walls</a></li>' +
										'</ul>';

		// trigger pagecreate
		$("#listdividers-unit-test-dynamic").page( );
		/* Initialize */
		$("#listdividers-unit-test-dynamic").find(":jqmData(role=content)").append( listHTMML ) ;

		$('#listdividerssample1').listview( {create : function ( ) {
			createEvent = true ;
		}} );

		$("#listdividers-unit-test-dynamic").find(":jqmData(role=content)").trigger('create') ;
		$('#listdividerssample1').listview( ) ;

		equal( createEvent, true, "Create Event") ;
		unit_listdividers_test( $('#listdividerssample1') ) ;

	} );

} );
