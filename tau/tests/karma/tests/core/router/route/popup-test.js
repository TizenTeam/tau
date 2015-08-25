/*global define */
define(
	[
		"/base/tests/js/core/router/route/popup/tests.js",
		"../../../helpers",
		"src/js/core/router/Router",
		"src/js/core/router/route/popup",
		"src/js/core/template/html"
	],
	function (testsRouter, helpers) {
		"use strict";

		testsRouter(window.ns, "/base/tests/js/core/router/route/popup/", function() {
			/*jshint -W034 */
			helpers.injectHTML("<div id='main' class='ui-page'> \
				<div id='popup'></div>\
				<div id='popup-correct' class='ui-popup'></div>\
				</div>", "qunit-fixture");
			/*jshint +W034 */
		});
	}
);

