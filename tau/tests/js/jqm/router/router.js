/*global module, $, asyncTest, document, ok, start, window, test */
$().ready(function () {
	"use strict";
	var disabled = true;

	module("jqm/router", {});

	if (!window.navigator.userAgent.match("PhantomJS")) {
		if (!disabled) {
			/**
			 * @todo: disabled tests - TCT issues on device
			 */
			asyncTest("$.mobile.changePage", 1, function () {
				var page2 = $("#test2");

				$(document).on("pagechange", function () {
					ok(page2.hasClass("ui-page-active"), "Check active page.");
					start();
				});
				$.mobile.changePage(page2);
			});
		} else {
			test("Disabled test - TCT issue on device", function () {
				ok(true, "Disabled test, TCT issue");
			});
		}
	} else {
		test("PhantomJS does not support XMLHttpRequest.responseType = document", function () {
			ok(true, "bypassing");
		});
	}
});
