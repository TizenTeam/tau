module("ej.widget.micro.Page", {});

var pageWidget = document.getElementById('first');
pageWidget.addEventListener('pagecreate', function() {
	test("ej.widget.micro.Page _init method", function () {
		var pageWidget = document.getElementById('first'),
			contentAll = pageWidget.querySelectorAll('.ui-content'),
			content = contentAll[0],
			header = pageWidget.querySelector('.ui-header'),
			contentStyle = window.getComputedStyle(content),
			marginTop = parseFloat(contentStyle.marginTop),
			paddingTop = parseFloat(contentStyle.paddingTop),
			marginBottom = parseFloat(contentStyle.marginBottom),
			paddingBottom = parseFloat(contentStyle.paddingBottom);
		equal(pageWidget.style.width, window.innerWidth + 'px', 'Page element has proper width style');
		equal(pageWidget.style.height, window.innerHeight + 'px', 'Page element has proper height style');
		equal(contentAll.length, 1, 'Page element has one content element');
		equal(content.style.height, (window.innerHeight - marginTop - marginBottom - header.offsetHeight) + 'px', 'Page content has proper height style');
	});
	test("ej.widget.micro.Page _refresh method", function () {
		var pageWidget = document.getElementById('first'),
			content = pageWidget.querySelector('.ui-content'),
			header = pageWidget.querySelector('.ui-header'),
			contentStyle = window.getComputedStyle(content),
			marginTop = parseFloat(contentStyle.marginTop),
			paddingTop = parseFloat(contentStyle.paddingTop),
			marginBottom = parseFloat(contentStyle.marginBottom),
			paddingBottom = parseFloat(contentStyle.paddingBottom),
			widget = ej.engine.instanceWidget(pageWidget, "page");
		widget.refresh();
		//check if styles didn't mess up
		equal(pageWidget.style.width, window.innerWidth + 'px', 'Page element has proper width style');
		equal(pageWidget.style.height, window.innerHeight + 'px', 'Page element has proper height style');
		equal(content.style.height, (window.innerHeight - marginTop - marginBottom - header.offsetHeight) + 'px', 'Page content has proper height style');
	});

	test("ej.widget.micro.Page resize event", function () {
		var pageWidget = document.getElementById('first'),
			content = pageWidget.querySelector('.ui-content'),
			header = pageWidget.querySelector('.ui-header'),
			contentStyle = window.getComputedStyle(content),
			marginTop = parseFloat(contentStyle.marginTop),
			paddingTop = parseFloat(contentStyle.paddingTop),
			marginBottom = parseFloat(contentStyle.marginBottom),
			paddingBottom = parseFloat(contentStyle.paddingBottom),
			widget = ej.engine.instanceWidget(pageWidget, "page");
		window.innerWidth -= 10;
		window.innerHeight -= 10;
		widget.trigger("resize");
		equal(pageWidget.style.width, window.innerWidth + 'px', 'Page element has proper width style');
		equal(pageWidget.style.height, window.innerHeight + 'px', 'Page element has proper height style');
		equal(content.style.height, (window.innerHeight - marginTop - marginBottom - header.offsetHeight) + 'px', 'Page content has proper height style');
	});
}, false);