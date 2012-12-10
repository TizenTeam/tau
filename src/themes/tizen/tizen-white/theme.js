(function( $, undefined ) {
//$.mobile.page.prototype.options.backBtnTheme	= "s";

// Clear default theme for child elements
$( function ( o ) {
	o.headerTheme = "s";
	o.footerTheme = "s";
} ( $.mobile.page.prototype.options ) );

// clear listview
( function ( o ) {
	o.theme = "s";
	o.countTheme = "s";
	o.headerTheme = "s";
	o.dividerTheme = "s";
	o.splitTheme = "s";
} ( $.mobile.listview.prototype.options ) );

// Collapsible
( function ( o ) {
	o.heading = o.heading + ',li';		// Add listitem as a heading
	o.inset = false;
	o.iconPos = "right";	// Move iconPos to right position
	o.collapsedIcon = "arrow-u";
	o.expandedIcon = "arrow-d";
} ( $.mobile.collapsible.prototype.options ) );

//clear button theme
$.mobile.button.prototype.options.theme = "s";
$.fn.buttonMarkup.defaults.theme = "s";

// Default theme swatch
$.mobile.page.prototype.options.theme = "s";

// Original scale of the theme
$.tizen.frameworkData.defaultViewportWidth = 360;	// Fit to device-width
$.tizen.frameworkData.defaultFontSize = 22;

})(jQuery);
