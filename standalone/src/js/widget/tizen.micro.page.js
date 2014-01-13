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
		var $hscroll = $( $.micro.selectors.pageScroll ),
			$sections = this.element.find( $.micro.selectors.section ),
			sectionLength = $sections.length,
			screenWidth = $(this.window).width(),
			screenHeight = $(this.window).height(),
			$element = this.element;

		$element.css({
				overflow: "hidden-y",
				width: screenWidth + "px",
				height: screenHeight + "px",
			})
			.find( $.micro.selectors.content ).each(function( idx, content) {
				var $contentElement = $(content),
					marginTop = window.parseFloat($contentElement.css("margin-top")),
					paddingTop = window.parseFloat($contentElement.css("padding-top")),
					marginBottom = window.parseFloat($contentElement.css("margin-bottom")),
					paddingBottom = window.parseFloat($contentElement.css("padding-bottom"));
				$contentElement.height( screenHeight - marginTop - paddingTop - marginBottom - paddingBottom);
			});

		if( sectionLength ) {
			$hscroll.width( screenWidth * sectionLength );
			$sections.width( screenWidth );
		}

	},

	setActive: function(active) {
		if(active) {
			this.element.addClass("ui-page-active");
		} else {
			this.element.removeClass("ui-page-active");
		}
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
