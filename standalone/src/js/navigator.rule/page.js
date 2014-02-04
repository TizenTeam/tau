/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"../ns",
	"../core",
	"../helper",
	"../var/selectors",
	"../utils/path.js",
	"../navigator"], function( jQuery, ns ) {
//>>excludeEnd("microBuildExclude");

(function( $, ns, undefined ) {

	ns.navigator = ns.navigator || {};
	ns.navigator.rule = ns.navigator.rule || {};

	ns.navigator.rule.page = {

		filter: ns.selectors.page,

		option: function() {
			return {
				transition: ns.defaults.pageTransition
			};
		},

		open: function( to, options ) {
			var $toPage = $(to),
				pageTitle = ns.$document[0].title,
				url, state = {};

			if ( $toPage[0] === ns.$firstPage[0] && !options.dataUrl ) {
				options.dataUrl = ns.path.documentUrl.hrefNoHash;
			}

			url = options.dataUrl && ns.path.convertUrlToDataUrl(options.dataUrl) || $toPage.data( "url" );

			pageTitle = $toPage.data( "title" ) || ($toPage.children( ".ui-header" ).find( ".ui-title" ).text()) || pageTitle;
			if( !$toPage.data( "title" ) ) {
				$toPage.data( "title", pageTitle );
			}

			if ( url && !options.fromHashChange ) {

				if ( !ns.path.isPath( url ) && url.indexOf( "#" ) < 0 ) {
					url = "#" + url;
				}

				state = $.extend({}, options, {
					url: url
				});

				ns.navigator.history.replace( state, pageTitle, url );
			}

			//set page title
			ns.$document[0].title = pageTitle;

			ns.pageContainer.pagecontainer("change", $toPage, options);
		},

		onHashChange: function(/* url, state */) {
			return false;
		}

	};

})( jQuery, ns );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
