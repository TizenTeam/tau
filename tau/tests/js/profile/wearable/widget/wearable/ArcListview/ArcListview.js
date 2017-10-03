/* global QUnit, ns, define, tau, Promise, expect, start */
(function () {
	"use strict";
	function runTests(ArcListview, helpers) {
		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/ArcListview/test-data/sample.html"),
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

		QUnit.module("profile/wearable/widget/wearable/ArcListview", {
			setup: initHTML,
			teardown: clearHTML
		});

		QUnit.test("constructor", function (assert) {
			var arclistWidget = new ArcListview();

			assert.deepEqual(arclistWidget._ui, {
				scroller: null,
				selection: null
			}, "_ui was correct initialized");

			assert.deepEqual(arclistWidget.options, {
				bouncingTimeout: 1000,
				visibleItems: 3,
				ellipsisA: 333,
				ellipsisB: 180,
				selectedIndex: 0
			}, "options was correct initialized");
		});

		QUnit.test("createItem", function (assert) {
			assert.deepEqual(ArcListview.createItem(), {
				element: null,
				id: 0,
				y: 0,
				rect: null,
				current: {
					scale: -1
				},
				from: null,
				to: null,
				repaint: false
			}, "createItem return correct object");
		});

		QUnit.test("calcFactors", function (assert) {
			var factors = ArcListview.calcFactors(333, 180);

			assert.equal(factors.length, 181, "calcFactors return correct array");
			assert.equal(factors[0], 1, "calcFactors return correct value at 0");
			assert.equal(factors[factors.length - 1], 0, "calcFactors return correct value at last position");
		});

		QUnit.test("getSelectedIndex", function (assert) {
			var ArclistWidget = new ArcListview();

			expect(1);

			ArclistWidget._state.currentIndex = 3;

			assert.equal(ArclistWidget.getSelectedIndex(), 3, "getSelectedIndex return correct value.");
		});

		QUnit.test("scrollToPosition", function (assert) {
			var ArclistWidget = new ArcListview();

			expect(12);

			ArclistWidget._state.items.length = 3;
			ArclistWidget._state.currentIndex = 4;

			ArclistWidget.trigger = function (name, data) {
				assert.equal(name, "change", "Triggered event change");
				assert.equal(data.unselected, 4, "Triggered event with correct data");
			};

			ArclistWidget._roll = function () {
				assert.ok(true, "_roll was called");
			};

			ArclistWidget.scrollToPosition(1);

			assert.equal(ArclistWidget._state.toIndex, 1, "scrollToPosition change to index.");

			ArclistWidget.scrollToPosition(20);

			assert.equal(ArclistWidget._state.toIndex, 2, "scrollToPosition change to index.");

			ArclistWidget.scrollToPosition(-2);

			assert.equal(ArclistWidget._state.toIndex, 0, "scrollToPosition change to index.");
		});

		QUnit.test("_updateScale", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list");

			expect(1);
			listWidget.element = element;
			listWidget._state.currentIndex = 2;
			listWidget._state.items = [].map.call(element.querySelectorAll("li"), function (liElement, index) {
				return {
					y: index * 100,
					height: 100,
					current: {
						scale: 0
					},
					id: index
				};
			});
			listWidget._updateScale(100);

			assert.deepEqual(listWidget._state.items, [
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 0,
					"to": null,
					"y": 0
				},
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 1,
					"to": null,
					"y": 100
				},
				{
					"current": {
						"scale": 0
					},
					"from": {
						"scale": 0
					},
					"height": 100,
					"id": 2,
					"to": {
						"scale": 0.8958064164776166
					},
					"y": 200
				},
				{
					"current": {
						"scale": 0
					},
					"from": {
						"scale": 0
					},
					"height": 100,
					"id": 3,
					"to": {
						"scale": 0.9682458365518543
					},
					"y": 300
				},
				{
					"current": {
						"scale": 0
					},
					"from": {
						"scale": 0
					},
					"height": 100,
					"id": 4,
					"to": {
						"scale": 0.5925202502139317
					},
					"y": 400
				},
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 5,
					"to": null,
					"y": 500
				},
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 6,
					"to": null,
					"y": 600
				},
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 7,
					"to": null,
					"y": 700
				},
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 8,
					"to": null,
					"y": 800
				}
			], "_state.items are correctly updated");
		});

		QUnit.test("_drawItem", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				removeChild = function () {
					assert.ok("remove child was called");
				},
				item = {
					element: {
						style: {},
						parentNode: {
							removeChild: removeChild
						}
					},
					current: {
						scale: 1
					},
					repaint: true
				};

			expect(4);
			listWidget.element = element;
			listWidget._state.currentIndex = 2;
			listWidget._carousel = {
				items: [{
					carouselElement: {
						appendChild: function () {
							assert.ok("append child was called");
						}
					}
				}]
			};

			listWidget._drawItem(item, 0);

			assert.deepEqual(item,
				{
					"current": {
						"scale": 1
					},
					"element": {
						"style": {
							"opacity": 1.15,
							"transform": "translateY(-50%) scale(1)"
						},
						"parentNode": {
							"removeChild": removeChild
						}
					},
					"repaint": false
				}, "_state.items are correctly updated");

			item.repaint = false;
			item.current.scale = 0;
			listWidget._drawItem(item, 0);

			assert.deepEqual(item,
				{
					"current": {
						"scale": 0
					},
					"element": {
						"parentNode": {
							"removeChild": removeChild
						},
						"style": {
							"opacity": 1.15,
							"transform": "translateY(-50%) scale(1)"
						}
					},
					"repaint": false
				}, "_state.items are correctly updated");
		});

		QUnit.test("_selectItem", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				liElement = element.querySelector("li"),
				height = liElement.getBoundingClientRect().height + "px";

			expect(3);
			listWidget._ui.arcListviewSelection = element;
			listWidget._state = {
				items: [{
					element: liElement
				}]
			};

			listWidget._selectItem(0);

			helpers.triggerEvent(liElement, "transitionend");

			assert.ok(element.classList.contains("ui-arc-listview-selection-show"), "list selection element is active");
			assert.equal(element.style.height, height, "list selection element has proper height");
			assert.ok(liElement.classList.contains("ui-arc-listview-selected"), "list selection element is active");
		});

		QUnit.test("_init", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				pageElement = document.getElementById("arc-list-page"),
				testStub = function () {
					assert.ok("Called function from flow");
				};

			expect(5);

			helpers.stub(ArcListview, "calcFactors", function (a, b) {
				assert.equal(a, listWidget.options.ellipsisA, "a was correct assign");
				assert.equal(b, listWidget.options.ellipsisB, "b was correct assign");
			});

			listWidget.element = element;
			listWidget._setAnimatedItems = testStub;
			listWidget._refresh = testStub;
			listWidget._scroll = testStub;
			listWidget._ui.page = pageElement;

			listWidget._init();

			helpers.restoreStub(ArcListview, "calcFactors");
		});

		QUnit.asyncTest("handleEvent", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				testStub = function () {
					assert.ok("Called event callback function");
				};

			expect(6);
			listWidget.element = element;
			listWidget._onTouchMove = testStub;
			listWidget._onRotary = testStub;
			listWidget._onTouchStart = testStub;
			listWidget._onTouchEnd = testStub;
			listWidget._onChange = testStub;
			listWidget._onClick = testStub;
			listWidget._selectItem = testStub;
			listWidget._items = [
				{}
			];

			listWidget.handleEvent({
				type: "touchmove"
			});
			listWidget.handleEvent({
				type: "rotarydetent"
			});
			listWidget.handleEvent({
				type: "touchstart"
			});
			listWidget.handleEvent({
				type: "touchend"
			});
			listWidget.handleEvent({
				type: "change"
			});
			listWidget.handleEvent({
				type: "vclick"
			});
			listWidget.handleEvent({
				type: "click"
			});
			setTimeout(start, 100);
		});

		QUnit.test("_bindEvents", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				page = element.parentElement.parentElement,
				arcListviewCarousel = element.parentElement;

			listWidget.element = element;
			listWidget._ui.page = page;
			listWidget._ui.arcListviewCarousel = arcListviewCarousel;
			listWidget._bindEvents();

			expect(7);

			listWidget.handleEvent = function (_event) {
				assert.ok(_event, "Event was catched");
			};

			helpers.triggerEvent(page, "touchstart", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(page, "touchmove", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(page, "touchend", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(arcListviewCarousel, "vclick");
			helpers.triggerEvent(document, "rotarydetent");
			helpers.triggerEvent(element, "change");
			helpers.triggerEvent(page, "pageshow");

			listWidget._unbindEvents();

		});

		QUnit.test("_unbindEvents", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				page = element.parentElement.parentElement,
				arcListviewCarousel = element.parentElement;

			listWidget.element = element;
			listWidget._ui.page = page;
			listWidget._ui.arcListviewCarousel = arcListviewCarousel;
			listWidget._bindEvents();
			listWidget._unbindEvents();

			expect(0);

			listWidget.handleEvent = function (_event) {
				assert.ok(_event);
			};

			helpers.triggerEvent(page, "touchstart", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(page, "touchmove", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(page, "touchend", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(arcListviewCarousel, "vclick");
			helpers.triggerEvent(document, "rotarydetent");
			helpers.triggerEvent(element, "change");
			helpers.triggerEvent(page, "pageshow");
		});

		QUnit.test("_build", function (assert) {
			var ArclistWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				element2 = document.getElementById("arc-list-2");

			expect(3);

			helpers.stub(ns, "warn", function (info) {
				assert.equal(info, "Can't create Listview on SnapListview element", "info is correct");
			});

			ArclistWidget._build(element);

			assert.equal(element.classList.contains("ui-arc-listview"), true, "class ui-arc-listview is added ");

			ns.engine.instanceWidget(element2, "SnapListview");

			ArclistWidget._build(element2);

			assert.equal(element2.classList.contains("ui-arc-listview"), false, "class ui-arc-listview is added ");

			helpers.restoreStub(ns, "warn");
		});

		QUnit.test("getSelectedIndex", function (assert) {
			var ArclistWidget = new ArcListview();

			expect(1);

			ArclistWidget._state.currentIndex = 3;

			assert.equal(ArclistWidget.getSelectedIndex(), 3, "getSelectedIndex return correct value.");
		});

		QUnit.test("scrollToPosition", function (assert) {
			var ArclistWidget = new ArcListview();

			expect(12);

			ArclistWidget._state.items.length = 3;
			ArclistWidget._state.currentIndex = 4;

			ArclistWidget.trigger = function (name, data) {
				assert.equal(name, "change", "Triggered event change");
				assert.equal(data.unselected, 4, "Triggered event with correct data");
			};

			ArclistWidget._roll = function () {
				assert.ok(true, "_roll was called");
			};

			ArclistWidget.scrollToPosition(1);

			assert.equal(ArclistWidget._state.toIndex, 1, "scrollToPosition change to index.");

			ArclistWidget.scrollToPosition(20);

			assert.equal(ArclistWidget._state.toIndex, 2, "scrollToPosition change to index.");

			ArclistWidget.scrollToPosition(-2);

			assert.equal(ArclistWidget._state.toIndex, 0, "scrollToPosition change to index.");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.ArcListview,
			window.helpers);
	}
}());
