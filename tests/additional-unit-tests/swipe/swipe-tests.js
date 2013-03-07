/*
 * swipe unit tests
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 *
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok, asyncTest, expect, start, stop*/
( function ( $ ) {

	module("swipe" );
	var unit_swipe = function ( swipe, type ) {
		var covers,
			cover,
			coverStart,
			item,
			secondSwipe,
			slideLeftDone = function ( ) {
				ok( true, "Animation Complete - sliding left" );
				cover.unbind("animationend" );
				equal( cover.position( ).left, coverStart, "Position - Cover" );
				start( );
			},
			slideRightDone = function ( ) {
				ok( true, "Animation Complete - sliding right" );
				setTimeout( function ( ) {
					cover.unbind("animationend" );
					cover.bind("animationend", slideLeftDone );
					item.trigger("swipeleft" );
				}, 0 );
			};

		if ( type == 'swipe') {
			$("#swipepage" ).page( );
		} else if ( type == 'swipedynamic') {
			$("#swipedynamicpage" ).page( );
		}

		swipe.swipe( );
		ok( swipe.hasClass("ui-swipe" ), "Create - Swipe" );

		covers = swipe.find("div.ui-swipe-item-cover" );
		cover = covers.first( );

		coverStart = cover.position( ).left;
		item = swipe.find("div.ui-swipe-item" ).first( );

		/*API : open , close*/
		cover.unbind("animationend" );
		swipe.swipe('open');
		equal( swipe.swipe('opened'), true, "API : open" );

		swipe.swipe('close');
		equal( swipe.swipe('opened'), false, "API : close" );

		cover.bind("animationend", slideRightDone );
		cover.trigger("swiperight" );
		stop( );

		equal( swipe.find("div.ui-swipe-item" ).length , 1, "Count - Swipeable li" );
		equal( covers.length , 1, "Count - cover" );

		equal( covers.get( 0 ).innerText, "Swipe2", "Check - Cover string value" );

		/*Check other swipe items are closed*/
		secondSwipe = swipe.next( );
		secondSwipe.swipe( ) ;
		if ( secondSwipe ) {
			secondSwipe.swipe('open');
			swipe.swipe('open');
			equal( secondSwipe.swipe('opened'), false, "When one open other swipe elements close." );
		}
	},

		unit_swipe_destroy = function ( swipe, type ) {
			var covers,
				new_page = $("#swipedestorypage" );

			new_page.page( );
			swipe.swipe( );
			ok( swipe.hasClass("ui-swipe" ), "Create - Swipe" );
			covers = swipe.find("div.ui-swipe-item-cover" );
			equal( swipe.find("div.ui-swipe-item" ).length , 1, "Count - Swipeable ui-swipe-item" );

			equal( covers.length , 1, "Count - cover" );

			swipe.swipe("destroy" );
			equal( swipe.has('.ui-swipe').length, 0, "Destroy - swipe" );
			equal( swipe.has('.ui-swipe-item').length, 0 , "Destroy - item" );
			equal( swipe.has('.ui-swipe-item-cover').length, 0, "Destroy - cover" );

		};

	asyncTest( " swipe", function ( ) {
		expect( 10 );
		unit_swipe( $("#swipewidget" ), "swipe" );
		start( );
	} );


	asyncTest( " swipe - destory", function ( ) {
		expect( 6 ) ;
		unit_swipe_destroy( $("#swipedestroy" ), "swipedestroy" ) ;
		start( ) ;
	} );

	asyncTest( " swipe - dynamic", function ( ) {
		expect( 10 );
		var listContentHTML = '<li id= "swipewidgetdynamic" data-role= "swipe">' +
											'<div data-role= "swipe-item">' +
												'<div data-role= "button" data-inline= "true">Twitter</div>' +
												'<div data-role= "button" data-inline= "true">Twitter</div>' +
												'<div data-role= "button" data-inline= "true">Facebook</div>' +
												'<div data-role= "button" data-inline= "true">Facebook</div>' +
											'</div>' +
											'<div data-role= "swipe-item-cover">' +
												'Swipe2' +
											'</div>' +
										'</li>' +
										'<li data-role= "swipe" id= "swipewidget2">' +
											'<div data-role= "swipe-item">' +
												'<div data-role= "button" data-inline= "true">Twitter</div>' +
												'<div data-role= "button" data-inline= "true">Twitter</div>' +
												'<div data-role= "button" data-inline= "true">Facebook</div>' +
												'<div data-role= "button" data-inline= "true">Facebook</div>' +
											'</div>' +
											'<div data-role= "swipe-item-cover">' +
												'Swipe1' +
											'</div>' +
										'</li>';
		$("#swipedynamiclist" ).append( listContentHTML ).trigger("create" ) ;
		unit_swipe( $("#swipewidgetdynamic" ), "swipedynamic" );
		start( ) ;
	} );

} ( jQuery ) ) ;
