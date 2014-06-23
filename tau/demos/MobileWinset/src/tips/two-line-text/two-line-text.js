$( document ).one( "pagebeforeshow", "#twolinesample", function ( e ) {
	$( "#textposition .ui-btn-text" ).css( "font-size", "12px" );
	$( "#textposition" ).find( "span" ).css( {
		"line-height": "10px" ,
		"padding-top": "2px",
		"padding-bottom": "2px"
	});
});
