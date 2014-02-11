/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"../core",
	"../helper",
	"../var/selectors",
	"../utils/path.js",
	"../navigator"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

	$.micro.navigator = $.micro.navigator || {};
	$.micro.navigator.rule = $.micro.navigator.rule || {};

	$.micro.navigator.rule.page = {

		filter: $.micro.selectors.page,

		option: function() {
			return {
				transition: $.micro.defaults.pageTransition
			};
		},

		open: function( to, options ) {
			var $toPage = $(to),
				pageTitle = $.micro.$document[0].title,
				url, state = {};

			if ( $toPage[0] === $.micro.$firstPage[0] && !options.dataUrl ) {
				options.dataUrl = $.micro.path.documentUrl.hrefNoHash;
			}

			url = options.dataUrl && $.micro.path.convertUrlToDataUrl(options.dataUrl) || $toPage.data( "url" );

			pageTitle = $toPage.data( "title" ) || ($toPage.children( ".ui-header" ).find( ".ui-title" ).text()) || pageTitle;
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

				$.micro.navigator.history.replace( state, pageTitle, url );
			}

			//set page title
			$.micro.$document[0].title = pageTitle;

			$.micro.pageContainer.pagecontainer("change", $toPage, options);
		},

		onHashChange: function(/* url, state */) {
			return false;
		}

	};

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
