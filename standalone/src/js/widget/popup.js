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
			"pagebeforehide" : $.proxy( this.close, this )
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
			popupContentHeight = Math.floor(contentHeight - headerHeight - footerHeight - borderWidth * 2) + "px";

		element.style.width = contentWidth + "px";
		element.style.height = contentHeight + "px";

		Array.prototype.slice.call( element.querySelectorAll(".ui-popup-content") ).forEach( function (content) {
			content.style.height = popupContentHeight;
			content.style.overflowY = "scroll";
		});
	},

	open: function(/* options */) {
		this.show();
	},

	close: function() {
		this.hide();
	},

	setActive: function(active) {
		this.element[0].classList.toggle("ui-popup-active", active);
	},

	show: function() {
		$.micro.fireEvent(this.element, EventType.BEFORE_SHOW);
		this.setActive(true);
		$.micro.fireEvent(this.element, EventType.SHOW);
	},

	hide: function() {
		$.micro.fireEvent(this.element, EventType.BEFORE_HIDE);
		this.setActive(false);
		$.micro.fireEvent(this.element, EventType.HIDE);
	}

});

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
