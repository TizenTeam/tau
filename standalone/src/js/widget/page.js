//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"jquery.ui.widget",
	"../core",
	"../var/selectors"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

var EventType = {

	CREATE: "pagecreate",

	BEFORE_CREATE: "pagebeforecreate",

	SHOW: "pageshow",

	HIDE: "pagehide",

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
		var filter = [].filter,
			element = this.element[0],
			screenWidth = window.innerWidth,
			screenHeight = window.innerHeight,
			uiSelector = $.micro.selectors,
			contentSelector = uiSelector.content.substr(1),
			headerSelector = uiSelector.header.substr(1),
			footerSelector = uiSelector.footer.substr(1),
			isDisplayNone = window.getComputedStyle(element).display === "none",
			extraHeight = 0;

		if ( isDisplayNone ) {
			element.style.visibility = "hidden";
			element.style.display = "block";
		}

		element.style.width = screenWidth + "px";
		element.style.height = screenHeight + "px";

		filter.call( element.children, function( node ) {
			return node.nodeType === 1 &&
				( node.className.indexOf( headerSelector ) > -1 ||
						node.className.indexOf( footerSelector ) > -1 );
		} ).forEach(function ( node ) {
			extraHeight += node.offsetHeight;
		});

		filter.call( element.children, function( node ) {
			return node.nodeType === 1 && node.className.indexOf( contentSelector ) > -1;
		} ).forEach(function ( content ) {
			var contentStyle = window.getComputedStyle(content),
				marginTop = parseFloat(contentStyle.marginTop),
				marginBottom = parseFloat(contentStyle.marginBottom);

			content.style.height = (screenHeight - extraHeight - marginTop - marginBottom) + "px";
		});

		if ( isDisplayNone ) {
			element.style.display = "";
			element.style.visibility = "";
		}
	},

	setActive: function(active) {
		this.element[0].classList.toggle("ui-page-active", active);
	},

	onBeforeShow: function() {
		$.micro.fireEvent(this.element, EventType.BEFORE_SHOW);
	},

	onBeforeHide: function() {
		$.micro.fireEvent(this.element, EventType.BEFORE_HIDE);
	},

	onShow: function() {
		$.micro.fireEvent(this.element, EventType.SHOW);
	},

	onHide: function() {
		$.micro.fireEvent(this.element, EventType.HIDE);
	}

});

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
