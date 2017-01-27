/* global expect, document, tau, define, module, test, strictEqual, initFixture, asyncTest, window, ok */
(function () {
	"use strict";
	function runTests(testedObjects, helpers) {
		var engine = testedObjects.engine,
				Listview = testedObjects.Listview,
				Page = testedObjects.Page;

		function initHTML() {
			// @IMPORTANT 42 list elements
			var HTML = "<div class='ui-page'>\
				<div class='ui-content'>\
						<ul class='ui-listview'>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
								<li>list element</li>\
						</ul>\
				</div>\
				</div>",
				parent = document.getElementById("qunit-fixture") || initFixture();
			parent.innerHTML = HTML;
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

		asyncTest("scroll", function () {
			engine.createWidgets(document.querySelector("." + Page.classes.uiPage));
			var listview = engine.instanceWidget(document.querySelector("." + Listview.classes.LISTVIEW), "Listview"),
				mockedContext = mockListview(listview);

			listview.refresh();
			setTimeout(function () {
				ok(listview._scrollableContainer, "Scrollable container found");
				listview._scrollableContainer.scrollTop = 100;
				listview.refresh();
				setTimeout(function () {
					ok(mockedContext._clearCalledNum, "Async calls were run");
					ok(mockedContext._fillRectCalledNum, "Background rectes were drawn multiple times");
					equal(mockedContext._firstFillRectCalledNum, 42, "42 background rects drawn");
					ok(parseFloat(listview._context.canvas.style.transform.replace(/[^0-9\.]+/gi, "")), "Canvas position translated according to scroll");
					start();
				}, 1000);
			}, 1000);
		});

	}
	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests({
			engine: tau.engine,
			Listview: tau.widget.mobile.Listview,
			Page: tau.widget.core.Page
		},
			window.helpers
		);
	}
}());
