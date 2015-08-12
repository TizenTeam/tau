(function (document, $, q) {
	"use strict";

	q.module("jqm/router", {
		teardown: function () {
			document.location.hash = "";
		}
	});

	q.asyncTest("pageContainer", 6, function () {
		var test = function () {
					var pageContainer = document.getElementById('pageContainer1');

					q.ok(!document.body.classList.contains('ui-mobile-viewport'), 'body not contains ui-mobile-viewport');
					q.ok(pageContainer.classList.contains('ui-mobile-viewport'), 'pageContainer contains ui-mobile-viewport');
					q.ok(document.body.className.indexOf('ui-overlay') === -1, 'body not contains overlay');
					q.ok(pageContainer.className.indexOf('ui-overlay') > -1, 'pageContainer contains overlay');

					$(pageContainer).bind('pageshow', function (event) {
						q.ok(event.target, 'call pageshow');
						q.equal(event.target.id, "page3", "correct page shown");
						start();
					});

					document.getElementById("btn1").click();
					document.getElementById("btn2").click();
				},
				active = $(".ui-page-active");

		if (active && $(active).attr("id") === "page1") {
			test();
		} else {
			$(document).one("pageshow", test);
		}
	});
}(window.document, jQuery, QUnit));
