//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./tizen.micro.core",
	"./tizen.micro.helper",
	"./utils/path.js",
	"./router/page",
	"./router/popup",
	"./widget/tizen.micro.page"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

	var $window = $.micro.$window,
		$document = $.micro.$document,
		historyUid = 0,
		currentHistoryUid = 0;
	
	function findClosestLink( ele )	{
		while ( ele ) {
			if ( ( typeof ele.nodeName === "string" ) && ele.nodeName.toLowerCase() === "a" ) {
				break;
			}
			ele = ele.parentNode;
		}
		return ele;
	}

	function linkClickHandler( event ) {
		var link = findClosestLink( event.target ),
			$link = $( link ),
			href, useDefaultUrlHandling, options;

		if ( !link || event.which > 1 ) {
			return;
		}

		href = $link.attr("href");
		useDefaultUrlHandling = $link.is( "[rel='external']" ) || $link.is( "[target]" );
		if(useDefaultUrlHandling) {
			return;
		}

		options = $.micro.getData($link);

		$.micro.router.open(href, options);
		event.preventDefault();
	}

	function popStateHandler( event ) {
		var state = event.originalEvent.state,
			rules = $.micro.router.rule,
			options, to, uid, url;

		if (!state) {
			return;
		}

		uid = state.uid;
		to = state.url;
		options = $.extend({}, state, {
			reverse: currentHistoryUid > uid,
			fromHashChange: true
		});

		currentHistoryUid = uid;
		url = $.micro.path.getLocation();

		$.each(rules, function(name, rule) {
			rule.onHashChange(url, options);
		});

		$.micro.router.open(to, options);

	}

	$.micro.router = $.micro.router || {};
	$.micro.router.rule = $.micro.router.rule || {};

	$.micro.router.defaults = {
		fromHashChange: false,
		reverse: false,
		showLoadMsg: true,
		loadMsgDelay: 0
	};

	$.micro.changePage = function( to, options) {
		$.micro.router.open( to, options );
	};

	$.micro.openPopup = function( to, options) {
		$.micro.router.open( to, $.extend({}, {rel: "popup"}, options) );
	};

	$.micro.back = function() {
		$.micro.router.back();
	};

	$.extend( $.micro.router, {

		register: function( container, firstPage ) {
			this.container = container;
			$.micro.$firstPage = $(firstPage);

			this.linkClickHandler = $.proxy( linkClickHandler, this );
			this.popStateHandler = $.proxy( popStateHandler, this );

			$document.bind({
				"click": this.linkClickHandler,
			});

			$window.bind({
				"popstate": this.popStateHandler
			});

			this.open( $.micro.$firstPage, { transition: undefined } );
		},

		destroy: function () {
			$document.unbind({
				"click": this.linkClickHandler,
			});

			$window.unbind({
				"popstate": this.popStateHandler
			});
		},

		open: function ( to, options ) {
			var rel = options.rel || "page",
				rule = $.micro.router.rule[rel],
				deferred, filter, settings;

			if(rule) {

				settings = $.extend( {
						rel: rel
					},
					$.micro.router.defaults,
					rule.defaults,
					options );
				
				filter = rule.filter;
				
				if ( $.type(to) === "string" ) {

					if(!to.replace(/[#|\s]/g, "")) {
						return;
					}

					deferred = $.Deferred();
					deferred.done(function(url, options, content) {
						rule.open(content, options);
					});
					deferred.fail(function(/* url, options */) {
					});

					this._loadUrl(to, settings, filter, deferred);
					
				} else {
					rule.open(to, settings);
				}

			} else {
				throw new Error("Not defined router rule ["+ rel +"]");
			}

		},

		back: function() {
			$window[0].history.back();
		},

		pushHistory: function(state, pageTitle, url) {
			var newState = $.extend({}, state, {
				uid: historyUid++
			});
			
			currentHistoryUid = newState.uid;
			
			$window[0].history.pushState(newState, pageTitle, url);
		},

		replaceHistory: function(state, pageTitle, url) {
			var newState = $.extend({}, state, {
				uid: currentHistoryUid
			});
			$window[0].history.replaceState(newState, pageTitle, url);
		},

		_loadUrl: function( url, options, filter, deferred) {
			var absUrl = $.micro.path.makeUrlAbsolute( url, this._findBaseWithDefault() ),
				fileUrl = this._createFileUrl( absUrl ),
				content;

			content = this._find( absUrl, filter );

			// If the content we are interested in is already in the DOM,
			// and the caller did not indicate that we should force a
			// reload of the file, we are done. Resolve the deferrred so that
			// users can bind to .done on the promise
			if ( content.length ) {
				deferred.resolve( absUrl, options, content );
				return;
			}

			if ( options.showLoadMsg ) {
				this._showLoading( options.loadMsgDelay );
			}

			// Load the new content.
			$.ajax({
				url: fileUrl,
				type: options.type,
				data: options.data,
				contentType: options.contentType,
				dataType: "html",
				success: this._loadSuccess( absUrl, options, filter, deferred ),
				error: this._loadError( absUrl, options, deferred )
			});
		},

		_loadError: function( absUrl, settings, deferred ) {
			return $.proxy(function(/* xhr, textStatus, errorThrown */) {

				// Remove loading message.
				if ( settings.showLoadMsg ) {
					this._showError();
				}

				deferred.reject( absUrl, settings );

			}, this);
		},

		// TODO it would be nice to split this up more but everything appears to be "one off"
		//      or require ordering such that other bits are sprinkled in between parts that
		//      could be abstracted out as a group
		_loadSuccess: function( absUrl, settings, filter, deferred ) {
			var fileUrl = this._createFileUrl( absUrl );

			return $.proxy(function( html/*, textStatus, xhr */) {
				var content;

				content = this._parse( html, fileUrl, filter );

				// Remove loading message.
				if ( settings.showLoadMsg ) {
					this._hideLoading();
				}

				deferred.resolve( absUrl, settings, content );

			}, this);
		},

		_parse: function( html, fileUrl, filter ) {
			// TODO consider allowing customization of this method. It's very JQM specific
			var page, all = $( "<div></div>" ),
				dataUrl;

			//workaround to allow scripts to execute when included in page divs
			all.get( 0 ).innerHTML = html;

			page = all.find( $.micro.selectors.page )
				.filter( filter )
				.first();

			//if page elem couldn't be found, create one and insert the body element's contents
			if ( !page.length ) {
				page = $( "<div class='ui-page'>" +
					( html.split( /<\/?body[^>]*>/gmi )[1] || "" ) +
					"</div>" );
			}

			dataUrl = $.micro.path.convertUrlToDataUrl(fileUrl);

			// TODO tagging a page with external to make sure that embedded pages aren't
			// removed by the various page handling code is bad. Having page handling code
			// in many places is bad. Solutions post 1.0
			page.attr( "data-url", dataUrl )
				.attr( "data-external-page", true )
				.data( "url", dataUrl );

			return page;
		},

		_find: function( absUrl, filter ) {
			// TODO consider supporting a custom callback
			var fileUrl = this._createFileUrl( absUrl ),
				dataUrl = this._createDataUrl( absUrl ),
				hash = absUrl.replace( /[^#]*#/, "" ),
				page, initialContent = this._getInitialContent();

			if( hash && !$.micro.path.isPath( hash ) ) {
				page = this.container.find( $.micro.path.hashToSelector("#" + hash) );
			}

			// Check to see if the page already exists in the DOM.
			// NOTE do _not_ use the :jqmData pseudo selector because parenthesis
			//      are a valid url char and it breaks on the first occurence
			if ( !page || page.length === 0 ) {
				page = this.container
					.find( "[data-url='" + dataUrl + "']" )
					.filter( filter );
			}

			// If we failed to find the page, check to see if the url is a
			// reference to an embedded page. If so, it may have been dynamically
			// injected by a developer, in which case it would be lacking a
			// data-url attribute and in need of enhancement.
			if ( page.length === 0 && dataUrl && !$.micro.path.isPath( dataUrl ) ) {
				page = this.container
					.find( $.micro.path.hashToSelector("#" + dataUrl) )
					.filter( filter )
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
				$.micro.path.isFirstPageUrl( fileUrl ) &&
				initialContent &&
				initialContent.parent().length ) {
				page = $( initialContent );
			}

			return page;
		},

		_createDataUrl: function( absoluteUrl ) {
			return $.micro.path.convertUrlToDataUrl( absoluteUrl );
		},

		_createFileUrl: function( absoluteUrl ) {
			return $.micro.path.getFilePath( absoluteUrl );
		},

		// TODO the first page should be a property set during _create using the logic
		//      that currently resides in init
		_getInitialContent: function() {
			return $.micro.firstPage;
		},

		// determine the current base url
		_findBaseWithDefault: function() {
			var activePage = this.container.pagecontainer( "getActivePage" ),
				closestBase = ( activePage && $.micro.getClosestBaseUrl( activePage ) );
			return closestBase || $.micro.path.documentBase.hrefNoHash;
		},

		_showLoading: function( delay ) {
			this.container.pagecontainer("showLoading", delay);
		},

		_showError: function() {
			console.debug("load error");
		},

		_hideLoading: function() {

		}
	});

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
