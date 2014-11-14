module("jqm/router");

$(document).one('pagechange', function(event) {
	asyncTest("pageContainer", 5, function () {
		var pageContainer = document.getElementById('pageContainer1');
		ok(!document.body.classList.contains('ui-mobile-viewport'), 'body not contains ui-mobile-viewport');
		ok(pageContainer.classList.contains('ui-mobile-viewport'), 'pageContainer contains ui-mobile-viewport');
		ok(document.body.className.indexOf('ui-overlay') === -1, 'body not contains overlay');
		ok(pageContainer.className.indexOf('ui-overlay') > -1, 'pageContainer contains overlay');
		window.setTimeout(function () {
			start();
		}, 2000);
		$(pageContainer).bind('pageshow', function (event) {
			ok(event.target, 'call pageshow');
		});
		document.getElementById("btn1").click();
		document.getElementById("btn2").click();
	});
});
