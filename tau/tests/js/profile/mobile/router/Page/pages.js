module('Page');

asyncTest('Enhance only first page', function () {
	function checkFirstPageEnhanced () {
		var first = document.getElementById('first'),
			second = document.getElementById('second'),
			mock1 = document.getElementById('mock1'),
			mock2 = document.getElementById('mock2');
		equal(first.getAttribute('data-tau-bound'), "Page", "First page widget is created");
		equal(mock1.getAttribute('data-tau-bound'), "Mock", "First mock widget is created");
		ok(!second.getAttribute('data-tau-bound'), "Second page widget wasn't created");
		ok(!mock2.getAttribute('data-tau-bound'), "Second mock widget wasn't created");
		document.body.removeEventListener('bound', checkFirstPageEnhanced);
		start();
	}
	document.body.addEventListener('bound', checkFirstPageEnhanced);
	ej.engine.run();
});

asyncTest('Create page', function () {
	function checkPageCreated () {
		document.body.removeEventListener('bound', checkPageCreated);
		equal(document.querySelectorAll("[data-role='page']").length, 1, 'Page was created and body contents wrapped.');
		equal(document.body.children.length, 1, 'All body elements are moved to page div');
		start();
	}
	document.getElementById('qunit-fixture').innerHTML = ''; //remove all pages, leave only mock widget
	document.body.addEventListener('bound', checkPageCreated);
	ej.engine.run();
});

(function (window, ej) {
	"use strict";
	ej.test = {};
	ej.test.mock = (function (){
		var Mock = function () {};
		ej.engine.defineWidget(
			"Mock",
			"[data-role='mock']",
			[],
			Mock
		);
		Mock.prototype = new ej.widget.BaseWidget();
		Mock.prototype._build = function (element) {
			element.className = "mock_built";
			return element;
		};
		return Mock;
	}());
}(window, window.ej));