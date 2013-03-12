// Expand all textarea height automatically
$('#ButtonNolist').one( "pagecreate", function () {
	$( this ).on( 'pageshow' , function ( ) {
		var textarea = $(this).find('textarea');
		$( textarea ).each( function ( idx, el ) {
			var h = Math.max( el.clientHeight, el.scrollHeight );
			$( el ).height( h );
		} );
	} );
} );