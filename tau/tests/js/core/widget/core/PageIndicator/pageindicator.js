module("core/widget/core/PageIndicator", {});

var pageWidget = document.getElementById("pageIndicatorPage");

asyncTest("core/widget/core/PageIndicator", function() {
	document.addEventListener("pageshow", function() {
		var elPageIndicator1 = document.getElementById("pageIndicator1"),
			elPageIndicator2 = document.getElementById("pageIndicator2"),
			pageIndicator1 = tau.widget.PageIndicator(elPageIndicator1),
			pageIndicator2 = tau.widget.PageIndicator(elPageIndicator2),
			i,pos;

		function checkMarkUp(widget) {
			var i,
				element = widget.element,
				len = element.children.length;
			ok(element.classList.contains("ui-page-indicator"), "PageIndicator has ui-page-indicator class");

			for(i=0; i<len; i++) {
				ok(element.children[i].classList.contains("ui-page-indicator-item"), "Dot has ui-page-indicator-item class");
			}
		}

		// # of pages < maximum # of dots
		checkMarkUp(pageIndicator1);
		for(i=0;i<3;i++) {
			pageIndicator1.setActive(i);
			ok(elPageIndicator1.children[i].classList.contains("ui-page-indicator-active"), "corresponding dot is active");
		}
		equal(elPageIndicator1.children.length, pageIndicator1.options.numberOfPages, "ok");

		// # of pages > maximum # of dots
		checkMarkUp(pageIndicator2);
		for(i=0;i<10;i++) {
			pos = 0;
			pageIndicator2.setActive(i);
			if(i < 3) {
				pos = i;
			} else if (i >= 3 && i < 8) {
				pos = 2;
			} else {
				pos = i - 5;
			}
			ok(elPageIndicator2.children[pos].classList.contains("ui-page-indicator-active"), "corresponding dot is active");
		}
		equal(elPageIndicator2.children.length, pageIndicator2._getMaxPage(), "ok");
		start();
	}, true);

	tau.engine.run();
});