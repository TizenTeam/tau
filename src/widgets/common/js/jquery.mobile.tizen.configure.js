/*
 * set TIZEN specific configures
 */

( function( $, window, undefined ) {

	/* depth transition */
	$.mobile.transitionHandlers.depth = $.mobile.transitionHandlers.simultaneous;
	$.mobile.transitionFallbacks.depth = "fade";
	/* Button data-corners default value */
	$.fn.buttonMarkup.defaults.corners = false;
})( jQuery, this );
