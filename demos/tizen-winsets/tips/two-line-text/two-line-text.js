$( document ).bind( "pagebeforeshow", function( e ) {
	if( $( "#textposition" ).length ) {
		$( "#textposition" ).css( "font-size", "12px" );
		$( "#textposition" ).find( "span" ).css( "height", "32px" );
		$( "#textposition" ).find( "span" ).css("padding-top", "4px");
		$( "#textposition" ).find( "span" ).css("padding-bottom", "4px");
	}
});
