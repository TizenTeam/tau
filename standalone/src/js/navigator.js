/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./core",
	"./helper",
	"./utils/path.js",
	"./navigator.rule/page",
	"./navigator.rule/popup",
	"./widget/page"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

	var $window = $.micro.$window,
		$document = $.micro.$document,
		historyUid = 0,
		historyActiveIndex = 0,
		historyVolatileMode = false;

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

		event.preventDefault();
		$.micro.navigator.open(href, options);
	}

	function popStateHandler( event ) {
		var state = event.originalEvent.state,
			prevState = $.micro.navigator.history.activeState,
			rules = $.micro.navigator.rule,
			options, to, url, isContinue = true, reverse, transition;

		if (!state) {
			return;
		}

		to = state.url;
		reverse = $.micro.navigator.history.getDirection( state ) === "back";
		transition = !reverse ? state.transition : prevState && prevState.transition || "none";

		options = $.extend({}, state, {
			reverse: reverse,
			transition: transition,
			fromHashChange: true
		});

		url = $.micro.path.getLocation();
		$.each(rules, function(name, rule) {
			if ( rule.onHashChange(url, options) ) {
				isContinue = false;
			}
		});

		$.micro.navigator.history.setActive(state);

		if ( isContinue ) {
			$.micro.navigator.open(to, options);
		}

	}

	$.micro.navigator = $.micro.navigator || {};
	$.micro.navigator.rule = $.micro.navigator.rule || {};

	$.micro.navigator.defaults = {
		fromHashChange: false,
		volatileRecord: false,
		reverse: false,
		showLoadMsg: true,
		loadMsgDelay: 0
	};

	$.micro.changePage = function( to, options) {
		$.micro.navigator.open( to, options );
	};

	$.micro.openPopup = function( to, options) {
		$.micro.navigator.open( to, $.extend({}, {rel: "popup"}, options) );
	};

	$.micro.closePopup = function() {
		$.micro.back();
	};

	$.micro.back = function() {
		$.micro.navigator.history.back();
	};

	$.extend( $.micro.navigator, {

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

			$.micro.navigator.history.enableVolatileRecord();
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
			var rel = options && options.rel || "page",
				rule = $.micro.navigator.rule[rel],
				deferred, filter, settings;

			if(rule) {

				settings = $.extend( {
						rel: rel
				}, $.micro.navigator.defaults, rule.option(), options );

				filter = rule.filter;

				deferred = $.Deferred();
				deferred.done( function( options, content ) {
					rule.open( content, options );
				});
				deferred.fail(function( options ) {
					$.micro.fireEvent($.micro.pageContainer, "changefailed", options);
				});

				if ( $.type(to) === "string" ) {

					if(!to.replace(/[#|\s]/g, "")) {
						return;
					}

					this._loadUrl(to, settings, filter, deferred);

				} else {
					if( $(to).filter(filter).length ) {
						deferred.resolve( settings, to );
					} else {
						deferred.reject( settings );
					}
				}

			} else {
				throw new Error("Not defined navigator rule ["+ rel +"]");
			}

		},

		_loadUrl: function( url, options, filter, deferred) {
			var absUrl = $.micro.path.makeUrlAbsolute( url, $.micro.path.getLocation() ),
				content, detail;

			content = this._find( absUrl, filter );
			// If the content we are interested in is already in the DOM,
			// and the caller did not indicate that we should force a
			// reload of the file, we are done. Resolve the deferrred so that
			// users can bind to .done on the promise
			if ( content.length ) {
				detail = $.extend({absUrl: absUrl}, options);
				deferred.resolve( detail, content );
				return;
			}

			if ( options.showLoadMsg ) {
				this._showLoading( options.loadMsgDelay );
			}

			// Load the new content.
			$.ajax({
				url: absUrl,
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
				var detail = $.extend({url: absUrl}, settings);

				// Remove loading message.
				if ( settings.showLoadMsg ) {
					this._showError();
				}

				$.micro.fireEvent(this.container, "loadfailed", detail);
				deferred.reject( detail );

			}, this);
		},

		// TODO it would be nice to split this up more but everything appears to be "one off"
		//      or require ordering such that other bits are sprinkled in between parts that
		//      could be abstracted out as a group
		_loadSuccess: function( absUrl, settings, filter, deferred ) {
			var dataUrl = this._createDataUrl( absUrl ),
				detail = $.extend({url: absUrl}, settings);

			return $.proxy(function( html/*, textStatus, xhr */) {
				var content;

				content = this._parse( html, dataUrl, filter );

				// Remove loading message.
				if ( settings.showLoadMsg ) {
					this._hideLoading();
				}

				if( $(content).length ) {
					deferred.resolve( detail, content );
				} else {
					deferred.reject( detail );
				}

			}, this);
		},

		_parse: function( html, dataUrl, filter ) {
			// TODO consider allowing customization of this method. It's very JQM specific
			var page, all = $( "<div></div>" );

			//workaround to allow scripts to execute when included in page divs
			all.get( 0 ).innerHTML = html;

			page = all.find( filter ).first();

			// TODO tagging a page with external to make sure that embedded pages aren't
			// removed by the various page handling code is bad. Having page handling code
			// in many places is bad. Solutions post 1.0
			page.attr( "data-url", dataUrl )
				.attr( "data-external", true )
				.data( "url", dataUrl );

			return page;
		},

		_find: function( absUrl, filter ) {
			// TODO consider supporting a custom callback
			var dataUrl = this._createDataUrl( absUrl ),
				page, initialContent = this._getInitialContent();

			// Check to see if the page already exists in the DOM.
			// NOTE do _not_ use the :jqmData pseudo selector because parenthesis
			//      are a valid url char and it breaks on the first occurence
			page = this.container
				.find( filter )
				.filter( "[data-url='" + dataUrl + "']" );

			// If we failed to find the page, check to see if the url is a
			// reference to an embedded page. If so, it may have been dynamically
			// injected by a developer, in which case it would be lacking a
			// data-url attribute and in need of enhancement.
			if ( page.length === 0 && dataUrl && !$.micro.path.isPath( dataUrl ) ) {
				page = this.container
					.find( filter )
					.filter( $.micro.path.hashToSelector("#" + dataUrl) )
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
				$.micro.path.isFirstPageUrl( dataUrl ) &&
				initialContent &&
				initialContent.parent().length ) {
				page = $( initialContent ).filter( filter );
			}

			return page;
		},

		_createDataUrl: function( absoluteUrl ) {
			return $.micro.path.convertUrlToDataUrl( absoluteUrl );
		},

		// TODO the first page should be a property set during _create using the logic
		//      that currently resides in init
		_getInitialContent: function() {
			return $.micro.firstPage;
		},

		_showLoading: function( delay ) {
			this.container.pagecontainer("showLoading", delay);
		},

		_showError: function() {

		},

		_hideLoading: function() {

		}
	});

	$.micro.navigator.history = {
		activeState : null,

		replace: function(state, pageTitle, url) {
			var newState = $.extend({}, state, {
				uid: historyVolatileMode ? historyActiveIndex : ++historyUid
			});

			$window[0].history[ historyVolatileMode ? "replaceState" : "pushState" ](newState, pageTitle, url);

			this.setActive(newState);
		},

		back: function() {
			$window[0].history.back();
		},

		setActive: function( state ) {
			if ( state ) {
				this.activeState = state;
				historyActiveIndex = state.uid;

				if(state.volatileRecord) {
					this.enableVolatileRecord();
					return;
				}
			}

			this.disableVolatileMode();
		},

		getDirection: function( state ) {
			var direction;

			if ( state ) {
				direction = state.uid < historyActiveIndex ? "back" : "forward";
				return direction;
			}

			return "back";
		},

		enableVolatileRecord: function() {
			historyVolatileMode = true;
		},

		disableVolatileMode: function() {
			historyVolatileMode = false;
		},
	};

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
