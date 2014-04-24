/*
 * Unit Test: FastScroll
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("FastScroll");

	var unit_fastscroll = function ( list ) {
		var widget,
			shortcut,
			divider,
			indexString = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z:ㄱ,ㄴ,ㄷ,ㄹ,ㅁ,ㅂ,ㅅ,ㅇ,ㅈ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ" ;

		widget = list.parents(".ui-content").parent().find(".ui-fastscroll");

		/* Create */
		ok( widget.hasClass("ui-fastscroll"), "Create" );

		shortcut = widget.find("li");
		divider = list.find(".ui-li-divider");

		/* Shortcuts */
		for ( i = 0; i < divider.length; i++ ) {
			equal( $( divider[i] ).text(), $( shortcut[i + 1] ).text(), "Shortcut");
		}

		/* indexString */
		list.fastscroll( "indexString", indexString );
		equal( list.fastscroll( "indexString" ), indexString, "indexString" );
	};

	test( "shortcut", function () {
		unit_fastscroll( $("#shortcut") );
	});

}( jQuery ));
