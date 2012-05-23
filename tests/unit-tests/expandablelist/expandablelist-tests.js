/**
 * Expandablelist test
 *
 * Youmin Ha <youmin.ha@samsung.com>
 */
( function ( $ ) {
	var DEBUG = true;

	$.mobile.defaultTransition = "none";

	module( "ExpandableList", {
		setup: function ( ) {
			var page = $( 'div#expandablelist-main:jqmData(role="page")' ),
				initHtml = '<form>\
					<div data-role="header">\
						<h1>expandable list</h1>\
					</div>\
					<div data-role="content">\
						<ul data-role="listview" id="list1">\
							<li id="exp1" data-expandable="true" data-initial-expansion="true">exp1</li>\
							<li id="exp1-1" data-expandable="true"  data-expanded-by="exp1" data-initial-expansion="false">exp1-1</li>\
							<li id="exp1-1-1" data-expanded-by="exp1-1">exp1-1-1</li>\
							<li id="exp2" data-expandable="true">exp2</li>\
						</ul>\
					</div>\
				</form>',
				obj;

				if( DEBUG ) {
					page.show( );
				}
				page.append( $( initHtml ) );

				obj = $( ':jqmData(role="listview")' );
				obj.listview( );

				obj = $( ':jqmData(expandable="true")' );
				obj.expandablelist( );
		},
		teardown: function ( ) {
			var page = $( 'div#expandablelist-main:jqmData(role="page")' );
			page.empty( );

			if( DEBUG ) {
				page.hide( );
			}
		}
	} );

	function expandCollapseTest ( ) {
		var transitionTimeout = 1000,
			elist = $( ":jqmData(expandable='true')" ),
			li1,
			li1_1,
			li1_1_1,
			val;

		elist.expandablelist( );
		ok( elist, "expandablelist object creation" );

		li1 = $( "li#exp1" );
		li1_1 = $( "li#exp1-1" );
		li1_1_1 = $( "li#exp1-1-1" );

		val = li1_1.height( );
		console.log( "li1_1's height=" + val );
		notEqual( val, 0, "Expanded listitem with expandable parent having data-initial-expansion=true must be visible (height > 0)" );

		equal( li1_1_1.height(), 0, "Expanded listitem with expandable parent having data-initial-expansion=false must not be visible (height == 0)" );

		li1_1.trigger( 'vclick' );
		setTimeout( function ( ) {
			notEqual( li1_1_1.height( ), 0, "After click, expanded listitem must be visible (height > 0)" );

			li1.trigger( 'vclick' );
			setTimeout( function ( ) {
				// All children must be collapsed when top-level expandable listitem is clicked.
				equal( li1_1.height(), 0, "After click, all children must be collapsed. (height == 0)" );
				equal( li1_1_1.height(), 0, "After click, all children must be collapsed. (height == 0)" );

				start( );
			}, transitionTimeout );

		}, transitionTimeout );
	}

	asyncTest( "Basic expand-collapse test", 6, function ( ) {
		expandCollapseTest( );
	} );

	asyncTest( "style test - checkbox" , 6, function ( ) {
		var li = $( "li#exp1-1" ),
			subitem = $( '<input type="checkbox" id="checkbox1" >' );

		// Prepare
		li.append( subitem );
		li.addClass( 'ui-li-1line-check1' )
			.addClass( 'ui-li-dialogue' );
		subitem.checkboxradio( );
		li.trigger( 'refresh' );

		// Run
		expandCollapseTest( );
	} );

} ) ( jQuery );
