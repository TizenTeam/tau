/* global document, tau, define, module, test, strictEqual, asyncTest, window, ok, Promise */
(function () {
	"use strict";
	function runTests(engine, Page, Listview, helpers) {
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
					assert.equal(mockedContext._firstFillRectCalledNum, 25, "correct count of background rects drawn");
					assert.ok(parseFloat(listview._context.canvas.style.transform.replace(/[^0-9\.]+/gi, "")), "Canvas position translated according to scroll");
					start();
				}, 1000);
			}, 1000);
		});

	}

	if (typeof define === "function") {
		define([
			"../../../../../../../src/js/core/engine",
			"../../../../../../../src/js/profile/mobile/widget/mobile/Page"
		], function (engine, Page) {
			return runTests.bind(null, engine, Page);
		});
	} else {
		runTests(tau.engine,
			tau.widget.mobile.Page,
			tau.widget.mobile.Listview,
			window.helpers
		);
	}
}());
