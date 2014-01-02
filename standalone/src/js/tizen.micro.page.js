//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"jquery.hashchange",
	"jquery.ui.widget"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

$.widget( "micro.page", {
	options: {
		hasActionbar: false,
	},

	_create: function() {
		if ( this._trigger( "beforecreate" ) === false ) {
			return false;
		}

		this.screenWidth = $(this.window).width();
		this.screenHeight = $(this.window).height();
		
		this.sections = this.element.find( ".section" );

	},

	_destroy: function() {
		
	},

	_init: function() {
		
	},

	_getCreateOptions: function() {
		return {
			hasActionbar: this.element.ch
		};
	},

	_initLayout: function() {
		var $scrollContent = $( ".ui-page-scroll" );
		if(this.sections.length) {
			$scrollContent.setWidth( this.screenWidth * this.sections.length );
		}
	}
});

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");