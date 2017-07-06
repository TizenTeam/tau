/* global test, asyncTest, start, define, strictEqual, notStrictEqual, equal */
(function () {
	var ns = window.ns || window.tau;

	function runTests(PageContainer, helpers, perf) {
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

		test("_include", 2, function () {
			var pageContainer = new PageContainer(),
				pageElement = document.getElementById("page-not-in-container"),
				pageContainerElement = document.getElementById("qunit-fixture"),
				result = null,
				tempPageElement;

			pageContainer.element = pageContainerElement;
			helpers.stub(ns.util, "importEvaluateAndAppendElement", function (page, element) {
				strictEqual(pageContainerElement, element, "PageContainer is pass");
				return "result";
			});

			tempPageElement = pageElement.cloneNode(true);
			result = pageContainer._include(tempPageElement);

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

			strictEqual(pageContainer.activePage, newPageWidget, "Active page is changed");
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

		test("_transition", function () {
			var pageContainer,
				pageSource,
				pageDestination,
				pageContainerElement = document.getElementById("qunit-fixture"),
				pageSourceElement = document.getElementById("page1"),
				pageDestinationElement = document.getElementById("page2"),
				options = {
					reverse: true,
					deferred: {
						resolve: function () {}
					},
					transition: "slide"
				};

			pageContainer = new PageContainer();
			pageContainer.element = pageContainerElement;

			pageSource = {
				element: pageSourceElement,
				setActive: function () { }
			};

			pageDestination = {
				element: pageDestinationElement,
				setActive: function () { }
			};

			pageContainer._transition(pageDestination, pageSource, options);

			ok(pageContainer.inTransition, "inTransition was set to true.");
			ok(pageContainer.element.classList.contains(PageContainer.classes.uiViewportTransitioning), "PageContainer element contains uiViewportTransitioning class.")
		});

		test("_clearTransitionClasses", function () {
			var pageContainer,
				clearClasses,
				pageContainerElement = document.getElementById("qunit-fixture"),
				pageSourceElement = document.getElementById("page1"),
				pageDestinationElement = document.getElementById("page2");

			pageContainer = new PageContainer();
			pageContainer.element = pageContainerElement;

			clearClasses = [PageContainer.classes.in, PageContainer.classes.out];
			pageSourceElement.classList.add(PageContainer.classes.in, PageContainer.classes.out);
			pageDestinationElement.classList.add(PageContainer.classes.in, PageContainer.classes.out);

			pageContainer._clearTransitionClasses(clearClasses, pageSourceElement.classList, pageDestinationElement.classList);
			ok(!pageSourceElement.classList.contains(PageContainer.classes.in, PageContainer.classes.out), "Classes were successfully removed from source Page element.");
			ok(!pageDestinationElement.classList.contains(PageContainer.classes.in, PageContainer.classes.out), "Classes were successfully removed from destination Page element.");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(ns.widget.core.PageContainer, window.helpers, window.tauPerf);
	}
}());
