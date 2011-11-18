// @author: koeun.choi@samsung.com 
(function( $, window, undefined ) {

	//Prevent selections in winsets...
	$.fn.preventDefaultBehaviour = function() {
		$.preventDefaultBehaviour( this );
	};

	$.preventDefaultBehaviour = function( elem ) {
		var $elem = $( elem );
		$elem.bind( "mousedown touchstart vmousedown ", function (e) {
			if ( e.type == 'touchstart' || e.type == 'mousedown' || e.type == 'vmousdown' ) {
				//console.log("preventDefaultBehavior test...");
				e.preventDefault();
			}
		});
	};

})( jQuery, this );


