//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./tizen.micro.core",
	"./tizen.micro.helper",
	"./utils/path.js",
	"./widget/tizen.micro.page"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

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

		useDefaultUrlHandling = $link.is( "[rel='external']" ) || $link.is( "[target]" );
		if(useDefaultUrlHandling) {
			return;
		}

		options = {
			transition: $link.data( "transition" ),
			role: $link.attr( "data-rel" )
		};

		href = $link.attr("href");
		$.micro.router.open(href, options);
		event.preventDefault();
	}

	function popStateHandler( event ) {
		var state = event.originalEvent.state,
			options, to;

		if (!state) {
			return;
		}

		to = state.url;
		options = {
			transition: state.transition,
			fromHashChange: true
		};
		$.micro.router.open(to, options);

	}

	$.micro.router = $.micro.router || {};

	$.micro.router.defaults = {
		transition: undefined,
		reverse: false,
		fromHashChange: false,
		showLoadMsg: true,
		loadMsgDelay: 0
	};

	$.extend( $.micro.router, {

		register: function( container, firstPage ) {
			this.container = container;
			$.micro.$firstPage = $(firstPage);

			this.linkClickHandler = $.proxy( linkClickHandler, this );
			this.popStateHandler = $.proxy( popStateHandler, this );

			$.micro.$document.bind({
				"click": this.linkClickHandler,
			});

			$.micro.$window.bind({
				"popstate": this.popStateHandler
			});

			this.open( $.micro.$firstPage, { transition: undefined } );
		},

		destroy: function () {
			$.micro.$document.unbind({
				"click": this.linkClickHandler,
			});

			$.micro.$window.unbind({
				"popstate": this.popStateHandler
			});
		},

		open: function ( to, options ) {
			var settings = $.extend({}, $.micro.router.defaults, options);

			this._closePop();
			if ( $.type(to) === "string" ) {
				if ( to.indexOf( "#" ) === 0 ) {
					if( $(to).hasClass( "ui-popup" ) ) {
						this._openPop(to, settings);
						return;
					}
				}
				this._loadPage(to, settings);
			} else {
				this._replacePage(to, settings);
			}
		},

		_openPop: function(to, options) {
			var url = $.micro.path.getLocation(),
				state;

			$(to).addClass("ui-state-active");
			if ( !options.fromHashChange ) {

				if(url.indexOf("#") > -1) {
					url += "&" + $.micro.dialogHashKey  + "=" + to.replace("#", "");
				} else {
					url += "#&" + $.micro.dialogHashKey  + "=" + to.replace("#", "");
				}

				state = $.extend({
					url: url,
					transition: options.transition
				}, options);

				$.micro.$window[0].history.pushState(state, "", url);
			}
		},

		_closePop: function() {
			$(".ui-popup.ui-state-active").removeClass("ui-state-active");
		},

		_replacePage: function(toPage, options) {
			var $toPage = $(toPage),
				pageTitle = $.micro.$document[0].title,
				url, state = {};

			if ( $toPage[0] === $.micro.$firstPage[0] && !options.dataUrl ) {
				options.dataUrl = $.micro.path.documentUrl.hrefNoHash;
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

				state = $.extend({
					url: url,
					transition: options.transition
				}, options);

				$.micro.$window[0].history.pushState(state, pageTitle, url);
			}

			//set page title
			$.micro.$document[0].title = pageTitle;

			this.container.pagecontainer("change", toPage, options);
		},

		_loadPage: function( url, options) {
			var absUrl = $.micro.path.makeUrlAbsolute( url, this._findBaseWithDefault() ),
				fileUrl = this._createFileUrl( absUrl ),
				content;

			content = this._find( absUrl );

			// If the content we are interested in is already in the DOM,
			// and the caller did not indicate that we should force a
			// reload of the file, we are done. Resolve the deferrred so that
			// users can bind to .done on the promise
			if ( content.length ) {
				this._replacePage(content, options);
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
				success: this._loadSuccess( absUrl, options ),
				error: this._loadError( absUrl, options )
			});
		},

		_loadError: function( absUrl, settings ) {
			return $.proxy(function(/* xhr, textStatus, errorThrown */) {

				// Remove loading message.
				if ( settings.showLoadMsg ) {
					this._showError();
				}

			}, this);
		},

		// TODO it would be nice to split this up more but everything appears to be "one off"
		//      or require ordering such that other bits are sprinkled in between parts that
		//      could be abstracted out as a group
		_loadSuccess: function( absUrl, settings ) {
			var fileUrl = this._createFileUrl( absUrl );

			return $.proxy(function( html/*, textStatus, xhr */) {
				var content;

				content = this._parse( html, fileUrl );

				this._replacePage(content, settings);

				// Remove loading message.
				if ( settings.showLoadMsg ) {
					this._hideLoading();
				}

			}, this);
		},

		_parse: function( html, fileUrl ) {
			// TODO consider allowing customization of this method. It's very JQM specific
			var page, all = $( "<div></div>" ),
				dataUrl;

			//workaround to allow scripts to execute when included in page divs
			all.get( 0 ).innerHTML = html;

			page = all.find( $.micro.page.prototype.initSelector ).first();

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

		_find: function( absUrl ) {
			// TODO consider supporting a custom callback
			var fileUrl = this._createFileUrl( absUrl ),
				dataUrl = this._createDataUrl( absUrl ),
				page, initialContent = this._getInitialContent();

			// Check to see if the page already exists in the DOM.
			// NOTE do _not_ use the :jqmData pseudo selector because parenthesis
			//      are a valid url char and it breaks on the first occurence
			page = this.container
				.children( "[data-url='" + dataUrl + "']" );

			// If we failed to find the page, check to see if the url is a
			// reference to an embedded page. If so, it may have been dynamically
			// injected by a developer, in which case it would be lacking a
			// data-url attribute and in need of enhancement.
			if ( page.length === 0 && dataUrl && !$.micro.path.isPath( dataUrl ) ) {
				page = this.container.children( $.micro.path.hashToSelector("#" + dataUrl) )
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
