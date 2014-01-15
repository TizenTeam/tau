//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"jquery.ui.widget",
	"../core",
	"./page"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

var EventType = {
		PAGE_CHANGE: "pagechange",
	};

$.widget( "micro.pagecontainer", {

	options: {
	},

	_create: function() {
		this.activePage = null;
	},

	_destroy: function() {
	},

	_init: function() {
	},

	_include: function( page ) {
		$(page).prependTo( this.element ).page();
	},

	change: function (toPage, options ) {
		var fromPage = this.getActivePage();

		options = options || {};

		if ( $(fromPage).length && $(toPage)[0] === $(fromPage)[0] ) {
			return;
		}

		this._include(toPage);

		if (fromPage) {
			fromPage.page("onBeforeHide");
		}
		toPage.page("onBeforeShow");

		options.deferred = $.Deferred();
		this._transition(toPage, fromPage, options);
		options.deferred.done( $.proxy( function() {
			this._setActivePage(toPage);
			if ( fromPage ) {
				fromPage.page("onHide");
				this._removeExternalPage();
			}
			toPage.page("onShow");
			$.micro.fireEvent(this.element, EventType.PAGE_CHANGE);
		}, this ) );

	},

	_transition: function( to, from, options) {
		var $element = this.element,
			transition = !from ? "none" : options.transition,
			deferred = options.deferred,
			reverse = options.reverse ? " reverse " : "",
			clearClass = " in out ui-pre-in " + transition + reverse;

		$element.addClass( "ui-viewport-transitioning" );
		deferred.done(function() {
			$element.removeClass( "ui-viewport-transitioning" );
			$(from).removeClass( clearClass );
			$(to).removeClass( clearClass );
		});

		if (transition !== "none") {
			$(options.reverse ? from : to).one("animationend webkitAnimationEnd", function() {
				deferred.resolve();
			});

			if (from) {
				$(from).addClass( transition + " out " + reverse );
			}

			// TODO why needs timeout??
			// if it make without timeout, it has some bugs when call external page or press forward button on browser.
			window.setTimeout(function() {
				$(to).addClass( transition + " in ui-pre-in " + reverse );
			}, 0);
		} else {
			window.setTimeout(function() {
				deferred.resolve();
			}, 0);
		}

	},

	_setActivePage: function(page) {
		if ( this.activePage ) {
			this.activePage.page("setActive", false);
		}
		this.activePage = page;
		this.activePage.page("setActive", true);
	},

	getActivePage: function() {
		return this.activePage;
	},

	showLoading: function(/* delay */) {
	},

	_removeExternalPage: function() {
		this.element
			.find( $.micro.selectors.page )
			.filter( "[data-external=true]" )
			.not(this.getActivePage())
			.remove();
	}
});

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
