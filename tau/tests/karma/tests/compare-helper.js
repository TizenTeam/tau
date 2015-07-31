/* global define, equal, ok, start, asyncTest, test */
define(
	["./helpers"],
	function (helpers) {
		var errorsCount = {},
			simpleLocation;

		function prepareIframes(app, callback) {
			helpers.createIframe(document, {
				src: app.path + "/" + app.appName + "/" + app.indexFile,
				width: app.width,
				height: app.height
			}, function (iframe) {
				var iframeWindow = iframe.contentWindow;

				ok(iframeWindow.tau);
				helpers.createIframe(document, {
					src: app.path + "/" + app.appName + "CE/" + app.indexFile,
					width: app.width,
					height: app.height
				}, function (iframeCE) {
					var iframeCEWindow = iframeCE.contentWindow;
					ok(iframeCEWindow.tau);
					callback(iframeWindow, iframeCEWindow);
				});
			});
		}

		function compareStylesFunction(orgWindow, ceWindow, element1, element2, selector) {
			var computedStyles1 = orgWindow.getComputedStyle(element1, selector),
				computedStyles2,
				result = [],
				widgetName = orgWindow.tau.util.selectors.getClosestBySelector(element1, "[data-tau-name]").dataset.tauName,
				id = widgetName,
				testName;

			try {
				computedStyles2 = ceWindow.getComputedStyle(element2, selector);
			} catch(e) {
				computedStyles2 = {};
			}

			if (id === undefined) {
				id = "." + element1.className;
				id  += ":" + [].indexOf.call(element1.parentElement.children, element1);
			} else {
				id = "[" + id + "]";
			}

			[].forEach.call(computedStyles1, function (property) {
				var computedStyles2Property = computedStyles2[property];
				if (computedStyles2Property && typeof computedStyles2Property) {
					computedStyles2Property = computedStyles2Property.replace("UIComponentsCE", "UIComponents");
				}
				if (computedStyles1[property] !== computedStyles2Property) {
					result.push({
						property: property,
						value1: computedStyles1[property],
						value2: computedStyles2Property
					});
				}
			});

			if (result.length) {
				testName = element1.tagName + " .(" + element1.className + ") / " + (element2 && element2.tagName) + (selector || "");
				if (!errorsCount[widgetName+testName]) {
					errorsCount[widgetName+testName] = 1;
					module(widgetName);
					asyncTest(testName + " " + simpleLocation, function (result) {
						[].forEach.call(result, function (info) {
							equal(info.value2, info.value1, info.property);
						});
						start();
					}.bind(null, result));
				}
			}
		}

		function mapElement(element1, document) {
			var path = [],
				index,
				currentElement = element1,
				parentElement;

			while (currentElement && (currentElement.tagName.toLowerCase() !== "body")) {
				parentElement = currentElement.parentElement;
				if (parentElement) {
					index = [].slice.call(parentElement.children).indexOf(currentElement);
					path.push(index);
				}
				currentElement = parentElement;
			}

			path = path.reverse();

			currentElement = document.body;
			path.forEach(function(index) {
				if (currentElement && currentElement.children) {
					currentElement = currentElement.children[index];
				}
			});
			return currentElement;
		}

		function compareTree(ceDocument, compareStyles, element) {
			compareStyles(element, mapElement(element, ceDocument));
			compareStyles(element, mapElement(element, ceDocument), ":before");
			compareStyles(element, mapElement(element, ceDocument), ":after");
			[].forEach.call(element.children, function(childElement) {
				if (childElement.dataset.tauName === undefined) {
					compareTree(ceDocument, compareStyles, childElement);
				}
			});
		}

		function testPage(orgWindow, ceWindow, page, callback) {
			var compareStyles = compareStylesFunction.bind(null, orgWindow, ceWindow),
				ceDocument = ceWindow.document,
				widgets = page && page.querySelectorAll("[data-tau-name]") || [],
				location = orgWindow.location + "",
				simpleLocationIndex = location.indexOf("UIComponents");

			simpleLocation = location.substring(simpleLocationIndex + 12);

			compareStyles(page, mapElement(page, ceDocument));
			compareStyles(page, mapElement(page, ceDocument), ":before");
			compareStyles(page, mapElement(page, ceDocument), ":after");

			[].forEach.call(widgets, compareTree.bind(null, ceDocument, compareStyles));
			getLinks(orgWindow, ceWindow, page, function() {
				if (page.id === "main") {
					callback();
				} else {
					pageBack(orgWindow, ceWindow, callback);
				}
			});
		}

		function clickLink(orgWindow, ceWindow, link1, link2, callback) {
			var pageChanges = 0,
				target,
				event = "pageshow popupshow",
				pageChangeCallback = function(event) {
					pageChanges++;
					console.log("event", event.type, event.target.id);
					if (pageChanges === 2) {
						target = event.target;
						callback(target);
					}
				},
				href = link1.getAttribute("href");

			if (href !== "#" && href !== "" && link1 && link2) {
				orgWindow.tau.event.one(orgWindow, event, pageChangeCallback);
				ceWindow.tau.event.one(ceWindow, event, pageChangeCallback);
				link1.click();
				link2.click();
				console.log("clicked on link with href " + href);
			} else {
				console.log("not clicked on link with href " + href);
				callback();
			}
		}

		function pageBack(orgWindow, ceWindow, callback) {
			var pageChanges = 0,
				event = "pageshow panelshow popuphide",
				pageChangeCallback = function(event) {
					pageChanges++;
					if (pageChanges === 2) {
						callback();
					}
				};

			orgWindow.tau.event.one(orgWindow, event, pageChangeCallback);
			ceWindow.tau.event.one(ceWindow, event, pageChangeCallback);
			setTimeout(function() {
				//orgWindow.tau.changePage("#main");
				//ceWindow.tau.changePage("#main");
				window.history.go(-2);
			}, 100);
		}

		function getLinks(orgWindow, ceWindow, page, callback) {
			var ceDocument = ceWindow.document,
				links = [].slice.call(page.querySelectorAll("a[href]:not([href='#']):not([data-ignore]):not([data-rel])")),
				internalCallback = function() {
					var link = links.shift();

					if (link) {
						clickLink(orgWindow, ceWindow, link, mapElement(link, ceDocument), function(page) {
							testPage(orgWindow, ceWindow, page, internalCallback);
						});
					} else {
						callback();
					}
				};
			internalCallback();
		}

		return {
			compare: function (app) {
				asyncTest("test was started", function() {
					var finished = false;
					setTimeout(function () {
						if (!finished) {
							start();
						}
					}, 120000);
					prepareIframes(app, function (orgWindow, ceWindow) {
						testPage(orgWindow, ceWindow, orgWindow.document.getElementById("main"), function () {
							finished = true;
							start();
						});
					});
				});
			}
		};
});