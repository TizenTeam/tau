$( "#radio-demo" ).live("pagecreate", function () {
	$("input[type='radio']").bind( "change", function(event, ui) {
		if( this.checked )
			$( ".triggered-radio" ).text( this.id + " is selected..." );
	});

});


