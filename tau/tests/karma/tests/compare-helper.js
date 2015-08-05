/* global define, equal, ok, start, asyncTest, test */
define(
	["./helpers", "./compare-helper-excludes"],
	function (helpers, cssPropExcludes) {
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
					src: app.path + "/" + app.appName + "CE/" + app.indexFile + "?" + ((Math.random() * Date.now()) | 0),
					width: app.width,
					height: app.height
				}, function (iframeCE) {
					var iframeCEWindow = iframeCE.contentWindow;
					ok(iframeCEWindow.tau);
					window.setTimeout(function () {
						callback(iframeWindow, iframeCEWindow);
					}, 500);
				});
			});
		}

		function compareStylesFunction(orgWindow, ceWindow, element1, element2, selector) {
			var computedStyles1 = element1 && orgWindow.getComputedStyle(element1, selector) || [],
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
				if (cssPropExcludes.indexOf(property) === -1) {
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

		function testPage(app, orgWindow, ceWindow, page, callback) {
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
			getLinks(app, orgWindow, ceWindow, page, function() {
				if (page.id === "main") {
					callback();
				} else {
					pageBack(orgWindow, ceWindow, callback);
				}
			});
		}

		function clickLink(app, orgWindow, ceWindow, link1, link2, callback) {
			var pageChanges = 0,
				target,
				event = "pageshow popupshow",
				current = null,
				currentEl = null,
				pathRegexp = new RegExp("^.*" + app.path + "/" + app.appName + "(CE)?", "i"),
				randomIDRegexp = /tau-\d+-\d+/,
				checkMode = 0, // 0 - id checking, 1 - base url checking
				pageChangeCallback = function(event) {
					var element = event.target,
						cls = element.classList,
						doc = element.ownerDocument || (element instanceof HTMLDocument && element),
						location = doc && doc.location.href || "",
						baseLocation = location.replace(pathRegexp, ""),
						id = checkMode === 0 ? element.id : baseLocation;

					console.log("got event", event.type, "on", id, event, location);
					if (id && cls && (cls.contains("ui-page") || cls.contains("ui-popup"))) {
						if (current === null) {
							if (id.match(randomIDRegexp)) {
								console.log("random page id detected, using urls as fallback for sync", baseLocation);
								checkMode = 1;
								current = baseLocation;
							} else {
								checkMode = 0;
								current = id;
							}
							currentEl = element;
						} else if (current === id) {
							console.log("page match", current, id, "executing callback");
							callback(currentEl);
							current = null;
							currentEl = null;
						}
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

		function getLinks(app, orgWindow, ceWindow, page, callback) {
			var ceDocument = ceWindow.document,
				links = [].slice.call(page.querySelectorAll("a[href]:not([href='#']):not([data-ignore]):not([data-rel])")),
				internalCallback = function() {
					var link = links.shift();

					if (link) {
						clickLink(app, orgWindow, ceWindow, link, mapElement(link, ceDocument), function(page) {
							testPage(app, orgWindow, ceWindow, page, internalCallback);
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
						testPage(app, orgWindow, ceWindow, orgWindow.document.getElementById("main"), function () {
							finished = true;
							start();
						});
					});
				});
			}
		};
});
