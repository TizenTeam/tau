$( document ).bind( "pagecreate", function () {
	$( "#hideheader" ).bind( "vclick", function ( e ) {
		var $elPage = $( ".ui-page-active" );

		$elPage.find( ".ui-header" ).hide();
		$elPage.page( "refresh" );
	});

	$( "#showheader" ).bind( "vclick", function ( e ) {
		var $elPage = $( ".ui-page-active" );

		$elPage.find( ".ui-header" ).show();
		$elPage.page( "refresh" );
	});

	$( "#hidefooter" ).bind( "vclick", function ( e ) {
		var $elPage = $( ".ui-page-active" );

		$elPage.find( ".ui-footer" ).hide();
		$elPage.page( "refresh" );
	});

	$( "#showfooter" ).bind( "vclick", function ( e ) {
		var $elPage = $( ".ui-page-active" );

		$elPage.find( ".ui-footer" ).show();
		$elPage.page( "refresh" );
	});
});
