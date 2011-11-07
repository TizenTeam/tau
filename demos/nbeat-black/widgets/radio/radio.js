$( "#radio-demo" ).live("pagecreate", function () {
	$("input[type='radio']").bind( "change", function(event, ui) {
		$( ".triggered-radio" ).text( this.id + " is " + this.checked );
	});

});


