$( document ).bind( "pagebeforeshow", function( e ) {
	if( $( "#textposition" ).length ) {
		$( "#textposition .ui-btn-text" ).css( "font-size", "12px" );
		$( "#textposition" ).find( "span" ).css( "line-height", "10px" );
		$( "#textposition" ).find( "span" ).css("padding-top", "2px");
		$( "#textposition" ).find( "span" ).css("padding-bottom", "2px");
	}
});
