/* global document, tau, define, module, test, equal, window, strictEqual, window, ok, Promise, notEqual */
(function () {
	"use strict";
	function runTests(engine, Page, helpers) {
		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/mobile/widget/mobile/Page/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "mobile", function () {
					resolve();
				});
			});
		}

		module("profile/mobile/widget/mobile/Page", {
			setup: initHTML
		});

		test("constructor", function () {
			var pageWidget = new Page();

			strictEqual(pageWidget.options.header, undefined, "Option header is set correct");
			strictEqual(pageWidget.options.content, undefined, "Option content is set correct");
			strictEqual(pageWidget.options.footer, undefined, "Option footer is set correct");

			pageWidget._configure();

			strictEqual(pageWidget.options.header, null, "Option header is set correct");
			strictEqual(pageWidget.options.content, null, "Option content is set correct");
			strictEqual(pageWidget.options.footer, null, "Option footer is set correct");
		});

		test("_setAria", function () {
			var pageElement = document.getElementById("aria"),
				pageWidget = new Page(),
				ui = {
					header: pageElement.children[0],
					content: pageElement.children[1],
					footer: pageElement.children[2],
					title: pageElement.children[0].children[0]
				};

			pageWidget._ui = ui;
			pageWidget._setAria();
			equal(ui.header.getAttribute("role"), "header", "role is set on header");
			equal(ui.content.getAttribute("role"), "main", "role is set on content");
			equal(ui.footer.getAttribute("role"), "footer", "role is set on footer");
			equal(ui.title.getAttribute("role"), "heading", "role is set on title");
			equal(ui.title.getAttribute("aria-level"), 1, "aria-level is set on title");
			equal(ui.title.getAttribute("aria-label"), "title", "aria-label is set on title");
			// we test that method not throw exception
		});

		test("_setTitle", function () {
			var pageElement = document.getElementById("title-h1"),
				pageWidget = new Page(),
				ui = {
					header: pageElement.children[0]
				};

			pageWidget._ui = ui;
			pageWidget._setTitle(pageElement);
			equal(pageElement.dataset.title, "Header", "title was found");
			equal(ui.title, ui.header.children[0], "title was found");

			pageElement = document.getElementById("title-h6");
			pageWidget = new Page();
			ui = {
				header: pageElement.children[0]
			};

			pageWidget._ui = ui;
			pageWidget._setTitle(pageElement);
			equal(pageElement.dataset.title, "Header", "title was found");
			equal(ui.title, ui.header.children[0], "title was found");

			pageElement = document.getElementById("data-title");
			pageWidget = new Page();
			ui = {
				header: pageElement.children[0]
			};

			pageWidget._ui = ui;
			pageWidget._setTitle(pageElement);
			equal(pageElement.dataset.title, "title", "title was found");
			equal(ui.title, undefined, "title was not found");
		});


		test("_build", 3, function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("aria");

			pageWidget._setTitle = function (element) {
				equal(element, firstPageElement, "_setTitle was called with correct element");
			};
			pageWidget._setAria = function () {
				ok(true, "_setAria was called");
			};
			pageWidget._build(firstPageElement);

			strictEqual(firstPageElement.classList.contains("ui-page"), true, "Page has correct class");
		});

		test("_contentFill", function () {
			var pageWidget = new Page(),
				pageElement = document.getElementById("aria"),
				content = pageElement.children[1],
				ui = {
					header: pageElement.children[0],
					content: content,
					footer: pageElement.children[2],
					title: pageElement.children[0].children[0]
				},
				height;

			pageWidget._ui = ui;
			pageWidget.element = pageElement;
			pageWidget._contentFill();

			//strictEqual(parseInt(content.style.top, 10), 67, "content top was set correct");
			notEqual(content.style.top.indexOf("px"), -1, "content top was set correct (px)");
			strictEqual(content.style.bottom, "100px", "content bottom was set correct");
			notEqual(content.style.bottom.indexOf("px"), -1, "content bottom was set correct (px)");
			height = parseInt(content.style.height);
			// ok(height === window.innerHeight - 67 - 100 ||
			// 	height === window.innerHeight - 68 - 100, "content height was set correct");
			notEqual(content.style.height.indexOf("px"), -1, "content height was set correct (px)");
			strictEqual(parseInt(content.style.width), window.innerWidth, "content width was set correct");
			notEqual(content.style.width.indexOf("px"), -1, "content width was set correct (px)");
		});

		test("createEmptyElement", function () {
			var pageElement = Page.createEmptyElement();

			strictEqual(pageElement.tagName, "DIV", "Create div element");
			strictEqual(pageElement.className, "ui-page", "add ui-page class to element");
		});
	}

	if (typeof define === "function") {
		define(["../../../../../../../src/js/core/engine"], function (engine) {
			return runTests.bind(null, engine);
		});
	} else {
		runTests(tau.engine,
			tau.widget.mobile.Page,
			window.helpers);
	}
}());
