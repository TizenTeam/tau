/*global define */
define(
	[
		"/base/tests/js/core/router/Router/Router.js",
		"../helpers",
		"src/js/core/router/Router",
		"src/js/core/router/route/page",
		"src/js/core/router/route/popup",
		"src/js/core/template/html"
	],
	function (testsRouter, helpers) {
		"use strict";

		/* jshint -W034 */
		helpers.injectHTML("<div id='qunit-fixture'>\
		<div data-role='page' id='firstPage' class='ui-page'>\
			<div id='test1'></div>\
			<a id='linkToSecondPage' href='#secondPage'>Second page</a>\
		<a id='linkToThirdPage' href='#thirdPage'>Third page</a>\
		<div data-role='popup' id='firstPopup' class='ui-popup'>\
			<div>First Popup</div>\
		</div>\
		</div>\
		<div data-role='page' id='secondPage' class='ui-page'>\
			<div id='test2'></div>\
			<a id='linkToExternalPage' href='/base/tests/js/core/router/Router/test-data/externalPage.html'>External page</a>\
		<div data-role='popup' id='secondPopup' class='ui-popup'>\
			<div>Second Popup</div>\
		</div>\
		</div>\
		<div data-role='page' id='thirdPage' class='ui-page'>\
			<div id='test3'></div>\
			<div data-role='popup' id='thirdPopup' class='ui-popup'>\
			<div>Third Popup</div>\
		</div>\
		</div>\
		</div>");
		/* jshint +W034 */
		testsRouter(window.ns, "/base/tests/js/core/router/Router/");
	}
);

