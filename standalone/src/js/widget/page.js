//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"jquery.ui.widget",
	"../core",
	"../var/selectors"], function( jQuery ) {
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
		var filter = [].filter,
			element = this.element[0],
			screenWidth = window.innerWidth,
			screenHeight = window.innerHeight,
			uiSelector = $.micro.selectors,
			contentSelector = uiSelector.content.substr(1),
			headerSelector = uiSelector.header.substr(1),
			extraHeight = 0;

		element.style.width = screenWidth + "px";
		element.style.height = screenHeight + "px";

		filter.call( element.children, function( node ) {
			return node.nodeType === 1 &&
				( node.className.indexOf( headerSelector ) > -1 );
		} ).forEach(function ( node ) {
			extraHeight += node.offsetHeight;
		});

		filter.call( element.children, function( node ) {
			return node.nodeType === 1 && node.className.indexOf( contentSelector ) > -1;
		} ).forEach(function ( content ) {
			var contentStyle = window.getComputedStyle(content),
				marginTop = parseFloat(contentStyle.marginTop),
				paddingTop = parseFloat(contentStyle.paddingTop),
				marginBottom = parseFloat(contentStyle.marginBottom),
				paddingBottom = parseFloat(contentStyle.paddingBottom);

			content.style.height = (screenHeight - extraHeight - marginTop - paddingTop - marginBottom - paddingBottom) + "px";
		});

	},

	setActive: function(active) {
		this.element[0].classList.toggle("ui-page-active", active);
	},

	show: function() {
		$.micro.fireEvent(this.element,EventType.BEFORE_SHOW);
		this.element.show();
		this._initLayout();
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
