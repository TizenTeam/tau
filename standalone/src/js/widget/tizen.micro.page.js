//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"jquery.ui.widget",
	"./../tizen.micro.core",
	"./../var/selectors"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

var EventType = {

	SHOW: "pageshow",

	HIDE: "pagehide",

	CREATE: "pagecreate",

	BEFORE_CREATE: "pagebeforecreate",

	BEFORE_SHOW: "pagebeforeshow",

	BEFORE_HIDE: "pagebeforehide"
};

$.widget( "micro.page", {

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
		var slice = [].slice,
			element = this.element[0],
			microSelectors = $.micro.selectors,
			hscroll = slice.call( document.querySelectorAll( microSelectors.pageScroll ) ),
			sections = slice.call( element.querySelectorAll( microSelectors.section ) ),
			sectionLength = sections.length,
			screenWidth = window.innerWidth,
			screenHeight = window.innerHeight,
			hscrollWidth;

		element.style.overflowY = "hidden";
		element.style.width = screenWidth + "px";
		element.style.height = screenHeight + "px";

		slice.call( element.querySelectorAll( microSelectors.content ) ).forEach(function (content) {
			var contentStyle = window.getComputedStyle(content),
				marginTop = parseFloat(contentStyle.marginTop),
				paddingTop = parseFloat(contentStyle.paddingTop),
				marginBottom = parseFloat(contentStyle.marginBottom),
				paddingBottom = parseFloat(contentStyle.paddingBottom);

			content.style.height = (screenHeight - marginTop - paddingTop - marginBottom - paddingBottom) + "px";
		});

		if( sectionLength ) {
			hscrollWidth = screenWidth * sectionLength;

			hscroll.forEach(function (scroll) {
				scroll.style.width = hscrollWidth + "px";
			});
			sections.forEach(function (section) {
				section.style.width = screenWidth + "px";
			});
		}

	},

	setActive: function(active) {
		this.element[0].classList.toggle("ui-page-active", active);
	},

	show: function() {
		$.micro.fireEvent(this.element,EventType.BEFORE_SHOW);
		this.element.show();
		$.micro.fireEvent(this.element,EventType.SHOW);
	},

	hide: function() {
		$.micro.fireEvent(this.element, EventType.BEFORE_HIDE);
		this.element.hide();
		$.micro.fireEvent(this.element,EventType.HIDE);
	}

});

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
