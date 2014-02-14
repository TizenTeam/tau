/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./ns",
	"./core",
	"./helper",
	"./utils/path.js"], function( jQuery, ns ) {
//>>excludeEnd("microBuildExclude");

(function( $, ns, undefined ) {

	var $window = ns.$window,
		$document = ns.$document,
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

		options = ns.getData($link);

		event.preventDefault();
		ns.navigator.open(href, options);
	}

	function popStateHandler( event ) {
		var state = event.originalEvent.state,
			prevState = ns.navigator.history.activeState,
			rules = ns.navigator.rule,
			options, to, url, isContinue = true, reverse, transition;

		if (!state) {
			return;
		}

		to = state.url;
		reverse = ns.navigator.history.getDirection( state ) === "back";
		transition = !reverse ? state.transition : prevState && prevState.transition || "none";

		options = $.extend({}, state, {
			reverse: reverse,
			transition: transition,
			fromHashChange: true
		});

		url = ns.path.getLocation();
		$.each(rules, function(name, rule) {
			if ( rule.onHashChange(url, options) ) {
				isContinue = false;
			}
		});

		ns.navigator.history.setActive(state);

		if ( isContinue ) {
			ns.navigator.open(to, options);
		}

	}

	ns.navigator = ns.navigator || {};
	ns.navigator.rule = ns.navigator.rule || {};

	ns.navigator.defaults = {
		fromHashChange: false,
		volatileRecord: false,
		reverse: false,
		showLoadMsg: true,
		loadMsgDelay: 0
	};

	ns.changePage = function( to, options) {
		ns.navigator.open( to, options );
	};

	ns.openPopup = function( to, options) {
		ns.navigator.open( to, $.extend({}, {rel: "popup"}, options) );
	};

	ns.closePopup = function() {
		ns.back();
	};

	ns.back = function() {
		ns.navigator.history.back();
	};

	$.extend( ns.navigator, {

		register: function( container ) {
			this.container = container;

			this.linkClickHandler = $.proxy( linkClickHandler, this );
			this.popStateHandler = $.proxy( popStateHandler, this );

			$document.bind({
				"click": this.linkClickHandler,
			});

			$window.bind({
				"popstate": this.popStateHandler
			});

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
				rule = ns.navigator.rule[rel],
				deferred, filter, settings;

			if(rule) {

				settings = $.extend( {
						rel: rel
				}, ns.navigator.defaults, rule.option(), options );

				filter = rule.filter;

				deferred = $.Deferred();
				deferred.done( function( options, content ) {
					rule.open( content, options );
				});
				deferred.fail(function( options ) {
					rule.onOpenFailed( options );
					ns.fireEvent(ns.pageContainer, "changefailed", options);
				});

				if ( $.type(to) === "string" ) {

					if ( !to.replace( /[#|\s]/g, "" ) ) {
						return;
					}

					this._loadUrl(to, settings, rule, deferred);

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

		_loadUrl: function( url, options, rule, deferred) {
			var absUrl = ns.path.makeUrlAbsolute( url, ns.path.parseLocation() ),
				content, detail;

			content = rule.find( absUrl );

			if ( ( !content || content.length === 0 ) &&
					ns.path.isEmbedded( absUrl ) ) {
				deferred.reject( detail );
				return;
			}

			// If the content we are interested in is already in the DOM,
			// and the caller did not indicate that we should force a
			// reload of the file, we are done. Resolve the deferrred so that
			// users can bind to .done on the promise
			if ( content && content.length ) {
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
				success: this._loadSuccess( absUrl, options, rule, deferred ),
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

				ns.fireEvent(this.container, "loadfailed", detail);
				deferred.reject( detail );

			}, this);
		},

		// TODO it would be nice to split this up more but everything appears to be "one off"
		//      or require ordering such that other bits are sprinkled in between parts that
		//      could be abstracted out as a group
		_loadSuccess: function( absUrl, settings, rule, deferred ) {
			var detail = $.extend({url: absUrl}, settings);

			return $.proxy(function( html/*, textStatus, xhr */) {
				var content;

				content = rule.parse( html, absUrl );

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

		_showLoading: function( delay ) {
			this.container.pagecontainer("showLoading", delay);
		},

		_showError: function() {

		},

		_hideLoading: function() {

		}
	});

	ns.navigator.history = {
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

})( jQuery, ns );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
