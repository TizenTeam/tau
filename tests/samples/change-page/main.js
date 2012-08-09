$( document ).bind("pagecreate", function () {
	$('#change').bind( "vclick", function () {
		console.log( "move page..");
		$.mobile.changePage($("#secondPage"), {transition:"none"});
	});

	$('#back').bind( "vclick", function () {
		history.back();
	});

});
