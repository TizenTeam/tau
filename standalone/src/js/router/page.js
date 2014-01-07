//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./../tizen.micro.core",
	"./../tizen.micro.helper",
	"./../var/selectors",
	"./../utils/path.js",
	"./../tizen.micro.router"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

	$.micro.router = $.micro.router || {};
	$.micro.router.rule = $.micro.router.rule || {};

	$.micro.router.rule.page = {

		filter: $.micro.selectors.page,
		
		defaults: {
			transition: undefined
		},

		open: function( to, options ) {
			var $toPage = $(to),
				pageTitle = $.micro.$document[0].title,
				url, state = {}, isFirstpage = false;

			if ( $toPage[0] === $.micro.$firstPage[0] && !options.dataUrl ) {
				options.dataUrl = $.micro.path.documentUrl.hrefNoHash;
				isFirstpage = true;
			}

			url = options.dataUrl && $.micro.path.convertUrlToDataUrl(options.dataUrl) || $toPage.data( "url" );

			pageTitle = $toPage.data( "title" ) || ($toPage.children( ".ui-actionbar" ).find( ".ui-title" ).text()) || pageTitle;
			if( !$toPage.data( "title" ) ) {
				$toPage.data( "title", pageTitle );
			}

			if ( url && !options.fromHashChange ) {

				if ( !$.micro.path.isPath( url ) && url.indexOf( "#" ) < 0 ) {
					url = "#" + url;
				}

				state = $.extend({}, options, {
					url: url
				});

				$.micro.router[ !isFirstpage ? "pushHistory" : "replaceHistory" ]( state, pageTitle, url );
			}

			//set page title
			$.micro.$document[0].title = pageTitle;

			$.micro.pageContainer.pagecontainer("change", $toPage, options);
		},

		onHashChange: function(/* url, state */) {
		}
		
	};

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");