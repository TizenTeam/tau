(function(document, tau) {
    "use strict";
    module("widget.tv.Page TV Page widget", {});

	test("widget.tv.Page TV specific selectors", function () {
		var pageWidget = document.getElementById('first'),
			header = pageWidget.querySelector('.ui-header'),
			footer = pageWidget.querySelector('.ui-footer');
		ok(header, "Header has been correctly recognized.");
		ok(footer, "Footer has been correctly recognized.");
	});
}(document, window.tau));