/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"jquery.ui.widget",
	"../core",
	"../var/selectors"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

var EventType = {

	SHOW: "popupshow",

	HIDE: "popuphide",

	CREATE: "popupcreate",

	BEFORE_CREATE: "popupbeforecreate",

	BEFORE_SHOW: "popupbeforeshow",

	BEFORE_HIDE: "popupbeforehide"
};

$.widget( "micro.popup", {

	options: {
	},

	_create: function() {
		$.micro.fireEvent(this.element, EventType.BEFORE_CREATE);

		this._initLayout();

		this._on(this.window, {
			"resize": $.proxy( this._initLayout, this ),
			"pagebeforehide" : $.proxy( function() {
				this.close({transition: "none"});
			}, this )
		});

		$.micro.fireEvent(this.element, EventType.CREATE);
	},

	_destroy: function() {
	},

	_init: function() {
	},

	_getCreateOptions: function() {
	},

	_initLayout: function() {
		var element = this.element[0],
			globalWindow = window,
			screenWidth = globalWindow.innerWidth,
			screenHeight = globalWindow.innerHeight,
			elementStyles = globalWindow.getComputedStyle( element ),
			paddingTop = parseFloat(elementStyles.marginTop),
			paddingBottom = parseFloat(elementStyles.marginBottom),
			paddingLeft = parseFloat(elementStyles.marginLeft),
			paddingRight = parseFloat(elementStyles.marginRight),
			borderWidth = parseFloat(elementStyles.borderWidth),
			contentWidth = screenWidth - ( paddingLeft + paddingRight ),
			contentHeight = screenHeight - ( paddingTop + paddingBottom ),
			header = element.querySelector(".ui-popup-header"),
			footer = element.querySelector(".ui-popup-footer"),
			headerHeight = header && header.offsetHeight || 0,
			footerHeight = footer && footer.offsetHeight || 0,
			popupContentHeight = Math.floor(contentHeight - headerHeight - footerHeight - borderWidth * 2) + "px",
			isToast = element.classList.contains("ui-popup-toast"),
			isDisplayNone = window.getComputedStyle(element).display === "none";

		if ( isDisplayNone ) {
			element.style.visibility = "hidden";
			element.style.display = "block";
		}

		element.style.width = contentWidth + "px";

		if (!isToast) {
			element.style.height = contentHeight + "px";

			Array.prototype.slice.call( element.querySelectorAll(".ui-popup-content") ).forEach( function (content) {
				content.style.height = popupContentHeight;
				content.style.overflowY = "scroll";
			});
		}

		if ( isDisplayNone ) {
			element.style.display = "";
			element.style.visibility = "";
		}
	},

	open: function( options ) {
		var toptions = $.extend({}, options, {ext: " in ui-pre-in "});

		$.micro.fireEvent(this.element, EventType.BEFORE_SHOW);
		this._transition( toptions ).done( $.proxy( function() {
			this._setActive(true);
			$.micro.fireEvent(this.element, EventType.SHOW);
		}, this));
	},

	close: function( options ) {
		var toptions = $.extend({}, options, {ext: " out reverse "});

		$.micro.fireEvent(this.element, EventType.BEFORE_HIDE);
		this._transition( toptions ).done( $.proxy( function() {
			this._setActive(false);
			$.micro.fireEvent(this.element, EventType.HIDE);
		}, this));
	},

	_setActive: function(active) {
		this.element[0].classList.toggle("ui-popup-active", active);
	},

	_transition: function( options ) {
		var deferred = $.Deferred(),
			transition = options.transition || this.options.transition,
			transitionClass = transition + options.ext,
			$element = this.element;

		if(transition !== "none") {
			$element.one("animationend webkitAnimationEnd", function() {
				$.micro.pageContainer.removeClass( "ui-viewport-transitioning" );
				$element.removeClass( transitionClass );
				deferred.resolve();
			});

			$.micro.pageContainer.addClass( "ui-viewport-transitioning" );
			$element.addClass( transitionClass );
		} else {
			window.setTimeout(function() {
				deferred.resolve();
			}, 0);
		}

		return deferred;
	}
});

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
