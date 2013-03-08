$( document ).on( "pagecreate", "#radio-demo", function () {
	$("input[type='radio']").bind( "change", function(event, ui) {
		if( this.checked )
			$( ".triggered-radio" ).text( this.id + " is selected..." );
	});

});


