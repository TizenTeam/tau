//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"jquery.ui.widget",
	"./../tizen.micro.core",
	"./../var/selectors"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

var EventType = {

	SHOW: "show",

	HIDE: "hide",

	CREATE: "create",

	BEFORE_CREATE: "beforecreate",

	BEFORE_SHOW: "beforeshow",

	BEFORE_HIDE: "beforehide"
};

$.widget( "micro.popup", {

	options: {
	},

	_create: function() {
		$.micro.fireEvent(this.element, EventType.BEFORE_CREATE);

		this._initLayout();

		this._on(this.window, {
			"resize": $.proxy( this._initLayout, this )
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
		var screenWidth = $(this.window).width(),
			screenHeight = $(this.window).height(),
			paddingTop = window.parseFloat(this.element.css("margin-top")),
			paddingBottom = window.parseFloat(this.element.css("margin-bottom")),
			paddingLeft = window.parseFloat(this.element.css("margin-left")),
			paddingRight = window.parseFloat(this.element.css("margin-right")),
			borderWidth = window.parseFloat(this.element.css("borderWidth")),
			contentWidth = screenWidth - ( paddingLeft + paddingRight + borderWidth*2 ),
			contentHeight = screenHeight - ( paddingTop + paddingBottom + borderWidth*2 ),
			headerHeight = this.element.find(".ui-popup-header").outerHeight(),
			footerHeight = this.element.find(".ui-popup-footer").outerHeight();
		
		this.element
			.css({
				width: contentWidth,
				height: contentHeight
			})
			.find(".ui-popup-content")
				.css({
					"height": contentHeight - headerHeight - footerHeight,
					"overflow-y": "scroll"
				});
	},

	open: function(/* options */) {
		this.show();
	},

	close: function() {
		this.hide();
	},

	setActive: function(active) {
		if(active) {
			this.element.addClass("ui-popup-active");
		} else {
			this.element.removeClass("ui-popup-active");
		}
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