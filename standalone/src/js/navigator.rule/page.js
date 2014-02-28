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

	var baseElement;

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

			if ( $toPage[0] === ns.firstPage[0] && !options.dataUrl ) {
				url = ns.path.documentUrl.hrefNoHash;
			} else {
				url = $toPage.data( "url" );
			}

			pageTitle = $toPage.data( "title" ) || ($toPage.children( ".ui-header" ).find( ".ui-title" ).text()) || pageTitle;
			if( !$toPage.data( "title" ) ) {
				$toPage.data( "title", pageTitle );
			}

			if ( url && !options.fromHashChange ) {

				if ( !ns.path.isPath( url ) && url.indexOf( "#" ) < 0 ) {
					url = ns.path.makeUrlAbsolute( "#" + url, ns.path.documentUrl.hrefNoHash );
				}

				state = $.extend({}, options, {
					url: url
				});

				ns.navigator.history.replace( state, pageTitle, url );
			}

			// write base element
			this._setBase( ns.path.parseLocation().hrefNoSearch );

			//set page title
			ns.$document[0].title = pageTitle;

			ns.pageContainer.pagecontainer("change", $toPage, options);
		},

		onOpenFailed: function(/* options */) {
			this._setBase( ns.path.parseLocation().hrefNoSearch );
		},

		onHashChange: function(/* url, state */) {
			return false;
		},

		find: function( absUrl ) {
			var dataUrl = this._createDataUrl( absUrl ),
				initialContent = ns.firstPage,
				pageContainer = ns.pageContainer,
				page;

			if ( /#/.test( absUrl ) && ns.path.isPath(dataUrl) ) {
				return;
			}

			// Check to see if the page already exists in the DOM.
			// NOTE do _not_ use the :jqmData pseudo selector because parenthesis
			//      are a valid url char and it breaks on the first occurence
			page = pageContainer
						.children( this.filter )
						.filter( "[data-url='" + dataUrl + "']" );

			// If we failed to find the page, check to see if the url is a
			// reference to an embedded page. If so, it may have been dynamically
			// injected by a developer, in which case it would be lacking a
			// data-url attribute and in need of enhancement.
			if ( page.length === 0 && dataUrl && !ns.path.isPath( dataUrl ) ) {
				page = pageContainer
					.children( this.filter )
					.filter( ns.path.hashToSelector("#" + dataUrl) )
					.attr( "data-url", dataUrl )
					.data( "url", dataUrl );
			}

			// If we failed to find a page in the DOM, check the URL to see if it
			// refers to the first page in the application. Also check to make sure
			// our cached-first-page is actually in the DOM. Some user deployed
			// apps are pruning the first page from the DOM for various reasons.
			// We check for this case here because we don't want a first-page with
			// an id falling through to the non-existent embedded page error case.
			if ( page.length === 0 &&
				ns.path.isFirstPageUrl( dataUrl ) &&
				initialContent &&
				initialContent.parent().length ) {
				page = $( initialContent );
			}

			return page;
		},

		parse: function( html, absUrl ) {
			var dataUrl = this._createDataUrl( absUrl ),
				page, all = $( "<div></div>" );

			// write base element
			this._setBase(dataUrl);

			//workaround to allow scripts to execute when included in page divs
			all.get( 0 ).innerHTML = html;

			page = all.find( this.filter ).first();

			// TODO tagging a page with external to make sure that embedded pages aren't
			// removed by the various page handling code is bad. Having page handling code
			// in many places is bad. Solutions post 1.0
			page.attr( "data-url", dataUrl )
				.attr( "data-external", true )
				.data( "url", dataUrl );

			return page;
		},

		_createDataUrl: function( absoluteUrl ) {
			return ns.path.convertUrlToDataUrl( absoluteUrl, true );
		},

		_getBaseElement: function() {
			if ( !baseElement ) {
				baseElement = $( "head" ).children( "base" );
				baseElement = baseElement.length ? baseElement :
					$( "<base>", { href: ns.path.documentBase.hrefNoHash } ).prependTo( $( "head" ) );
			}
			return baseElement;
		},

		_setBase: function( url ) {
			var base = this._getBaseElement(),
				baseHref = base.attr("href");

			if ( ns.path.isPath( url ) ) {
				url = ns.path.makeUrlAbsolute( url, ns.path.documentBase );
				if ( ns.path.parseUrl(baseHref).hrefNoSearch !== ns.path.parseUrl(url).hrefNoSearch ) {
					base.attr( "href", url );
				}
			}
		}

	};

})( jQuery, ns );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
