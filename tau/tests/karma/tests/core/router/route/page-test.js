/*global define */
define(
	[
		"/base/tests/js/core/router/route/page/tests.js",
		"src/js/core/router/Router",
		"src/js/core/router/route/page",
		"src/js/core/template/html"
	],
	function (testsRouter) {
		"use strict";

		testsRouter(window.ns, "/base/tests/js/core/router/route/page/");
	}
);

