/*
 * set TIZEN specific configures
 */

( function( $, window, undefined ) {

	/* depth transition */
	$.mobile.transitionHandlers.depth = $.mobile.transitionHandlers.simultaneous;
	$.mobile.transitionFallbacks.depth = "fade";

})( jQuery, this );
