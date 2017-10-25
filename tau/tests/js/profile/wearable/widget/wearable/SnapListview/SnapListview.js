/* global QUnit, define, tau, Promise, expect, start */
(function () {
	"use strict";
	function runTests(SnapListview, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/SnapListview/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "wearable", function () {
					resolve();
				});
			});
		}

		function clearHTML() {
			helpers.removeTAUStyle(document);
		}

		QUnit.module("profile/wearable/widget/wearable/SnapListview", {
			setup: initHTML,
			teardown: clearHTML
		});

		QUnit.test("constructor", function (assert) {
			var snaplistWidget = new SnapListview();

			assert.deepEqual(snaplistWidget._ui, {
				page: null,
				scrollableParent: {
					element: null,
					height: 0
				},
				childItems: {}
			}, "_ui was correct initialized");

			assert.deepEqual(snaplistWidget.options, {
				selector: "li:not(.ui-listview-divider)",
				animate: "none",
				scale: {
					from: 0.67,
					to: 1
				},
				opacity: {
					from: 0.7,
					to: 1
				}
			}, "options was correct initialized");

			assert.deepEqual(snaplistWidget._listItems, [], "_listItems was initialized");
			assert.deepEqual(snaplistWidget._callbacks, {}, "_callbacks was initialized");
			assert.equal(snaplistWidget._scrollEndTimeoutId, null, "_scrollEndTimeoutId was initialized");
			assert.equal(snaplistWidget._isScrollStarted, false, "_isScrollStarted was initialized");
			assert.equal(snaplistWidget._selectedIndex, null, "_selectedIndex was initialized");
			assert.equal(snaplistWidget._enabled, true, "_enabled was initialized");
			assert.equal(snaplistWidget._isTouched, false, "_isTouched was initialized");
			assert.equal(snaplistWidget._scrollEventCount, 0, "_scrollEventCount was initialized");

		});

		QUnit.test("_initSnapListview", 9, function (assert) {
			var snaplistWidget = new SnapListview(),
				element = document.getElementById("snap-list");

			helpers.stub(snaplistWidget, "_listItemAnimate", function () {
				assert.ok(true);
			});

			snaplistWidget._initSnapListview(element);

			assert.equal(snaplistWidget._ui.page, document.body, "page is set as document.body");

			assert.equal(snaplistWidget._ui.scrollableParent.element, document.body, "scollable element is correct set");
			assert.equal(snaplistWidget._ui.scrollableParent.element.classList.contains("ui-snap-container"), true, "scrollable element has containar class");
			assert.equal(snaplistWidget._ui.scrollableParent.height, document.body.offsetHeight, "scroller height is correct detected");

			assert.equal(snaplistWidget._selectedIndex, null, "selected index is correct initilaized");
			assert.equal(snaplistWidget._listItems.length, 9, "list items are correct detected");

			element.firstElementChild.classList.add(SnapListview.classes.SNAP_LISTVIEW_SELECTED);
			snaplistWidget._initSnapListview(element);
			assert.equal(typeof snaplistWidget._selectedIndex, "number", "selected index is correct initilaized");

			helpers.restoreStub(snaplistWidget, "_listItemAnimate");
		});

		QUnit.test("_refresh", 1, function (assert) {
			var snaplistWidget = new SnapListview(),
				element = document.getElementById("snap-list");

			snaplistWidget._build(element);
			snaplistWidget._init(element);

			helpers.stub(snaplistWidget, "_initSnapListview", function () {
				assert.ok(true, "method: _inistSnapListview was called");
			});
			snaplistWidget._refresh(element);
			helpers.restoreStub(snaplistWidget, "_initSnapListview");
		});

		QUnit.test("_destroy", 2, function (assert) {
			var snaplistWidget = new SnapListview();

			snaplistWidget._scrollEndTimeoutId = true;
			helpers.stub(snaplistWidget, "_unbindEvents", function () {
				assert.ok(true, "method: _unbindEvents was called");
			});
			snaplistWidget._destroy();
			helpers.restoreStub(snaplistWidget, "_inbindEvents");
			assert.ok(!snaplistWidget._scrollEndTimeoutId, "scrollEndTimeoutId was cleared");
		});

		QUnit.test("_enable", 4, function (assert) {
			var snaplistWidget = new SnapListview(),
				element = document.getElementById("snap-list");

			snaplistWidget._enabled = false;
			snaplistWidget._ui.scrollableParent.element = element.parentElement;

			helpers.stub(element.parentElement.classList, "remove", function (className) {
				assert.ok(true, "method: remove was called");
				assert.ok(className === SnapListview.classes.SNAP_DISABLED, "called with proper element");
			});
			helpers.stub(snaplistWidget, "_refresh", function () {
				assert.ok(true, "method: _refresh was called");
			});
			snaplistWidget._enable();
			helpers.restoreStub(element.classList, "remove");
			helpers.restoreStub(snaplistWidget, "_refresh");

			assert.ok(snaplistWidget._enabled, "widget was enabled");
		});

		QUnit.test("_disable", 3, function (assert) {
			var snaplistWidget = new SnapListview(),
				element = document.getElementById("snap-list");

			snaplistWidget._enabled = true;
			snaplistWidget._ui.scrollableParent.element = element.parentElement;

			helpers.stub(element.parentElement.classList, "add", function (className) {
				assert.ok(true, "method: add was called");
				assert.ok(className === SnapListview.classes.SNAP_DISABLED, "called with proper element");
			});
			snaplistWidget._disable();
			helpers.restoreStub(element.classList, "add");

			assert.ok(!snaplistWidget._enabled, "widget was disabled");
		});

		QUnit.test("_build", 3, function (assert) {
			var snaplistWidget = new SnapListview(),
				element = document.getElementById("snap-list"),
				element2 = document.getElementById("snap-list-2");

			helpers.stub(ns, "warn", function (info) {
				assert.equal(info, "Can't create SnapListview on Listview element", "info is correct");
			});

			snaplistWidget._build(element);

			assert.equal(element.classList.contains("ui-snap-listview"), true, "class ui-snap-listview is added ");

			ns.engine.instanceWidget(element2, "Listview");

			snaplistWidget._build(element2);

			assert.equal(element2.classList.contains("ui-snap-listview"), false, "class ui-snap-listview is added ");

			helpers.restoreStub(ns, "warn");
		});

		QUnit.test("_listItemAnimate", 1, function (assert) {
			var snaplistWidget = new SnapListview({animate: "scale"}),
				element = document.getElementById("snap-list");

			snaplistWidget._build(element);
			snaplistWidget._init(element);
			//set any animation
			snaplistWidget.options.animate = "scroll";

			helpers.stub(ns.util.array, "forEach", function (items, item) {
				assert.ok(true, "method: ns.utill.array was called");
			});

			snaplistWidget._listItemAnimate();

			helpers.restoreStub(ns.util.array, "forEach");
		});

		QUnit.test("scrollHandler", 3, function (assert) {
			var snaplistWidget = new SnapListview({animate: "scale"}),
				element = document.getElementById("snap-list");

			snaplistWidget._build(element);
			snaplistWidget._init(element);

			snaplistWidget._isScrollStarted = true;
			snaplistWidget._isTouched = true;

			helpers.stub(snaplistWidget, "_listItemAnimate", function () {
				assert.ok(true, "method: _listItemAnimate was called");
			});

			assert.equal(snaplistWidget._scrollEventCount, 0, "not event one scrollHandler was generated");
			snaplistWidget._callbacks.scroll(snaplistWidget);
			assert.equal(snaplistWidget._scrollEventCount, 1, "scrollHandler was generated");

			helpers.restoreStub(snaplistWidget, "_listItemAnimate");
		});

		QUnit.test("getScrollableParent", 4, function (assert) {
			var snaplistWidget = new SnapListview({animate: "scale"}),
				element = document.getElementById("snap-list");

			snaplistWidget._build(element);
			snaplistWidget._init(element);

			ns.util.scrolling.enable(element, "x");

			helpers.stub(ns.util.selectors, "getClosestByClass", function () {
				assert.ok(true, "method: getClosestByClass was called");
			});
			// when given element is current scrolling element
			snaplistWidget._initSnapListview(element);


			assert.ok(element.classList.contains(SnapListview.classes.SNAP_CONTAINER),
				"container class is added to the same element");
			ns.util.scrolling.disable(element, "x");

			// when scrollable element has overflow-y set to scroll
			element.style["overflowY"] = "scroll";

			snaplistWidget._initSnapListview(element);

			assert.ok(element.classList.contains(SnapListview.classes.SNAP_CONTAINER),
				"container class is added sucessfully");

			helpers.restoreStub(ns.util.selectors, "getClosestByClass");

		});

		QUnit.test("getSelectedIndex", 1, function (assert) {
			var snaplistWidget = new SnapListview(),
				number = -1;

			number = snaplistWidget.getSelectedIndex();
			assert.ok(number > -1, "get the proper index");
		});

		QUnit.asyncTest("_scrollToPosition", 3, function (assert) {
			var snaplistWidget = new SnapListview(),
				element = document.getElementById("snap-list"),
				callback = function () {
					start();
					assert.ok(true, "index was set and callback called, position is set");
				},
				inedxOutOfRange = false,
				index = -1;

			// in phantom window.performacne object is not available
			if (window.navigator.userAgent.match("PhantomJS")) {
				expect(0);
				start();
			} else {
				expect(3);
				helpers.stub(window.performance, "now", function () {
					assert.ok(true, "method: window.performance.now was called");
					return +new Date();
				});
				inedxOutOfRange = !snaplistWidget._scrollToPosition(index, callback);
				assert.ok(inedxOutOfRange, "index in not in the range");

				index = 1;
				snaplistWidget._enabled = true;
				snaplistWidget._currentIndex = 0;
				snaplistWidget._initSnapListview(element);

				snaplistWidget._scrollToPosition(index, callback);
				helpers.restoreStub(window.performance, "now");
			}
		});

		QUnit.asyncTest("scrollAnimation", 3, function (assert) {
			var snaplistWidget = new SnapListview(),
				element = document.getElementById("snap-list"),
				callback = function () {
					start();
					assert.ok(true, "index was set and callback called, position is set");
				},
				index = -1;

			// in phantom window.performacne object is not available
			if (window.navigator.userAgent.match("PhantomJS")) {
				expect(0);
				start();
			} else {
				expect(3);
				helpers.stub(window.performance, "now", function () {
					assert.ok(true, "method: window.performance.now was called");
					return +new Date();
				});
				SnapListview.animationTimer = null;
				snaplistWidget._scrollToPosition(index, callback);

				index = 1;
				snaplistWidget._enabled = true;
				snaplistWidget._currentIndex = 0;
				snaplistWidget._initSnapListview(element);
				helpers.stub(window, "cancelAnimationFrame", function () {
					assert.ok(true, "method: cancelAnimationFrame was called and animation was canceled");
				});
				SnapListview.animationTimer = 1;
				snaplistWidget._scrollToPosition(index, callback);
				helpers.restoreStub(window, "cancelAnimationFrame");
				helpers.restoreStub(window.performance, "now");
			}
		});

		QUnit.test("handleEvent", 1, function (assert) {
			var snaplistWidget = new SnapListview(),
				event = {
					type: "rotarydetent"
				};

			snaplistWidget._onRotary = function (_event) {
				assert.equal(_event, event, "Event is first argument");
			};
			snaplistWidget.handleEvent(event);
			snaplistWidget.handleEvent({});
		});

		QUnit.test("_onRotary", 4, function (assert) {
			var snaplistWidget = new SnapListview(),
				indexes = [4, 2],
				count = 0;

			snaplistWidget._listItems = new Array(10);
			snaplistWidget.getSelectedIndex = function () {
				assert.ok(true, "getSelectedIndex was called");
				return 3;
			};
			snaplistWidget.scrollToPosition = function (index) {
				assert.equal(index, indexes[count++], "index is correct");
				return true;
			};
			snaplistWidget._onRotary({
				detail: {
					direction: "CW"
				}
			});
			snaplistWidget._onRotary({
				detail: {
					direction: "CCW"
				}
			});
		});
	}
	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.SnapListview,
			window.helpers, tau);
	}
}());
