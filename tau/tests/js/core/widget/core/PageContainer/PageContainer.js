/* global test, asyncTest, start, define, strictEqual, notStrictEqual, equal */
(function () {
	var ns = window.ns || window.tau;

	function runTests(PageContainer, helpers) {
		var qunitFuxturesElement = document.getElementById("qunit-fixture");

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/PageContainer/test-data/sample.html"),
				parent = qunitFuxturesElement || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/PageContainer", {
			setup: initHTML
		});

	// temporary if for disable errors in karma, @TODO reorganize tests in if to karma UT
		if (qunitFuxturesElement) {
			qunitFuxturesElement.addEventListener("widgetbuilt", function () {
				test("ns.widget.core.PageContainer showLoading/hideLoading method", function (assert) {
					var element = document.getElementById("qunit-fixture"),
						widget = ns.engine.instanceWidget(element, "pagecontainer");
				//console.log(widget.getActivePage());

					assert.equal(widget.showLoading(), null, "PageContainer showLoading");
					assert.equal(widget.hideLoading(), null, "PageContainer showLoading");
				});
				asyncTest("ns.widget.core.PageContainer change page", 1, function (assert) {
					var element = document.getElementById("qunit-fixture"),
						nextPage = document.getElementById("page2"),
						widget = ns.engine.instanceWidget(element, "pagecontainer"),
						nextPageWidget = null;

					widget.change(nextPage);
					setTimeout(function () {
						nextPageWidget = ns.engine.getBinding(nextPage);
						assert.equal(widget.getActivePage(), nextPageWidget, "Page changed properly");
						start();
					}, 10);
				});

				asyncTest("ns.widget.core.PageContainer change page", 1, function (assert) {
					var element = document.getElementById("qunit-fixture"),
						nextPage = document.getElementById("page2"),
						widget = ns.engine.instanceWidget(element, "pagecontainer"),
						nextPageWidget = null;

					widget.change(nextPage);
					setTimeout(function () {
						nextPageWidget = ns.engine.getBinding(nextPage);
						assert.equal(widget.getActivePage(), nextPageWidget, "Page changed properly");
						start();
					}, 10);
				});

				if (!window.navigator.userAgent.match("PhantomJS")) {
					asyncTest("ns.widget.core.PageContainer change page with transition", 1, function (assert) {
						var element = document.getElementById("qunit-fixture"),
							currentPage = document.getElementById("page3"),
							nextPage = document.getElementById("page4"),
							widget = ns.engine.instanceWidget(element, "pagecontainer"),
							nextPageWidget = null,
							oneEvent = function () {
								document.removeEventListener("pageshow", oneEvent, false);
								nextPageWidget = ns.engine.getBinding(nextPage);
								assert.equal(widget.getActivePage(), nextPageWidget, "Page changed properly");
								start();
							},
							onPageShow = function () {
								document.addEventListener("pageshow", oneEvent, false);
								document.removeEventListener("pageshow", onPageShow, false);
								ns.engine.getRouter().open(nextPage, {transition: "fade"});
							};
					//set a page if does not have any

						document.addEventListener("pageshow", onPageShow, false);
						ns.engine.getRouter().open(currentPage);
					});

					asyncTest("ns.widget.core.PageContainer change page with transition reverse", 1, function (assert) {
						var element = document.getElementById("qunit-fixture"),
							currentPage = document.getElementById("page5"),
							nextPage = document.getElementById("page6"),
							widget = ns.engine.instanceWidget(element, "pagecontainer"),
							nextPageWidget = null,
							oneEvent = function () {
								document.removeEventListener("pageshow", oneEvent, false);
								nextPageWidget = ns.engine.getBinding(nextPage);
								assert.equal(widget.getActivePage(), nextPageWidget, "Page changed properly");
								start();
							},
							onPageShow = function () {
								document.removeEventListener("pageshow", onPageShow, false);
								document.addEventListener("pageshow", oneEvent, false);
								ns.engine.getRouter().open(nextPage, {transition: "fade", reverse: true});
							};
					//set a page if does not have any

						document.addEventListener("pageshow", onPageShow, false);
						ns.engine.getRouter().open(currentPage);
					});
				}
			}, false);
		}

		test("_include", 3, function () {
			var pageContainer = new PageContainer(),
				pageElement = document.getElementById("page-not-in-container"),
				pageContainerElement = document.getElementById("qunit-fixture"),
				result = null;

			pageContainer.element = pageContainerElement;
			helpers.stub(ns.util, "importEvaluateAndAppendElement", function (page, element) {
				strictEqual(pageContainerElement, element, "PageContainer is pass");
				strictEqual(pageElement, page, "Page is pass");
				return "result";
			});

			result = pageContainer._include(pageElement);

			strictEqual(result, "result", "method return correct value");
		});

		test("_setActivePage", 3, function () {
			var pageContainer = new PageContainer(),
				pageContainerElement = document.getElementById("qunit-fixture"),
				newPageWidget = {
					setActive: function (value) {
						strictEqual(value, true, "Active new page");
					}
				};

			pageContainer.element = pageContainerElement;

			pageContainer.activePage = {
				setActive: function (value) {
					strictEqual(value, false, "Deactive active page");
				}
			};

			pageContainer._setActivePage(newPageWidget);

			strictEqual(pageContainer.activePage, newPageWidget, "Active page is changed")
		});


		test("_removeExternalPage", 2, function () {
			var pageContainer = new PageContainer(),
				pageContainerElement = document.getElementById("qunit-fixture"),
				pageElement = document.getElementById("page-not-in-container"),
				newPageWidget = {
					element: pageElement
				},
				options = {
					reverse: true
				};

			pageContainer.element = pageContainerElement;

			pageContainer.trigger = function (name) {
				equal(name, "pageremove", "Event is triggered");
			};

			pageContainer._removeExternalPage(newPageWidget, options);

			strictEqual(pageElement.parentNode, null, "Page is removed");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(ns.widget.core.PageContainer, window.helpers);
	}
}());