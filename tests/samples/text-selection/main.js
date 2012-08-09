$( document ).bind("pagecreate", function () {
	$('#back').bind( "vclick", function () {
		history.back();
	});
});

$( "#no-user-select" ).live( "pageshow", function () {
	$.mobile.tizen.disableSelection( this );
});
