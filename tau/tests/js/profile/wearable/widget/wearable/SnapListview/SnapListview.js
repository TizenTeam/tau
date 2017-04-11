/* global QUnit, ns, define, tau, Promise */
(function () {
	"use strict";
	function runTests(SnapListview, helpers) {
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

		QUnit.test("_initSnapListview", function (assert) {
			var snaplistWidget = new SnapListview(),
				element = document.getElementById("snap-list");

			assert.expect(7);

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
		});

		QUnit.test("_build", function (assert) {
			var snaplistWidget = new SnapListview(),
				element = document.getElementById("snap-list"),
				element2 = document.getElementById("snap-list-2");

			assert.expect(3);

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
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.SnapListview,
			window.helpers);
	}
}());
