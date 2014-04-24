/*global module, test, asyncTest, ok, equal, start, stop, ej, $ */
asyncTest('By default first page is active', 6, function () {
	function checkPage1 () {
		var page = document.getElementById('page1');
		document.body.addEventListener('pagechange', checkFirstPage);
		equal(page.getAttribute('data-tau-bound'), "Page", 'Page1 is enhanced');
		ok(page.classList.contains('ui-page-active'), 'Page1 is active');
		equal(document.querySelectorAll('[data-role="page"].ui-page-active').length, 1, 'Only one page is active');
		document.body.removeEventListener('pagechange', checkPage1);
		start();
	}

	function checkFirstPage () {
		var page = document.getElementById('first');
		equal(page.getAttribute('data-tau-bound'), "Page", 'First page is enhanced');
		ok(page.classList.contains('ui-page-active'), 'First page is active');
		equal(document.querySelectorAll('[data-role="page"].ui-page-active').length, 1, 'Only one page is active');
		document.body.removeEventListener('pagechange', checkFirstPage);
		document.body.addEventListener('pagechange', checkPage1);
		$.mobile.changePage('external/page1.html');
	}

	document.body.addEventListener('pagechange', checkFirstPage);
	ej.engine.run();
});