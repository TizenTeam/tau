//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./core",
	"./navigator",
	"./widget/page",
	"./widget/pagecontainer",
	"./widget/indexScrollbar",
	"./utils/anchorHighlightController"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, window, undefined ) {

	// trigger mobileinit event - useful hook for configuring $.mobile settings before they're used
	$.micro.$document.trigger( "mobileinit" );

	$.extend( $.micro, {
		initializePage: function() {
			var $pages = $( $.micro.selectors.activePage );

			// define first page in dom case one backs out to the directory root (not always the first page visited, but defined as fallback)
			if( !$pages.length ) {
				$pages = $( $.micro.selectors.page );
			}
			$.micro.firstPage = $pages.first();

			// set data-url attrs
			$pages.each(function() {
				var $this = $( this );

				// unless the data url is already set set it to the pathname
				if ( !$this[ 0 ].getAttribute( "data-url" ) ) {
					$this.attr( "data-url", $this.attr( "id" ) || location.pathname + location.search );
				}
			});

			// define page container
			$.micro.pageContainer = $.micro.firstPage.parent().pagecontainer();

			// alert listeners that the pagecontainer has been determined for binding
			// to events triggered on it
			$.micro.$window.trigger( "pagecontainercreate" );

			$.micro.navigator.register($.micro.pageContainer, $.micro.firstPage);
		}
	});

	$(function() {
		window.scrollTo( 0, 1 );

		if ( $.micro.defaults.autoInitializePage ) {
			$.micro.initializePage();
		}
	});

})( jQuery, this );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
