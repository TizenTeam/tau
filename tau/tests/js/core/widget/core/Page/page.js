module("core/widget/core/Page");

var pageWidget = document.getElementById('first');
pageWidget.addEventListener('pagecreate', function () {
	test("Page _init method", function () {
		var pageWidget = document.getElementById('first'),
			contentAll = pageWidget.querySelectorAll('.ui-content');
		equal(pageWidget.style.width, window.innerWidth + 'px', 'Page element has proper width style');
		equal(pageWidget.style.height, window.innerHeight + 'px', 'Page element has proper height style');
		equal(contentAll.length, 1, 'Page element has one content element');
	});
	test("Page _refresh method", function () {
		var pageWidget = document.getElementById('first'),
			widget = tau.engine.instanceWidget(pageWidget, "page");
		widget.refresh();
		//check if styles didn't mess up
		equal(pageWidget.style.width, window.innerWidth + 'px', 'Page element has proper width style');
		equal(pageWidget.style.height, window.innerHeight + 'px', 'Page element has proper height style');
	});

	test("Page resize event", function () {
		var pageWidget = document.getElementById('first'),
			widget = tau.engine.instanceWidget(pageWidget, "page");
		window.innerWidth -= 10;
		window.innerHeight -= 10;
		widget.trigger("resize");
		equal(pageWidget.style.width, window.innerWidth + 'px', 'Page element has proper width style');
		equal(pageWidget.style.height, window.innerHeight + 'px', 'Page element has proper height style');
	});
}, false);