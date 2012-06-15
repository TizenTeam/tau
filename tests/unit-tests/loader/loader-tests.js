/**
 * Loader test
 *
 * Youmin Ha <youmin.ha@samsung.com>
 *
 */
( function ( $ ) {
	$.mobile.defaultTransition = "none";

	module( "Loader" );

	var tizen = $.tizen.__tizen__;

	test( "util.getScaleFactor()", function ( ) {
		var util = tizen.util,
			expected = 1,
			defaultWidth = 720;

		if( window.scale ) {
			expected = window.scale;
		} else {
			expected = screen.width / defaultWidth;
			if( expected > 1 ) {	// Don't allow expansion
				expected = 1;
			}
		}

		// Test value
		equal( util.getScaleFactor( ), expected, "Scale factor value should calculated properly." );
	} );

	test( "util.isMobileBrowser()", function ( ) {
		var appVersion = window.navigator.appVersion,
			mobile = appVersion.match( "Mobile" ),
			isMobile = mobile ? true : false;

		equal( tizen.util.isMobileBrowser(), isMobile, "Mobile browser must be detected." );

		/* NOTE:
		 * Is this test OK? How are both cases(mobile/non-mobile) tested?
		 */
	} );

	test( "css.addElementToHead()", function ( ) {
		var css = tizen.css,
			scarecrow = $( '<meta name="scarecrow" />' ),
			selected;

		css.addElementToHead( scarecrow );
		/*
		console.log('2');
		selected = $('head').children('meta[name=scarecrow]');
		console.log('3');
		console.dir(selected);
		ok( selected.length > 0, 'Object must be added to header.' );
		*/
	} );

} ) ( jQuery );

