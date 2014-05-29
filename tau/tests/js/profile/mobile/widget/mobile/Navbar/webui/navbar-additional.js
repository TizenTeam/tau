/*
 * navigationbar unit tests
*/
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
( function ( $ ) {
	module("Navigationbar");

	var unit_navigationbar = function ( widget, anchorCount, position, extendedValue ) {
		/* Create */
		var created_navigationbar = $( widget );
		ok( created_navigationbar, "Create");

		/* Check Parameters */
		equal( created_navigationbar.jqmData("nstest-role"), position, "Basic test");

		if ( extendedValue ) {
			equal( created_navigationbar.find("input").length, anchorCount, "Groupcontrol button test");
		} else {
			equal( created_navigationbar.children("a").length, anchorCount, "button test");
		}
	};

	test("navigationbar no button test -header", function ( ) {
		unit_navigationbar( $("#normalnavigation1"), 0, 'header');
	} );

	test("navigationbar one button test -header", function ( ) {
		unit_navigationbar( $("#normalnavigation2"), 1, 'header');
	} );

	test("navigationbar two button test -header", function ( ) {
		unit_navigationbar( $("#normalnavigation3"), 2 , 'header');
	} );

	test("navigationbar three button test -header", function ( ) {
		unit_navigationbar( $("#normalnavigation4"), 3 , 'header');
	} );

	test("navigationbar extended two button test -header", function ( ) {
		unit_navigationbar( $("#extendedstyle2btn"), 2, 'header', true );
	} );

	test("navigationbar extended three button test - header", function ( ) {
		unit_navigationbar( $("#extendedstyle3btn"), 3, 'header', true );
	} );

	test("navigationbar extended four button test -header", function ( ) {
		unit_navigationbar( $("#extendedstyle4btn"), 4, 'header', true );
	} );

	test("navigationbar no button test -header - Dynamic", function ( ) {

		var markup = '<h1>Navigationbar Test - markup</h1>';
		$('#normalnavigation11').append( markup ).trigger('create');

		unit_navigationbar( $("#normalnavigation11"), 0, 'header');
	} );

	test("navigationbar extended four button test -header- Dymanic", function ( ) {

		var markup = '<div data-role= "fieldcontain">' +
								'<fieldset data-role= "controlgroup"data-type= "horizontal">' +
									'<input type= "radio"name= "radio-view-8"data-icon= "segment-titlestyle-segonly"id= "segment1"value= "on"checked= "checked"/>' +
									'<label for= "segment1">All</label>' +
									'<input type= "radio"name= "radio-view-8"data-icon= "segment-titlestyle-segonly"id= "segment2"value= "off"/>' +
									'<label for= "segment2">Call</label>' +
									'<input type= "radio"name= "radio-view-8"data-icon= "segment-titlestyle-segonly"id= "segment3"value= "off"/>' +
									'<label for= "segment3">Save</label>' +
									'<input type= "radio"name= "radio-view-8"data-icon= "segment-titlestyle-segonly"id= "segment4"value= "off"/>' +
									'<label for= "segment4">Back</label>' +
								'</fieldset>' +
							'</div>';

		$('#extendedstyle5btn').append( markup ).trigger('create');
		$('#extendedstyle5btn').find(":jqmData(role=fieldcontain)").trigger('create');
		unit_navigationbar( $("#extendedstyle5btn"), 4, 'header', true );
	} );


	test("navigationbar no button test -footer", function ( ) {
		unit_navigationbar( $("#normalnavigation12"), 0 , 'footer');
	} );

	test("navigationbar one button test -footer", function ( ) {
		unit_navigationbar( $("#normalnavigation22"), 1 , 'footer');
	} );

	test("navigationbar two button test -footer", function ( ) {
		unit_navigationbar( $("#normalnavigation32"), 2 , 'footer');
	} );

	test("navigationbar three button test -footer", function ( ) {
		unit_navigationbar( $("#normalnavigation42"), 3 , 'footer');
	} );

	test("navigationbar extended two button test -footer", function ( ) {
		unit_navigationbar( $("#extendedstyle22btn"), 2 , 'footer', true );
	} );

	test("navigationbar extended three button test -footer", function ( ) {
		unit_navigationbar( $("#extendedstyle32btn"), 3 , 'footer', true );
	} );

	test("navigationbar extended four button test -footer", function ( ) {
		unit_navigationbar( $("#extendedstyle42btn"), 4 , 'footer', true );
	} );

	test("navigationbar no button test -footer - Dynamic", function ( ) {

		var markup = '<h1>Navigationbar Test - markup</h1>';
		$('#normalnavigation111').append( markup ).trigger('create');

		unit_navigationbar( $("#normalnavigation111"), 0 , 'footer');
	} );

	test("navigationbar extended four button test -footer- Dymanic", function ( ) {

		var markup = '<div data-role= "fieldcontain">' +
								'<fieldset data-role= "controlgroup"data-type= "horizontal">' +
									'<input type= "radio"name= "radio-view-8"data-icon= "segment-titlestyle-segonly"id= "segment1"value= "on"checked= "checked"/>' +
									'<label for= "segment1">All</label>' +
									'<input type= "radio"name= "radio-view-8"data-icon= "segment-titlestyle-segonly"id= "segment2"value= "off"/>' +
									'<label for= "segment2">Call</label>' +
									'<input type= "radio"name= "radio-view-8"data-icon= "segment-titlestyle-segonly"id= "segment3"value= "off"/>' +
									'<label for= "segment3">Save</label>' +
									'<input type= "radio"name= "radio-view-8"data-icon= "segment-titlestyle-segonly"id= "segment4"value= "off"/>' +
									'<label for= "segment4">Back</label>' +
								'</fieldset>' +
							'</div>';

		$('#extendedstyle52btn').append( markup ).trigger('create');
		$('#extendedstyle52btn').find(":jqmData(role=fieldcontain)").trigger('create');
		unit_navigationbar( $("#extendedstyle52btn"), 4 , 'footer', true );
	} );
} ( jQuery ));
