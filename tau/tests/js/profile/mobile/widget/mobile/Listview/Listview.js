/* global document, tau, define, module, test, strictEqual, asyncTest, window, ok, Promise, start */
(function () {
	"use strict";
	function runTests(engine, selectors, Page, Listview, helpers) {
		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/mobile/widget/mobile/Listview/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "mobile", function () {
					resolve();
				});
			});
		}

		module("mobile/widget/mobile/Listview", {
			setup: initHTML
		});

		test("constructor", function () {
			var listviewWidget = new Listview();

			ok(listviewWidget instanceof Listview, "Proper instance created");

			listviewWidget.destroy();
			strictEqual(listviewWidget._context, null, "Context destroyed");
		});

		test("building", function () {
			var listview = engine.instanceWidget(document.querySelector("." + Listview.classes.LISTVIEW), "Listview"),
				listviewEl = listview.element,
				canvas = listviewEl.querySelector("canvas");

			ok(canvas, "Canvas background created");
			ok(canvas.classList.contains(Listview.classes.BACKGROUND_LAYER), "Proper class for canvas created");
			strictEqual(canvas, listview._context.canvas, "Saved context is of the created canvas");
		});

		function Context2DMock(canvas) {
			this.canvas = canvas;
			this.fillStyle = "#000000";

			this._clearCalledNum = 0;
			this._firstFillRectCalledNum = 0;
			this._fillRectCalledNum = 0;
		}

		Context2DMock.prototype.clearRect = function () {
			if (this._fillRectCalledNum > 0 && this._firstFillRectCalledNum === 0) {
				this._firstFillRectCalledNum = this._fillRectCalledNum;
			}
			this._clearCalledNum++;
		};

		Context2DMock.prototype.fillRect = function () {
			this._fillRectCalledNum++;
		};

		function mockListview(listviewInstance) {
			listviewInstance._context = new Context2DMock(listviewInstance._context.canvas);
			listviewInstance._async = function (callback) {
				setTimeout(callback, 1000 / 60);
			};

			return listviewInstance._context;
		}

		asyncTest("scroll", function (assert) {
			var pageElement = document.querySelector("." + Page.classes.uiPage),
				pageWidget = engine.instanceWidget(pageElement, "Page"),
				listview,
				mockedContext;

			pageWidget.layout(true);
			pageWidget.setActive(true);
			engine.createWidgets(pageElement);
			listview = engine.instanceWidget(document.querySelector("." + Listview.classes.LISTVIEW), "Listview");
			mockedContext = mockListview(listview);

			listview.refresh();

			setTimeout(function () {
				assert.ok(listview._scrollableContainer, "Scrollable container found");
				listview._scrollableContainer.scrollTop = 100;
				listview.refresh();
				setTimeout(function () {
					assert.ok(mockedContext._clearCalledNum, "Async calls were run");
					assert.ok(mockedContext._fillRectCalledNum, "Background rectes were drawn multiple times");
					/**
					 * Test assertion has disabled because of is too dependent to test engine platform,
					 * This test needs refactoring
					 */
					//assert.equal(mockedContext._firstFillRectCalledNum, 25, "correct count of background rects drawn");
					assert.ok(parseFloat(listview._context.canvas.style.transform.replace(/[^0-9\.]+/gi, "")), "Canvas position translated according to scroll");
					start();
				}, 1000);
			}, 1000);
		});

		test("_setColoredBackground", function (assert) {
			var element = document.createElement("div"),
				disabledGradientClass = Listview.classes.GRADIENT_BACKGROUND_DISABLED,
				listview;

			if (!window.navigator.userAgent.match("PhantomJS")) {
				/**
				 * Test has been disabled in current version of PhantomJS because of classList.toggle is not full supported
				 */

				assert.equal(element.classList.contains(disabledGradientClass), false,
					"New HTML element has not class " + disabledGradientClass);

				listview = new Listview(element);

				listview._setColoredBackground(element, true);
				assert.equal(element.classList.contains(disabledGradientClass), false, "Element has not class " + disabledGradientClass);
				assert.equal(listview.options.coloredBackground, true, "Listview widget option 'coloredBackground' has been set on true");

				listview._setColoredBackground(element, false);
				assert.equal(element.classList.contains(disabledGradientClass), true, "Element has not class " + disabledGradientClass);
				assert.equal(listview.options.coloredBackground, false, "Listview widget option 'coloredBackground' has been set on false");
			} else {
				assert.ok(true, "Test has been disabled in current version of PhantomJS because of classList.toggle is not full supported ");
			}
		});

		test("_refresh", function (assert) {
			var element = document.createElement("div"),
				popupContainer = document.createElement("div"),
				listview;

			popupContainer.classList.add(Listview.classes.POPUP_LISTVIEW);

			listview = new Listview(element);
			assert.ok(!!listview, "Listview exists");

			helpers.stub(listview, "_refreshColoredBackground", function () {
				assert.ok(true, "method: _refreshColoredBackground was called");
			});
			helpers.stub(listview, "_findContainers", function () {
				assert.ok(true, "method: _findContainers was called");
			});

			/**
			 * Case 1;
			 * Colored background is enabled
			 */
			listview.options.coloredBackground = true;
			// + 1 assertion
			listview.refresh();

			/**
			 * Case 2;
			 * Colored background is disabled
			 */
			listview.options.coloredBackground = false;
			// should not new assertion
			listview.refresh();

			/**
			 * Case 3;
			 * Colored background is disabled
			 * and Listview contains in popup
			 */
			helpers.stub(selectors, "getClosestByClass", function () {
				assert.ok(true, "method: .getClosestByClass was called");
				return popupContainer;
			});

			listview.options.coloredBackground = false;
			// should not new assertion
			listview.refresh();
			ok(!popupContainer.classList.contains(Listview.classes.POPUP_LISTVIEW),
				"Popup container has not class: " + Listview.classes.POPUP_LISTVIEW);

			// Remove stubs
			helpers.restoreStub(listview, "_refreshColoredBackground");
			helpers.restoreStub(selectors, "_findContainers");
			helpers.restoreStub(selectors, "getClosestByClass");
		});

		test("_refreshColoredBackground", function (assert) {
			var element = document.createElement("div"),
				listview;

			listview = new Listview(element);

			assert.ok(!!listview, "Listview exists");
			assert.equal(typeof listview._refreshColoredBackground, "function", "Method exists");

			helpers.stub(listview, "_checkClossestPopup", function () {
				assert.ok(true, "method: ._checkClossestPopup was called");
			});
			helpers.stub(listview, "_prepareColors", function () {
				assert.ok(true, "method: ._prepareColors was called");
			});
			helpers.stub(listview, "_refreshBackgroundCanvas", function (container, element) {
				assert.ok(true, "method: ._refreshBackgroundCanvas was called");
				assert.ok(container instanceof HTMLElement, "first argument is instance of HTMLElement");
				assert.ok(element instanceof HTMLElement, "second argument is instance of HTMLElement");
			});
			helpers.stub(listview, "_frameCallback", function () {
				assert.ok(true, "method: ._frameCallback was called");
			});

			// set properties to check
			listview._redraw = false;
			listview._lastChange = 0;
			listview.element = element;
			listview._scrollableContainer = document.createElement("div");

			// call tested method
			listview._refreshColoredBackground();

			// Check property
			assert.ok(listview._redraw, "Listview property: _redraw has changed on true");
			assert.ok(listview._lastChange, "Listview property: _lastChange has changed");

			// Remove stubs
			helpers.restoreStub(listview, "_checkClossestPopup");
			helpers.restoreStub(listview, "_prepareColors");
			helpers.restoreStub(listview, "_refreshBackgroundCanvas");
			helpers.restoreStub(listview, "_frameCallback");
		});

		test("_findContainers", function (assert) {
			var element = document.getElementById("listview-1"),
				listview;

			listview = new Listview();
			assert.ok(!!listview, "Listview exists");
			assert.equal(typeof listview._findContainers, "function", "Method exists");

			listview._findContainers(element);
			assert.equal(
				listview._pageContainer,
				document.getElementById("page-1"),
				"Page container found properly"
			);
			assert.equal(
				listview._popupContainer,
				null,
				"Popup content not found, it is properly"
			);
		});

		test("_refreshBackgroundCanvas", function (assert) {
			var element = document.getElementById("listview-1"),
				container = document.getElementById("content-1"),
				canvas = document.createElement("canvas"),
				listview;

			listview = new Listview();
			assert.ok(!!listview, "Listview exists");
			assert.equal(typeof listview._refreshBackgroundCanvas, "function", "Method exists");

			listview.element = element;

			listview._context = {
				canvas: canvas
			};

			/**
			 * Case 1: container not exists
			 */
			element.style.height = "200px";
			element.style.width = "100px";
			listview._topOffset = 0;
			helpers.stub(element, "getBoundingClientRect", function () {
				assert.ok(true, "element.getBoundingClientRect() was called");
				return {
					width: 100,
					height: 200
				};
			});

			listview._refreshBackgroundCanvas(null, element);

			assert.equal(listview._canvasWidth, 100, "Property _canvasWidth has properly value 100");
			assert.equal(listview._canvasHeight, 200, "Property _canvasHeight has properly value 200");
			assert.equal(canvas.style.width, "100px", "Property canvas.style.width has properly value 100px");
			assert.equal(canvas.style.height, "200px", "Property canvas.style.height has properly value 200px");

			helpers.restoreStub(element, "getBoundingClientRect");

			/**
			 * Case 2: container exists and widget has top offset
			 */
			element.style.height = "300px";
			element.style.width = "150px";
			container.style.height = "200";
			listview._topOffset = 100;
			helpers.stub(element, "getBoundingClientRect", function () {
				assert.ok(true, "element.getBoundingClientRect() was called");
				return {
					width: 150,
					height: 300
				};
			});

			listview._refreshBackgroundCanvas(container, element);

			assert.equal(listview._canvasWidth, 150, "Property _canvasWidth has properly value 150");
			assert.equal(listview._canvasHeight, 400, "Property _canvasHeight has properly value 300");
			assert.equal(canvas.style.width, "150px", "Property canvas.style.width has properly value 150px");
			assert.equal(canvas.style.height, "400px", "Property canvas.style.height has properly value 300px");

			helpers.restoreStub(element, "getBoundingClientRect");
		});

		test("_checkClossestPopup", function (assert) {
			var listview,
				scrollableContent = document.createElement("div");

			/**
			 * Case 1: popup has content
			 */
			listview = new Listview();
			assert.ok(!!listview, "Listview exists");
			assert.equal(typeof listview._checkClossestPopup, "function", "Method exists");

			listview._popupContainer = document.getElementById("popup-with-listview-1");
			listview._checkClossestPopup();

			assert.ok(
				listview._popupContainer.classList.contains(Listview.classes.POPUP_LISTVIEW),
				"Popup which contains listview has class ui-popup-listview"
			);
			assert.equal(
				listview._scrollableContainer,
				document.getElementById("popup-content"),
				"Scrollable container for listview has been replaced by popup content"
			);

			/**
			 * Case 2: popup has not content
			 */
			listview = new Listview();

			listview._popupContainer = document.getElementById("popup-with-listview-2");
			listview._scrollableContainer = scrollableContent;
			listview._checkClossestPopup();

			assert.ok(
				listview._popupContainer.classList.contains(Listview.classes.POPUP_LISTVIEW),
				"Popup which contains listview has class ui-popup-listview"
			);
			assert.equal(
				listview._scrollableContainer,
				scrollableContent,
				"Scrollable container for listview has not changed"
			);
		});

	}

	if (typeof define === "function") {
		define([
			"../../../../../../../src/js/core/engine",
			"../../../../../../../src/js/core/util/selectors",
			"../../../../../../../src/js/profile/mobile/widget/mobile/Page"
		], function (engine, selectors, Page) {
			return runTests.bind(null, engine, selectors, Page);
		});
	} else {
		runTests(
			tau.engine,
			tau.util.selectors,
			tau.widget.mobile.Page,
			tau.widget.mobile.Listview,
			window.helpers
		);
	}
}());
