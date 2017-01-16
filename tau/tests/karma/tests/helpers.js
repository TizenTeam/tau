/*global equal, define, Map */
(function () {
	var helpers = {},
		stubs = new Map();

	/**
	 * Load TAU CSS
	 * @param {Document} document standard document object or document object from iframe
	 * @param {string} profile Profile name
	 * @param {Function} callback callback called after load style
	 */
	helpers.loadTAUStyle = function (document, profile, callback) {
		var linkTag = document.createElement("link");

		linkTag.setAttribute("rel", "stylesheet");
		linkTag.setAttribute("href", "/base/dist/" + profile + "/theme/default/tau.css");
		linkTag.onload = function () {
			linkTag.onload = null;
			callback();
		};

		document.head.appendChild(linkTag);
	};

	/**
	 * Remove all loaded TAU styles
	 * @param document
	 */
	helpers.removeTAUStyle = function (document) {
		var links = document.getElementsByTagName("link");

		[].forEach.call(links, function (link) {
			var href = link.getAttribute("href");

			if (href.indexOf("tau") > -1) {
				link.parentElement.removeChild(link);
			}
		});
	};

	/**
	 * Injecting html and return container of new elements
	 * @param {string} html HTML code to inject
	 * @returns {Element}
	 */
	helpers.injectHTML = function (html) {
		var injectContainer = document.createElement("div");

		injectContainer.innerHTML = html;
		document.body.appendChild(injectContainer);
		return injectContainer;
	};

	/**
	 * Test real size of element based in getComputetStyle
	 * @param window
	 * @param element
	 * @param width
	 * @param height
	 * @param description
	 */
	helpers.testElementSize = function (window, element, width, height, description) {
		var styles = window.getComputedStyle(element);

		description = description || "";

		equal(Math.round(parseFloat(styles.width)), width, description + " Child has width " + width);
		equal(Math.round(parseFloat(styles.height)), height, description + " Child has height " + height);
	};

	/**
	 *
	 * @param window
	 * @param element
	 * @param elementSize
	 * @param childSizes
	 * @param description
	 */
	helpers.testLayout = function (window, element, elementSize, childSizes, description) {
		if (elementSize[0] !== undefined && elementSize[1] !== undefined) {
			helpers.testElementSize(window, element, elementSize[0], elementSize[1], description + "; global element; ");
		}
		childSizes.forEach(function (childSize, i) {
			if (childSize[0] !== undefined && childSize[1] !== undefined) {
				helpers.testElementSize(window, element.children[i], childSize[0], childSize[1], description + "; child " + i + " element; ");
			}
		});
	};

	/**
	 * Merge coverage result from iframe to current doc
	 * @param window
	 * @param iframeWindow
	 */
	helpers.mergeCoverage = function (window, iframeWindow) {
		var i = "",
			j = "",
			k = "",
			iframeCoverage = iframeWindow.__coverage__,
			coverage = window.__coverage__;

		// connect coverage system from current window with system in iframe
		for (i in iframeCoverage) {
			if (iframeCoverage.hasOwnProperty(i)) {
				for (j in iframeCoverage[i].b) {
					if (iframeCoverage[i].b.hasOwnProperty(j)) {
						for (k in iframeCoverage[i].b[j]) {
							if (iframeCoverage[i].b[j].hasOwnProperty(k)) {
								coverage[i].b[j][k] += iframeCoverage[i].b[j][k];
							}
						}
					}
				}
				for (j in iframeCoverage[i].f) {
					if (iframeCoverage[i].f.hasOwnProperty(j)) {
						coverage[i].f[j] += iframeCoverage[i].f[j];
					}
				}
				for (j in iframeCoverage[i].s) {
					if (iframeCoverage[i].s.hasOwnProperty(j)) {
						coverage[i].s[j] += iframeCoverage[i].s[j];
					}
				}
			}
		}
	};

	/**
	 * Triggers custom event fastOn element
	 * The return value is false, if at least one of the event
	 * handlers which handled this event, called preventDefault.
	 * Otherwise it returns true.
	 * @method trigger
	 * @param {HTMLElement} element
	 * @param {string} type
	 * @param {?*} [data=null]
	 * @param {boolean=} [bubbles=true]
	 * @param {boolean=} [cancelable=true]
	 * @return {boolean}
	 * @member ns.event
	 * @static
	 */
	helpers.triggerEvent = function (element, type, data, bubbles, cancelable) {
		var evt = new CustomEvent(type, {
			"detail": data,
			//allow event to bubble up, required if we want to allow to listen fastOn document etc
			bubbles: typeof bubbles === "boolean" ? bubbles : true,
			cancelable: typeof cancelable === "boolean" ? cancelable : true
		});

		return element.dispatchEvent(evt);
	};

	helpers.stub = function (parent, name, newFunction) {
		var parentStubs = stubs.get(parent) || {};

		parentStubs[name] = parent[name];
		parent[name] = newFunction;
		stubs.set(parent, parentStubs);
	};

	helpers.restoreStub = function (parent, name) {
		var parentStubs = stubs.get(parent) || {};

		parent[name] = parentStubs[name];
		delete parentStubs[name];
		stubs.set(parent, parentStubs);
	};

	function injectStyle(css) {
		var styleElement = document.createElement("style");

		document.head.appendChild(styleElement);
		styleElement.type = "text/css";
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function initFixture() {
		var element = document.createElement("div");

		element.id = "qunit-fixture";
		document.body.appendChild(element);
		injectStyle("#qunit-fixture {" +
			"position: absolute;" +
			"top: -10000px;" +
			"left: -10000px;" +
			"width: 1000px;" +
			"height: 1000px;" +
			"});");
		return element;
	}

	window.karmaHelpers = helpers;
	window.injectStyle = injectStyle;
	window.initFixture = initFixture;

	if (typeof define === "function") {
		define(function () {
			return helpers;
		});
	} else {
		window.helpers = helpers;
	}
}());