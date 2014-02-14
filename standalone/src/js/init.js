/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./ns",
	"./core",
	"./navigator",
	"./navigator.rule/page",
	"./navigator.rule/popup",
	"./widget/pagecontainer",
	"./widget/indexScrollbar",
	"./utils/anchorHighlightController"], function( jQuery, ns ) {
//>>excludeEnd("microBuildExclude");

(function( $, ns, window, undefined ) {

	// trigger mobileinit event - useful hook for configuring $.mobile settings before they're used
	ns.$document.trigger( "mobileinit" );

	$.extend( ns, {
		initializePage: function() {
			var $pages = $( ns.selectors.activePage ),
				hash = ns.path.stripQueryParams(location.hash);

			// define first page in dom case one backs out to the directory root (not always the first page visited, but defined as fallback)
			if( !$pages.length ) {
				$pages = $( ns.selectors.page );
			}
			ns.firstPage = $pages.first();

			// define page container
			ns.pageContainer = ns.firstPage.parent().pagecontainer();

			// set data-url attrs
			$pages.each(function() {
				var $this = $( this );

				// unless the data url is already set set it to the pathname
				if ( !$this[ 0 ].getAttribute( "data-url" ) ) {
					$this.attr( "data-url", $this.attr( "id" ) || location.pathname + location.search );
				}
			});

			ns.navigator.register(ns.pageContainer);
			ns.navigator.history.enableVolatileRecord();

			if ( $( hash ).is( ns.selectors.page ) ) {
				ns.changePage( $( hash ) );
			} else {
				ns.changePage( ns.firstPage );
			}
		}
	});

	$(function() {
		window.scrollTo( 0, 1 );

		if ( ns.defaults.autoInitializePage ) {
			ns.initializePage();
		}
	});

})( jQuery, ns, this );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
