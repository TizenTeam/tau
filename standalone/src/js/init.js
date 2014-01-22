//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./core",
	"./navigator",
	"./widget/page",
	"./widget/pagecontainer"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, window, undefined ) {

	// trigger mobileinit event - useful hook for configuring $.mobile settings before they're used
	$.micro.$document.trigger( "mobileinit" );

	$.extend( $.micro, {
		initializePage: function() {
			var $pages = $( $.micro.selectors.page );

			// define first page in dom case one backs out to the directory root (not always the first page visited, but defined as fallback)
			$.micro.firstPage = $pages.first();

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

		if ( $.micro.autoInitializePage ) {
			$.micro.initializePage();
		}
	});

})( jQuery, this );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
