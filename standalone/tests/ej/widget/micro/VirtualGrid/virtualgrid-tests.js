(function() {
	var elList = document.getElementById("vgrid1"),
		fixture = document.getElementById("qunit-fixture");

	elList.addEventListener("draw", function() {
		var vList = gear.ui.VirtualGrid(elList);
		test("ej.widget.micro.VirtualList draw method", 8, function () {
			var children = elList.children,
				nextDiv = elList.nextElementSibling,
				li = children[0];

			equal(children.length, 30, 'Widget created 10 li elements');
			equal(elList.style.position, 'relative', 'Position style is set to relative');
			equal(elList.style.top, '', 'Top style is not set');
			equal(nextDiv.tagName, 'DIV', 'After UL was created div');
			equal(nextDiv.style.display, 'block', 'DIV has proper display style');
			equal(nextDiv.style.position, 'static', 'DIV has proper display position');
			ok(nextDiv.style.height, 'DIV has proper display height');
			ok(li.innerHTML, 'LI element has proper innerHTML');
		});

		test("ej.widget.micro.VirtualList scrollToIndex method", 5, function () {
			var scrollview = elList.parentNode,
				top,
				li = elList.children[0];

			vList.scrollToIndex(100);
			ok(scrollview.scrollTop >= 4040, 'scrollTop is set to >= 4040');
			vList.scrollToIndex(500);
			ok(scrollview.scrollTop >= 14742, 'scrollTop is set to >= 14742');
			vList.scrollToIndex(1000);
			ok(scrollview.scrollTop >= 14399, 'scrollTop is set to >= 14513');
			vList.scrollToIndex(0);
			ok(scrollview.scrollTop == 0, 'scrollTop is set to 0');
			vList.scrollToIndex(10000000);
			ok(scrollview.scrollTop >= 14399, 'scrollTop is set to >= 14513');
		});

		test("ej.widget.micro.VirtualList on scroll action", 2, function () {
			var scrollview = elList.parentNode,
				top,
				li;

			vList.scrollToIndex(0);
			li = elList.children[1];
			li.scrollIntoView();
			ok(scrollview.scrollTop < 105, 'scrollTop is set to < 50');
			li = elList.children[elList.children.length/2];
			li.scrollIntoView();
			ok(scrollview.scrollTop > 105, 'scrollTop is set to > 50');
		});

		function touchevent(el, event, move){
			var ev = document.createEvent("MouseEvent");
			ev.initMouseEvent(
				event,
				true /* bubble */, true /* cancelable */,
				window, null,
				0, 0, 0, 0, /* coordinates */
				false, false, false, false, /* modifier keys */
				0 /*left*/, null
			);
			ev.touches = [{clientX:0, clientY :0}];
			ev.changedTouches = move || [{clientX:0, clientY :0}];
			el.dispatchEvent(ev);
		}

		asyncTest("ej.widget.micro.VirtualList tap methods", 3, function () {
			var scrollview = elList.parentNode,
				top,
				li = elList.children[0];

			touchevent(li, 'touchstart');
			setTimeout(function() {
				touchevent(li, 'touchend');
				ok(li.classList.contains('ui-listview-active'), 'touch hold works');
				li.classList.remove('ui-listview-active');
				touchevent(li, 'touchstart');
				touchevent(li, 'touchmove', [{clientX:1000, clientY :1000}]);
				setTimeout(function() {
					touchevent(li, 'touchend');
					ok(!li.classList.contains('ui-listview-active'), 'touch not hold works');
					touchevent(li, 'touchstart');
					touchevent(li, 'touchmove', [{clientX:3, clientY :3}]);
					setTimeout(function() {
						touchevent(li, 'touchend');
						ok(li.classList.contains('ui-listview-active'), 'touch not hold works');
						start();
					}, 1000);
				}, 1000);
			}, 1000);
		});

		test("ej.widget.micro.VirtualList destroy method", 4, function () {
			var children = elList.children,
				nextDiv = elList.nextElementSibling,
				li = children[0];

			vList.destroy();
			equal(children.length, 0, 'Widget created 0 li elements');
			equal(elList.style.position, 'relative', 'Position style is set to relative');
			equal(elList.style.top, '0px', 'Top style is not set');
			ok(nextDiv, 'After UL DIV was deleted');
		});

		fixture.style.position = 'absolute';
		fixture.style.top = '-10000px';
		fixture.style.left = '-10000px';
		fixture.style.height = '10000px';
		fixture.style.width = '10000px';
	});
}());
