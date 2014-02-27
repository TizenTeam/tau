/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"../ns",
	"jquery.ui.widget",
	"../core",
	"../var/selectors"], function( jQuery, ns ) {
//>>excludeEnd("microBuildExclude");

(function( $, ns, undefined ) {

var EventType = {

	SHOW: "popupshow",

	HIDE: "popuphide",

	CREATE: "popupcreate",

	BEFORE_CREATE: "popupbeforecreate",

	BEFORE_SHOW: "popupbeforeshow",

	BEFORE_HIDE: "popupbeforehide"
};

$.widget( "ui.popup", {

	options: {
	},

	_create: function() {
		ns.fireEvent(this.element, EventType.BEFORE_CREATE);

		this._initLayout();

		this._on(this.window, {
			"resize": $.proxy( this._initLayout, this ),
			"pagebeforehide" : $.proxy( function() {
				this.close({transition: "none"});
			}, this )
		});

		this.closePopup = this.close.bind(this);

		ns.fireEvent(this.element, EventType.CREATE);
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
			paddingTop = parseFloat(elementStyles.paddingTop),
			paddingBottom = parseFloat(elementStyles.paddingBottom),
			borderWidth = parseFloat(elementStyles.borderWidth),
			contentWidth = screenWidth,
			contentHeight = screenHeight,
			header = element.querySelector(".ui-popup-header"),
			footer = element.querySelector(".ui-popup-footer"),
			headerHeight = header && header.offsetHeight || 0,
			footerHeight = footer && footer.offsetHeight || 0,
			popupContentHeight = Math.floor(contentHeight - headerHeight - footerHeight - borderWidth * 2 - (paddingTop + paddingBottom)) + "px",
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
		var toptions = $.extend({}, options, {ext: " in ui-pre-in "}),
			container = document.createElement("div");

		container.classList.add("ui-popup-background");
		container.appendChild(this.element[0].parentElement.replaceChild(container, this.element[0]));

		if ( this.element.hasClass("ui-popup-toast") ) {
			container.addEventListener("click", this.closePopup, false);
		}
		this.background = container;

		ns.fireEvent(this.element, EventType.BEFORE_SHOW);
		this._transition( toptions ).done( $.proxy( function() {
			this._setActive(true);
			ns.fireEvent(this.element, EventType.SHOW);
		}, this));
	},

	close: function( options ) {
		var toptions = $.extend({}, options, {ext: " out reverse "}),
			container = this.background,
			parent = container.parentElement;

		if ( this.element.hasClass("ui-popup-toast") ) {
			container.removeEventListener("click", this.closePopup, false);
		}

		parent = container.parentElement;
		if ( parent ) {
			parent.appendChild(this.element[0]);
			parent.removeChild(container);
		}
		container = null;

		ns.fireEvent(this.element, EventType.BEFORE_HIDE);
		this._transition( toptions ).done( $.proxy( function() {
			this._setActive(false);
			ns.fireEvent(this.element, EventType.HIDE);
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
				ns.pageContainer.removeClass( "ui-viewport-transitioning" );
				$element.removeClass( transitionClass );
				deferred.resolve();
			});

			ns.pageContainer.addClass( "ui-viewport-transitioning" );
			$element.addClass( transitionClass );
		} else {
			window.setTimeout(function() {
				deferred.resolve();
			}, 0);
		}

		return deferred;
	}
});

})( jQuery, ns );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
