$().ready(function() {
module("ej.jqm.router", {});
	$(document).one('pagechange', function() {
		asyncTest("$.mobile.changePage", 1, function () {
			var page2 = $('#test2');

			$(document).on('pagechange', function () {
				ok(page2.hasClass('ui-page-active'), "Check active page.");
				start();
			});
			$.mobile.changePage(page2);
		});
	});
});