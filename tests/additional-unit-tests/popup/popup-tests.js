/*
 * Unit Test : Popup window
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$( document ).bind( "pageshow", function ( ) {

	module("Popup Window" );
	var unit_popup = function ( widget, type, buttoncount ) {

		var popupbeforepositionEvent = 0,
			popupafteropenEvent = 0,
			popupaftercloseEvent = 0,
			buttonList,
			popupwindow = function ( widget ) {
				return widget.parent('.ui-popup-container') ;
			},
			check_text = function ( widget, selector, type ) {
				if ( !widget.find( selector ).length ) {
					return;
				}
				equal( widget.find( selector ).text( ), type, type );
			};

		$('#popupbutton').unbind('vclick') ;
		$('#popupbutton').bind('vclick', function ( ) {
			widget.popup("open", {positionTo : 'window', transition : 'none', x : '0', y : '0', link : widget } );
		} ) ;

		/* Create */
		widget.popup( );
		ok( popupwindow( widget ), "Create" );

		/* Open */
		$('#popupbutton').trigger('vclick') ;
		ok( parseInt( popupwindow( widget ).css("top" ), 10 ) > 0, "API : open" );

		/* Close */
		widget.popup("close" );
		ok( popupwindow( widget ).hasClass("ui-selectmenu-hidden" ) ||
				popupwindow( widget ).hasClass("reverse out" ),
				"API : close" );

		/* Close the popup by click the screen */
		$('#popupbutton').trigger('vlick') ;
		$(".ui-selectmenu-screen" ).trigger("vclick" );
		ok( popupwindow( widget ).hasClass("ui-selectmenu-hidden" ) || popupwindow( widget ).hasClass("reverse out" ), "Close the popup by click the screen" );

		/* Check Texts */
		if ( widget.find(".ui-popup-text" ) != undefined ) {
			equal( widget.find(".ui-popup-text" ).html( ), "text" );
		}
		if ( widget.find(".ui-popup-title" ) != undefined ) {
			equal( widget.find(".ui-popup-title" ).html( ), "title" );
		}

		buttonList = widget.find(":jqmData(role=button )" ) ;
		equal( buttonList.length, buttoncount, "Button count correct" );

	};

	$("#popupwindow" ).page( );

	test( "Center Title", function ( ) {
		unit_popup( $("#center_title" ), "center_title" , 0 );
	} );
	test( "Center Info", function ( ) {
		unit_popup( $("#center_info" ), "center_info", 0 );
	} );
	test( "Center Basic 1 Button", function ( ) {
		unit_popup( $("#center_basic_1btn" ), "center_basic_1btn" , 1 );
	} );
	test( "Center Title 1 Button", function ( ) {
		unit_popup( $("#center_title_1btn" ), "center_title_1btn" , 1 );
	} );
	test( "Center social style", function ( ) {
		unit_popup( $("#center_social_style1" ), "center_liststyle_2btn" , 2 );
	} );
	test( "center_social_style2", function ( ) {
		unit_popup( $("#center_social_style2" ), "center_title_2btn" , 2 );
	} );
	test( "center_basic_2btn", function ( ) {
		unit_popup( $("#center_basic_2btn" ), "center_basic_2btn" , 2 );
	} );
	test( "center_basic_3btn", function ( ) {
		unit_popup( $("#center_basic_3btn" ), "center_basic_3btn" , 3 );
	} );
	test( "center_title_2btn", function ( ) {
		unit_popup( $("#center_title_2btn" ), "center_title_2btn" , 2 );
	} );
	test( "Center_title_3btn", function ( ) {
		unit_popup( $("#center_title_3btn" ), "center_title_3btn" , 3 );
	} );
	test( "center_button_vertical", function ( ) {
		unit_popup( $("#center_button_vertical" ), "center_button_vertical" , 3 );
	} );
	test( "Center_checkbox", function ( ) {
		unit_popup( $("#center_checkbox" ), "center_checkbox" , 2 );
	} );
	test( "center_liststyle_1btn", function ( ) {
		unit_popup( $("#center_liststyle_1btn" ), "center_liststyle_1btn" , 1 );
	} );
	test( "center_liststyle_2btn", function ( ) {
		unit_popup( $("#center_liststyle_2btn" ), "center_liststyle_2btn" , 2 );
	} );
	test( "center_liststyle_3btn", function ( ) {
		unit_popup( $("#center_liststyle_3btn" ), "center_liststyle_3btn" , 3 );
	} );

} );
