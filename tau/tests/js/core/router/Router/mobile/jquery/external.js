/*global window, module, test, asyncTest, ok, equal, start, stop, ej, $, notEqual */
(function (window, document, $) {
	"use strict";

	module("profile/mobile/router/PageExternal");

	if (!window.navigator.userAgent.match("PhantomJS")) {
		$(document).bind('mobileinit', function () {
			asyncTest('By default first page is active', 9, function () {
				var location = window.location.href.replace(window.location.hash, '');

				function checkPage1Reload() {
					var page = document.getElementById('page1');
					notEqual($('base').attr('href'), location, 'Check base element');
					ok(page.classList.contains('ui-page-active'), 'Page1 is active');
					ok(!page.classList.contains('test-page-class'), "Page1 hasn't class test-page-class");
					equal(document.querySelectorAll('[data-role="page"].ui-page-active').length, 1, 'Only one page is active');
					start();
				}

				function checkPage1() {
					var page = document.getElementById('page1');
					$(document.body).one('pagechange', checkPage1Reload);
					notEqual($('base').attr('href'), location, 'Check base element');
					ok(page.classList.contains('ui-page-active'), 'Page1 is active');
					page.classList.add('test-page-class');
					ok(page.classList.contains('test-page-class'), 'Page1 has class test-page-class');
					equal(document.querySelectorAll('[data-role="page"].ui-page-active').length, 1, 'Only one page is active');
					$.mobile.changePage('page1.html', {
						allowSamePageTransition: true,
						transition: 'none',
						showLoadMsg: false,
						reloadPage: true
					});
				}


				equal($('base').attr('href'), location, 'Check base element');
				$(document.body).one('pagechange', checkPage1);
				$.mobile.changePage('external/page1.html');
			});
		});
	} else {
		test("PhantomJS does not support XMLHttpRequest.responseType = document", function () {
			ok(true, "bypassing");
		});
	}
}(window, window.document, window.jQuery));
