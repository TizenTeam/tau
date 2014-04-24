module("ej.jqm.router");

asyncTest ( "pageContainer" , 5, function () {
	var pageContainer = document.getElementById('pageContainer1');
	ok(!document.body.classList.contains('ui-mobile-viewport'), 'body not contains ui-mobile-viewport');
	ok(!document.body.classList.contains('ui-overlay-s'), 'body not contains overlay-s');
	ok(pageContainer.classList.contains('ui-mobile-viewport'), 'pageContainer contains ui-mobile-viewport');
	ok(pageContainer.classList.contains('ui-overlay-s'), 'pageContainer contains overlay-s');
	setTimeout(function() {
		start();
	}, 1000);
	$('#pageContainer1').bind('pagechange', function(event) {
		ok(event.target, 'call changepage');
	});
	document.getElementById('btn1').click();
	document.getElementById('btn2').click();
});