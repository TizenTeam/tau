$( "#checkbox-demo" ).live("pagecreate", function () {
	$( "#check-1" ).bind('vclick', function () {
		console.log("clicked...");
		value = $( "#checkbox-1" ).prop( "checked" );
		// change checkbox property and update UI.
		$( "#checkbox-1" ).prop( "checked", !value );
		$("#checkbox-1").checkboxradio( "refresh" );
		// show checkbox1 property
		$( ".checked-value" ).text( $( "#checkbox-1" ).prop( "checked" ) );
	});

	$( "#get-check-value" ).bind('vclick', function () {
		$( ".checked-value" ).text( $( "#checkbox-1" ).prop( "checked" ) );
	});

	$("input[type='checkbox']").bind( "change", function(event, ui) {
		$( ".triggered-check" ).text( this.id + " is " + this.checked );
	});

});


