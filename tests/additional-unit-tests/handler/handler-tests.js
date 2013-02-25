/*
 * Unit Test: Handler
 *
 * Wonseop Kim <wonseop.kim@samsung.com>
 */
/*jslint browser: true*/
/*global $,  jQuery,  test,  equal,  ok*/
( function ( $ ) {
	module("Handler");

	var unit_handler = function ( widget ) {
		var elem = ".ui-handler",
			handler;

		/* Create */
		widget.scrollview( );
		handler = widget.find( elem );
		ok( ( handler.length > 0 ), "Create");

		/* API */
		widget.scrollview("enableHandler",  false );
		ok( handler.is(":hidden"), "API: enableHandler( false )");
		widget.scrollview("enableHandler",  true );
		ok( handler.is(":visible"), "API: enableHandler( true )");
	};

	test("handler",  function ( ) {
		$('#handler0').page( );
		unit_handler( $("#handlerY") );
	} );

	test( "handler - dynamic",  function ( ) {
		var listHTML = '<div id= "handlerY"data-role= "content"data-scroll= "y"data-handler= "true">' +
									'<ul data-role= "listview">											' +
										'<li><a href= "#">Graham Smith</a></li>' +
										'<li><a href= "#">Greta Peete</a></li>' +
										'<li data-role= "list-divider">H</li>' +
										'<li><a href= "#">Harvey Walls</a></li>' +
									'</ul>' +
								'</div>';

		$('#handler1').page( );
		$('#handler1').find(":jqmData(role=content)").empty( );
		$('#handler1').find(":jqmData(role=content)").append( listHTML ).trigger('create') ;
		unit_handler( $("#handlerY") );
	} );
}( jQuery ) );
