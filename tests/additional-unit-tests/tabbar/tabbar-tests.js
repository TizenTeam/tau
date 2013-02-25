/*
 * tabbar unit tests
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
( function ( $ ) {
	$.mobile.defaultTransition = "none";

	module( "Tabbar" );

	var unit_tabbar = function ( widget, drayStyle ) {
		var tabbar,
			tabbar_style,
			item_count,
			activeIndex,
			deactiveReturn,
			activeReturn,
			ww,
			wh,
			index,
			isLandscape,
			created_tabbar = widget.tabbar( );

		/* Create */
		ok( created_tabbar, "Create" );
		equal( widget.find( "a" ).length, drayStyle.icon.length, "Markup check icons" ) ;
		if ( drayStyle ) {
			if ( drayStyle.icon ) {
				for ( index = 0; index < drayStyle.icon.length; index++ ) {
					equal( widget.find( "a" )[index].getAttribute("data-icon" ), drayStyle.icon[index], "Icon check" );
					equal( widget.find( "a span.ui-btn-text" )[index].innerHTML, drayStyle.text[index], "Text check" );
				}
			}
		}

		/*Markup check*/
		ww = window.innerWidth || $( window ).width( ) ;
		wh = window.innerHeight || $( window ).height( );
		isLandscape = ww > wh && ( ww - wh );

		if ( isLandscape ) {
			equal( widget.hasClass( "ui-landscape-tabbar" ), true, "Markup check layout" );
		} else {
			equal( widget.hasClass( "ui-portrait-tabbar" ), true, "Markup check layout" );
		}


		/* Check APIs */
		activeIndex = created_tabbar.find(".ui-btn-active" ).index( );
		created_tabbar.tabbar( "disable", activeIndex );
		deactiveReturn = created_tabbar.find("li:eq(" + activeIndex + " )" ).is(".ui-disabled" );

		equal( deactiveReturn, true, "List Deactive test" );

		created_tabbar.tabbar("enable", activeIndex );
		activeReturn = created_tabbar.find("li:eq(" + activeIndex + " )" ).is(".ui-disabled" );
		equal( activeReturn, false, "List Active test" );
	};

	test( "tabbar text style test - footer", function ( ) {
		unit_tabbar( $("#tabbar-test-text-only" ), {icon : ['delete', 'forward', 'plus', 'back', 'search'], text : ["Menu", "Save", "Share", "Timeline", "WorldClock"]} );
	} );

	test( "tabbar text style test - header", function ( ) {
		unit_tabbar( $("#tabbar-test-text-only-header" ), {icon : ['delete', 'forward', 'plus', 'back', 'search'], text : ["Menu", "Save", "Share", "Timeline", "WorldClock"]} );
	} );

	test( "tabbar text style test - footer - Dynamic", function ( ) {

		$('#abbar-test-text-only').remove( );
		var VirtualMarkup = '<div id= "tabbar-test-text-only" data-role= "tabbar">' +
											'<ul>' +
												'<li><a href= "#" data-icon= "delete">Menu</a></li>' +
												'<li><a href= "#" class= "ui-btn-active" data-icon= "forward">Save</a></li>' +
												'<li><a href= "#" data-icon= "plus">Share</a></li>' +
												'<li><a href= "#" data-icon= "Back">Timeline</a></li>' +
												'<li><a href= "#" data-icon= "search"WorldClock</a></li>' +
											'</ul>' +
										'</div>';
		$('#tabbarfooter').append( VirtualMarkup ).trigger("create" );
		unit_tabbar( $("#tabbar-test-text-only" ), {icon : ['delete', 'forward', 'plus', 'back', 'search'], text : ["Menu", "Save", "Share", "Timeline", "WorldClock"]} );
	} );

	test( "tabbar text style test- header - Dynamic", function ( ) {

		$('#abbar-test-text-only-header').remove( );
		var VirtualMarkup = '<div id= "tabbar-test-text-only-header" data-role= "tabbar">' +
											'<ul>' +
												'<li><a href= "#" data-icon= "delete">Menu</a></li>' +
												'<li><a href= "#" class= "ui-btn-active" data-icon= "forward">Save</a></li>' +
												'<li><a href= "#" data-icon= "plus">Share</a></li>' +
												'<li><a href= "#" data-icon= "Back">Timeline</a></li>' +
												'<li><a href= "#" data-icon= "search"WorldClock</a></li>' +
											'</ul>' +
										'</div>';
		$('#tabbarheader').append( VirtualMarkup ).trigger("create" );
		unit_tabbar( $("#tabbar-test-text-only-header" ), {icon : ['delete', 'forward', 'plus', 'back', 'search'], text : ["Menu", "Save", "Share", "Timeline", "WorldClock"]} );
	} );
} ( jQuery ) );
