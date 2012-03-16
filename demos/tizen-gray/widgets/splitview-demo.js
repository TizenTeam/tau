( function ( $, document, window ) {
	$( document ).ready( function () {
		$( "#SPtestFix" ).bind( "vclick", function () {
			$( ":jqmData(role='splitview')" ).splitview( "fixed", true );
		});

		$( "#SPtestMovable" ).bind( "vclick", function () {
			$( ":jqmData(role='splitview')" ).splitview( "fixed", false );
		});
	});
} ( jQuery, document, window ) );