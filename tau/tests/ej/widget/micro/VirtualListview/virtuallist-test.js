/*global window, define, $, ej, ok, equal, test, JSON_DATA, gear, asyncTest, start */
/*jslint nomen: true, browser: true*/
/*
* Unit Test: VirtualListview
*
* Michał Szepielak <m.szepielak@samsung.com>
* Maciej Urbański <m.urbanski@samsung.com>
*
* Testing only vertical orientation.
* @TODO test horizontal orientation
*/

(function() {
	'use strict';

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
		ev.touches = [{clientX:0, clientY :0}];
		ev.changedTouches = move || [{clientX:0, clientY :0}];
		el.dispatchEvent(ev);
	}

	var elList = document.getElementById("vlist1"),
		fixture = document.getElementById("qunit-fixture"),
		drawListener,
		drawEventReceived = false;

	// Prepare function to test draw event
	drawListener = function () {
		drawEventReceived = true;
		elList.removeEventListener('draw', drawListener, false);
	};

	// Set listener
	elList.addEventListener('draw', drawListener, false);


	// RUN TEST 1
	test("ej.widget.micro.VirtualList draw method", 9, function () {
		var children = elList.children,
			nextDiv = elList.nextElementSibling,
			li = children[0];

		equal(drawEventReceived, true, 'Draw Event was sent');
		equal(children.length, 100, 'Widget created 100 li elements');
		equal(elList.style.position, 'relative', 'Position style is set to relative');
		equal(elList.style.top, '', 'Top style is not set');
		equal(nextDiv.tagName, 'DIV', 'After UL was created div');
		equal(nextDiv.style.display, 'block', 'DIV has proper display style');
		equal(nextDiv.style.position, 'static', 'DIV has proper display position');
		ok(nextDiv.style.height, 'DIV has proper display height');
		equal(li.innerHTML, "<span class=\"ui-li-text-main\">Abdelnaby, Alaa</span><div data-role=\"button\" data-inline=\"true\" data-icon=\"plus\" data-style=\"box\"></div>", 'LI element has proper innerHTML');
	});


	// RUN TEST 2
	test("ej.widget.micro.VirtualList scrollToIndex method", 6, function () {
		var scrollview = elList.parentNode,
			vList = tau.VirtualListview(elList);

		vList.scrollToIndex(100);
		ok(scrollview.scrollTop >= 2000, 'scrollTop is set to >= 2000');
		vList.scrollToIndex(500);
		ok(scrollview.scrollTop >= 10000, 'scrollTop is set to >= 10000');
		vList.scrollToIndex(1000);
		ok(scrollview.scrollTop >= 20000, 'scrollTop is set to >= 20000');
		vList.scrollToIndex(0);
		ok(scrollview.scrollTop === 0, 'scrollTop is set to 0');
		vList.scrollToIndex(10000000);
		ok(scrollview.scrollTop >= 20000, 'scrollTop is set to >= 20000');
		vList.scrollToIndex(-200);
		ok(scrollview.scrollTop === 0, 'scroll to negative index - scrollTop is set to 0');
	});

	// RUN TEST 3
	test("ej.widget.micro.VirtualList fastOn scroll action", 2, function () {
		var scrollview = elList.parentNode,
			li,
			vList = tau.VirtualListview(elList);

		vList.scrollToIndex(0);
		li = elList.children[1];
		li.scrollIntoView();
		ok(scrollview.scrollTop < 50, 'scrollTop is set to < 50');
		li = elList.children[elList.children.length/2];
		li.scrollIntoView();
		ok(scrollview.scrollTop > 50, 'scrollTop is set to > 50');
	});

	// RUN TEST 4
	asyncTest("ej.widget.micro.VirtualList tap methods", 3, function () {
		var li = elList.children[0],
			tapholdThreshold = 300;

		// Simulate tap
		triggerTouchEvent(li, 'touchstart');

		setTimeout(function() {
			triggerTouchEvent(li, 'touchend');
			ok(li.classList.contains('ui-listview-active'), 'touch hold works');

			// Simulate scrolling
			triggerTouchEvent(li, 'touchstart');
			triggerTouchEvent(li, 'touchmove', [{clientX:1000, clientY :1000}]);

			setTimeout(function() {
				triggerTouchEvent(li, 'touchend');

				// Check if highlight is removed
				ok(!li.classList.contains('ui-listview-active'), 'touch highlight remove works');

				// Simulate TAP 2 - move but keep position in distance tolerance
				triggerTouchEvent(li, 'touchstart', [{clientX: 0, clientY: 0}]);
				triggerTouchEvent(li, 'touchmove', [{clientX: 3, clientY: 3}]);

				setTimeout(function() {
					triggerTouchEvent(li, 'touchend');

					// Check if item is highlighted
					ok(li.classList.contains('ui-listview-active'), 'touch hold with tolerance distance works');

					start();
				}, tapholdThreshold);
				// End of timeout
			}, tapholdThreshold);
			// End of scrolling simulation
		}, tapholdThreshold);
		// End of tap simulation
	});


	// RUN TEST 5
	test("ej.widget.micro.VirtualList scrollTo method",  function () {
		var scrollview = elList.parentNode,
			vList = tau.VirtualListview(elList);

		vList.scrollTo(0);
		ej.utils.events.trigger(scrollview, 'scroll');

		vList.scrollTo(300);
		ej.utils.events.trigger(scrollview, 'scroll');
		ok(scrollview.scrollTop === 300, 'scrollTop is set to 300');

		vList.scrollTo(500);
		ej.utils.events.trigger(scrollview, 'scroll');

		ok(scrollview.scrollTop === 500, 'scrollTop is set to 500');
		ej.utils.events.trigger(scrollview, 'scroll');

		vList.scrollTo(2000);
		ej.utils.events.trigger(scrollview, 'scroll');
		ok(scrollview.scrollTop === 2000, 'scrollTop is set to 2000');

		vList.scrollTo(5000);
		ej.utils.events.trigger(scrollview, 'scroll');
		ok(scrollview.scrollTop === 5000, 'scrollTop is set to 5000');

		vList.scrollTo(3000);
		ej.utils.events.trigger(scrollview, 'scroll');
		ok(scrollview.scrollTop === 3000, 'scrollTop is set to 3000');

		vList.scrollTo(0);
		ej.utils.events.trigger(scrollview, 'scroll');
		ok(scrollview.scrollTop === 0, 'scrollTop is set to 0');

		vList.scrollTo(30000000);
		ej.utils.events.trigger(scrollview, 'scroll');
		ok(scrollview.scrollTop > 30000 && scrollview.scrollTop < 20000000, 'scrollTop is set to max');
	});

	// RUN TEST 6
	test("ej.widget.micro.VirtualList destroy method", 4, function () {
		var children = elList.children,
			nextDiv = elList.nextElementSibling,
			vList = tau.VirtualListview(elList);

		vList.destroy();
		equal(children.length, 0, 'Widget created 0 li elements');
		equal(elList.style.position, 'static', 'Position style is set to static');
		equal(elList.style.top, 'auto', 'Top style is not set');
		ok(nextDiv, 'After UL DIV was deleted');
	});

	// RUN TEST 7
	test("ej.widget.micro.VirtualList buffer sizing",  function () {
		var vList,
			config;

		vList = tau.VirtualListview(elList);
		vList.destroy();
		config = {
			dataLength: 10,
			bufferSize: 0,
			listItemUpdater: function () { return null; }
		};
		vList = tau.VirtualListview(elList, config);
		equal(vList.options.bufferSize, 1, 'Buffer size is set to 1');
		equal(vList.options.dataLength, 10, 'Buffer size is set to 1');
		vList.destroy();

		config = {
			dataLength: 10,
			bufferSize: 500,
			listItemUpdater: function () { return null; }
		};
		vList = tau.VirtualListview(elList, config);
		equal(vList.options.bufferSize, 9, 'Buffer size is set to 9');
		equal(vList.options.dataLength, 10, 'Buffer size is set to 10');
		vList.destroy();
	});

	fixture.style.position = 'absolute';
	fixture.style.top = '-10000px';
	fixture.style.left = '-10000px';
	fixture.style.height = '10000px';
	fixture.style.width = '10000px';

}());
