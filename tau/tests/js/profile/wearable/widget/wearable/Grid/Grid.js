/* global QUnit, define, tau, Promise, expect */
(function () {
	"use strict";
	function runTests(Grid, helpers) {
		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/Grid/test-data/sample.html"),
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

		QUnit.module("profile/wearable/widget/wearable/Grid", {
			setup: initHTML,
			teardown: clearHTML
		});

		QUnit.test("constructor", function (assert) {
			var gridWidget = new Grid();

			assert.deepEqual(gridWidget._ui, {
				container: null
			}, "_ui was correct initialized");

			assert.deepEqual(gridWidget.options, {
				mode: "3x3",
				scrollbar: true,
				lines: 3
			}, "options was correct initialized");

			assert.equal(gridWidget._currentIndex, -1, "_currentIndex was initialized")
		});

		QUnit.test("handleEvent", function (assert) {
			var gridWidget = new Grid();

			gridWidget._onRotary = function (event) {
				assert.equal(typeof event, "object", "event is object");
				assert.equal(event.type, "rotarydetent", "event.type is 'rotarydetent'");
			};

			gridWidget._onClick = function (event) {
				assert.equal(typeof event, "object", "event is object");
				assert.equal(event.type, "click", "event.type is 'click'");
			};

			gridWidget._onHWKey = function (event) {
				assert.equal(typeof event, "object", "event is object");
				assert.equal(event.type, "tizenhwkey", "event.type is 'tizenhwkey'");
			};

			gridWidget._onPopState = function (event) {
				assert.equal(typeof event, "object", "event is object");
				assert.equal(event.type, "popstate", "event.type is 'popstate'");
			};

			gridWidget._onScroll = function (event) {
				assert.equal(event, undefined, "called without any parameter");
			};

			expect(9);

			gridWidget.handleEvent({
				type: "rotarydetent"
			});
			gridWidget.handleEvent({
				type: "click"
			});
			gridWidget.handleEvent({
				type: "tizenhwkey"
			});
			gridWidget.handleEvent({
				type: "scroll"
			});
			gridWidget.handleEvent({
				type: "mousemove"
			});
			gridWidget.handleEvent({
				type: "popstate"
			});
		});

		QUnit.test("_bindEvents", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui = {
				container: element
			};

			gridWidget._bindEvents(element);
			gridWidget.element = element;

			expect(5);

			gridWidget.handleEvent = function (_event) {
				assert.ok(_event, "Event was catched");
			};

			helpers.triggerEvent(document, "rotarydetent");
			helpers.triggerEvent(window, "popstate");
			helpers.triggerEvent(element, "click");
			helpers.triggerEvent(window, "tizenhwkey");
			helpers.triggerEvent(element, "scroll");

			gridWidget._unbindEvents();
		});

		QUnit.test("_unbindEvents", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui = {
				container: element
			};

			gridWidget._bindEvents(element);
			gridWidget.element = element;

			expect(5);

			gridWidget.handleEvent = function (_event) {
				assert.ok(_event, "Event was catched");
			};

			helpers.triggerEvent(document, "rotarydetent");
			helpers.triggerEvent(window, "popstate");
			helpers.triggerEvent(element, "click");
			helpers.triggerEvent(window, "tizenhwkey");
			helpers.triggerEvent(element, "scroll");

			gridWidget._unbindEvents();

			helpers.triggerEvent(document, "rotarydetent");
			helpers.triggerEvent(window, "popstate");
			helpers.triggerEvent(element, "click");
			helpers.triggerEvent(window, "tizenhwkey");
			helpers.triggerEvent(element, "scroll");
		});

		QUnit.test("_onScroll", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui.container = element;
			gridWidget.trigger = function (eventName, eventDetails) {
				assert.equal(eventName, "change", "event is correct");
				assert.equal(eventDetails.active, 7, "eventDetails.active is correct");
			};

			gridWidget._findItemIndexByScroll = function (_element) {
				assert.equal(_element, element, "argument element is correct");
				return 7;
			};

			expect(3);

			gridWidget._onScroll();
		});

		QUnit.test("_build", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._setScrollbar = function (_element, optionsScrollbar) {
				assert.equal(_element, element, "first argument is element");
				assert.equal(optionsScrollbar, true, "default options.scrollbar is true");
			};

			expect(4);

			assert.equal(gridWidget._build(element), element, "_build return element");
			assert.equal(element.parentElement.className, "ui-grid-container", "correct create container");
		});

		QUnit.test("_setScrollbar", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui.container = element;

			expect(2);

			gridWidget._setScrollbar(null, true);
			assert.equal(element.getAttribute("tizen-circular-scrollbar"), "", "tizen-circular-scrollbar is set");
			gridWidget._setScrollbar(null, false);
			assert.equal(element.getAttribute("tizen-circular-scrollbar"), null, "tizen-circular-scrollbar is set");
		});

		QUnit.test("_getGridSize", function (assert) {
			var gridWidget = new Grid();

			gridWidget._items = new Array(7);
			gridWidget._setLines(3);

			assert.equal(gridWidget._getGridSize("3x3"), 501.5, "aaa");
			assert.equal(gridWidget._getGridSize("image"), 2520, "aaa");
			assert.equal(gridWidget._getGridSize("thumbnail"), 1799, "aaa");
			assert.equal(gridWidget._getGridSize(""), 360, "aaa");
		});

		QUnit.test("_onClick", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			expect(6);

			gridWidget.element = element;
			gridWidget.options = {
				mode: "3x3"
			};
			gridWidget.mode = function (type) {
				assert.equal(typeof type, "string", "mode was called with scring argument");
			};

			gridWidget._findChildIndex = function (target) {
				assert.equal(target, element, "_findChildIndex was called with element");
				return -1;
			};

			gridWidget._onClick({
				target: element
			});
			assert.equal(gridWidget._currentIndex, -1, "self._currentIndex is changed");

			gridWidget.options = {
				mode: "image"
			};
			gridWidget._onClick({
				target: element
			});
			assert.equal(gridWidget._currentIndex, -1, "self._currentIndex is changed");
		});

		QUnit.test("_onPopState", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid"),
				event = {
					preventDefault: function () {
						assert.ok("called preventDefault");
					},
					stopImmediatePropagation: function () {
						assert.ok("called stopImmediatePropagation");
					}
				};

			expect(10);

			gridWidget._findItemIndexByScroll = function (target) {
				assert.equal(target, element, "_findItemIndexByScroll was called with element");
				return -1;
			};

			gridWidget._ui.container = element;
			gridWidget._items = [1, 1, 1];
			gridWidget.options = {
				mode: "image"
			};
			gridWidget.mode = function (type) {
				assert.equal(typeof type, "string", "mode was called with scring argument");
			};

			gridWidget._onPopState(event);
			assert.equal(gridWidget._currentIndex, -1, "self._currentIndex is changed");

			gridWidget.options = {
				mode: "thumbnail"
			};
			gridWidget._onPopState(event);
			assert.equal(gridWidget._currentIndex, -1, "self._currentIndex is changed");
		});

		QUnit.test("_onHWKey", function (assert) {
			var gridWidget = new Grid(),
				event = {
					keyName: "back"
				};

			expect(1);
			gridWidget._onPopState = function (_event) {
				assert.equal(_event, event, "_onPopState was called with argunet event");
			};

			gridWidget._onHWKey(event);
		});

		QUnit.test("_changeModeTo3x3", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid"),
				event = {
					keyName: "back"
				};

			expect(4);
			gridWidget.element = element;
			gridWidget._getGridSize = function (type) {
				assert.equal(type, "3x3", "_getGridSize was called with 3x3");
				return 123
			};

			gridWidget._changeModeTo3x3(event);

			assert.equal(element.className, "ui-grid-3x3", "_onPopState was called with argunet event");
			assert.equal(gridWidget.options.mode, "3x3", "options.mode is set to 3x3");
			assert.equal(element.style.width, "123px", "element.style.width is set to 3x3");
		});

		QUnit.test("_assembleItemsTo3x3", function (assert) {
			var gridWidget = new Grid(),
				items = [
					{ to: {} },
					{ to: {} },
					{ to: {} },
					{ to: {} },
					{ to: {} }
				];

			gridWidget._setLines(3);
			gridWidget._assembleItemsTo3x3(items);
			assert.deepEqual(items, [
				{
					"to": {
						"position": {
							"left": 68.5,
							"top": -101
						},
						"scale": 0.3027
					}
				},
				{
					"to": {
						"position": {
							"left": 11,
							"top": 0
						},
						"scale": 0.3027
					}
				},
				{
					"to": {
						"position": {
							"left": 68.5,
							"top": 101
						},
						"scale": 0.3027
					}
				},
				{
					"to": {
						"position": {
							"left": 183.5,
							"top": -101
						},
						"scale": 0.3027
					}
				},
				{
					"to": {
						"position": {
							"left": 126,
							"top": 0
						},
						"scale": 0.3027
					}
				}
			], "_assembleItemsTo3x3");
		});

		QUnit.test("mode", function (assert) {
			var gridWidget = new Grid(),
				order = 0;

			expect(20);

			gridWidget.trigger = function (eventName, eventDetails) {
				assert.equal(eventName, "modechange", "event is correct");
				assert.equal(typeof eventDetails.mode, "string", "eventDetails.mode is string");
			};

			gridWidget._imageToGrid = function () {
				assert.ok("_imageToGrid was called");
				assert.equal(order, 3, "_imageToGrid was called in correct order");
				order++;
			};
			gridWidget._changeModeTo3x3 = function () {
				assert.ok("_changeModeTo3x3 was called");
				assert.equal(order, 1, "_imageToGrid was called in correct order");
				order++;
			};
			gridWidget._gridToImage = function () {
				assert.ok("_gridToImage was called");
				assert.equal(order, 0, "_gridToImage was called in correct order");
				order++;
			};
			gridWidget._thumbnailToImage = function () {
				assert.ok("_thumbnailToImage was called");
				assert.equal(order, 2, "_imageToGrid was called in correct order");
				order++;
			};
			gridWidget._imageToThumbnail = function () {
				assert.ok("_imageToThumbnail was called");
				assert.equal(order, 4, "_imageToThumbnail was called in correct order");
				order++;
			};

			gridWidget.mode("");
			gridWidget.mode("image");
			gridWidget.mode("3x3");
			gridWidget.mode("thumbnail");
			gridWidget.options.mode = "thumbnail";
			gridWidget.mode("image");
			gridWidget.options.mode = "image";
			gridWidget.mode("3x3");
			gridWidget.options.mode = "image";
			gridWidget.mode("thumbnail");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.Grid,
			window.helpers);
	}
}());
