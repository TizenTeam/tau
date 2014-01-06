//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"jquery.ui.widget",
	"./../tizen.micro.core"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

var EventType = {

	SHOW: "show",

	HIDE: "hide",

	BEFORE_CREATE: "beforecreate",

	BEFORE_SHOW: "beforeshow",

	BEFORE_HIDE: "beforehide"
};

$.widget( "micro.page", {

	initSelector: ".ui-page",

	options: {
	},

	_create: function() {
		this.element.trigger( EventType.BEFORE_CREATE );
		if ( this._trigger( EventType.BEFORE_CREATE ) === false ) {
			return false;
		}

		this._initLayout();

		this._on(this.window, {
			"resize": $.proxy( this._initLayout, this )
		});
	},

	_destroy: function() {
	},

	_init: function() {

	},

	_getCreateOptions: function() {
	},

	_initLayout: function() {
		var $hscroll = $( ".ui-page-scroll" ),
			$sections = this.element.find( ".ui-section" ),
			sectionLength = $sections.length,
			screenWidth = $(this.window).width(),
			screenHeight = $(this.window).height(),
			$element = this.element;

		$element.css({
				overflow: "hidden-y",
				width: screenWidth + "px",
				height: screenHeight + "px",
			})
			.find( ".ui-main" ).each(function( idx, content) {
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

	focusPage: function () {
		var $autofocus = this.element.find("[autofocus]");
		if ($autofocus) {
			$autofocus.focus();
			return;
		}
		this.element.focus();
	},

	show: function() {
		this._trigger(EventType.BEFORE_SHOW);
		this.element.show();
		this._trigger(EventType.SHOW);
	},

	hide: function() {
		this._trigger(EventType.BEFORE_HIDE);
		this.element.hide();
		this._trigger(EventType.HIDE);
	}

});

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
