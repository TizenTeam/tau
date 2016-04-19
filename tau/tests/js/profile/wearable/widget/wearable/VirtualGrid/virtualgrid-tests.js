/* global tau, test, ok, equal, start, asyncTest */
(function() {
	/*
	 * Function triggering touch event
	 */
	function triggerTouchEvent(el, event, move){
		var ev = document.createEvent("MouseEvent");
		ev.initMouseEvent(
			event,
			true /* bubble */, true /* cancelable */,
			window, null,
			0, 0, 0, 0, /* coordinates */
			false, false, false, false, /* modifier keys */
			0 /*left*/, null
		);
		ev.touches = move || [{clientX:0, clientY :0}];
		ev.changedTouches = move || [{clientX:0, clientY :0}];
		el.dispatchEvent(ev);
	}

	var elList = document.getElementById("vgrid1"),
		fixture = document.getElementById("qunit-fixture");

	module("profile/wearable/widget/wearable/VirtualGrid");

	elList.addEventListener("draw", function() {
		var vList = tau.widget.VirtualGrid(elList);
		asyncTest("VirtualList draw method", 8, function () {
			var children = elList.children,
				nextDiv = elList.nextElementSibling,
				li = children[0];

			// we need wait because vlistn eyquti
			setTimeout(function() {
				equal(children.length, 30, "Widget created 30 li elements");
				equal(elList.style.position, "relative", "Position style is set to relative");
				equal(elList.style.top, "", "Top style is not set");
				equal(nextDiv.tagName, "DIV", "After UL was created div");
				equal(nextDiv.style.display, "block", "DIV has proper display style");
				equal(nextDiv.style.position, "static", "DIV has proper display position");
				ok(nextDiv.style.height, "DIV has proper display height");
				ok(li.innerHTML, "LI element has proper innerHTML");
				start();
			}, 100);
		});

		test("VirtualList scrollToIndex method", 5, function () {
			var scrollview = elList.parentNode;

			vList.scrollToIndex(100);
			ok(scrollview.scrollTop >= 4040, "scrollTop is set to >= 4040");
			vList.scrollToIndex(500);
			ok(scrollview.scrollTop >= 14742, "scrollTop is set to >= 14742");
			vList.scrollToIndex(1000);
			ok(scrollview.scrollTop >= 14399, "scrollTop is set to >= 14399");
			vList.scrollToIndex(0);
			ok(scrollview.scrollTop === 0, "scrollTop is set to 0");
			vList.scrollToIndex(10000000);
			ok(scrollview.scrollTop >= 14399, "scrollTop is set to >= 14399");
		});

		test("VirtualList on scroll action", 2, function () {
			var scrollview = elList.parentNode,
				li;

			vList.scrollToIndex(0);
			li = elList.children[1];
			li.scrollIntoView();
			ok(scrollview.scrollTop < 120, "scrollTop is set to < 110");
			li = elList.children[elList.children.length/2];
			li.scrollIntoView();
			ok(scrollview.scrollTop > 120, "scrollTop is set to > 110");
		});

		asyncTest("VirtualList tap methods", 3, function () {
			var li = elList.children[0],
				span = li.firstElementChild.firstElementChild,
				tapholdThreshold = 300;

			// Simulate tap
			triggerTouchEvent(span, "touchstart");

			setTimeout(function() {
				triggerTouchEvent(span, "touchend");
				ok(li.classList.contains("ui-li-active"), "touch hold works");

				// Simulate scrolling
				triggerTouchEvent(span, "touchstart");
				triggerTouchEvent(span, "touchmove", [{clientX:1000, clientY :1000}]);

				setTimeout(function() {
					triggerTouchEvent(span, "touchend");

					// Check if highlight is removed
					ok(!li.classList.contains("ui-li-active"), "touch highlight remove works");

					// Simulate TAP 2 - move but keep position in distance tolerance
					triggerTouchEvent(span, "touchstart", [{clientX: 0, clientY: 0}]);
					triggerTouchEvent(span, "touchmove", [{clientX: 3, clientY: 3}]);

					setTimeout(function() {
						triggerTouchEvent(span, "touchend");

						// Check if item is highlighted
						ok(li.classList.contains("ui-li-active"), "touch hold with tolerance distance works");

						start();
					}, tapholdThreshold);
					// End of timeout
				}, tapholdThreshold);
				// End of scrolling simulation
			}, tapholdThreshold);
			// End of tap simulation
		});

		test("VirtualList destroy method", 4, function () {
			var children = elList.children,
				nextDiv = elList.nextElementSibling,
				li = children[0];

			vList.destroy();
			equal(children.length, 0, "Widget created 0 li elements");
			equal(elList.style.position, "static", "Position style is set to static");
			equal(elList.style.top, "auto", "Top style is not set");
			ok(nextDiv, "After UL DIV was deleted");
		});

		fixture.style.position = "absolute";
		fixture.style.top = "-10000px";
		fixture.style.left = "-10000px";
		fixture.style.height = "10000px";
		fixture.style.width = "10000px";
	});
}());
