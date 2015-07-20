/*global equal */
(function() {
	var helpers = {};

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
		linkTag.onload = function() {
			linkTag.onload = null;
			callback();
		};

		document.head.appendChild(linkTag);
	};

	/**
	 * Load TAU Script
	 * @param {Document} document standard document object or document object from iframe
	 * @param {string} profile Profile name
	 * @param {Function} callback callback called after load style
	 */
	helpers.loadTAUScript = function (document, profile, callback) {
		var scriptTag = document.createElement("script");

		scriptTag.setAttribute("src", "/base/dist/" + profile + "/js/tau.js");
		scriptTag.onload = function() {
			scriptTag.onload = null;
			callback();
		};

		document.body.appendChild(scriptTag);
	};

	/**
	 * Load TAU Script
	 * @param {Document} document standard document object or document object from iframe
	 * @param {string} profile Profile name
	 * @param {Function} callback callback called after load style
	 */
	helpers.loadByRequire = function (window, options, modules, callback) {
		var scriptTag = document.createElement("script");

		scriptTag.setAttribute("src", "/base/tests/libs/require.js");
		scriptTag.onload = function() {
			var require = window.require;
			scriptTag.onload = null;
			if (options) {
				require.config(options);
			}
			require(modules, callback);
		};

		window.document.body.appendChild(scriptTag);
	};

	/**
	 * Remove all loaded TAU styles
	 * @param document
	 */
	helpers.removeTAUStyle = function(document) {
		var links = document.getElementsByTagName("link");

		[].forEach.call(links, function(link) {
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
	helpers.injectHTML =  function (html) {
		var injectContainer = document.createElement("div");
		injectContainer.innerHTML = html;
		document.body.appendChild(injectContainer);
		return injectContainer;
	};

	/**
	 * Test real size of element based in getComputetStyle
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
	helpers.testLayout = function(window, element, elementSize, childSizes, description) {
		if (elementSize[0] !== undefined && elementSize[1] !== undefined) {
			helpers.testElementSize(window, element, elementSize[0], elementSize[1], description + "; global element; ");
		}
		childSizes.forEach(function(childSize, i) {
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
	helpers.mergeCoverage = function(window, iframeWindow) {
		var i, j, k;
		// connect coverage system from current window with system in iframe
		for (i in iframeWindow.__coverage__) {
			if (iframeWindow.__coverage__.hasOwnProperty(i)) {
				for (j in iframeWindow.__coverage__[i].b) {
					if (iframeWindow.__coverage__[i].b.hasOwnProperty(j)) {
						for (k in iframeWindow.__coverage__[i].b[j]) {
							if (iframeWindow.__coverage__[i].b[j].hasOwnProperty(k)) {
								window.__coverage__[i].b[j][k] += iframeWindow.__coverage__[i].b[j][k];
							}
						}
					}
				}
				for (j in iframeWindow.__coverage__[i].f) {
					if (iframeWindow.__coverage__[i].f.hasOwnProperty(j)) {
						window.__coverage__[i].f[j] += iframeWindow.__coverage__[i].f[j];
					}
				}
				for (j in iframeWindow.__coverage__[i].s) {
					if (iframeWindow.__coverage__[i].s.hasOwnProperty(j)) {
						window.__coverage__[i].s[j] += iframeWindow.__coverage__[i].s[j];
					}
				}
			}
		}
	};

	helpers.createIframe = function(document, options, callback) {
		// create iframe
		var iframe = document.createElement("iframe"),
			src = options.src;
		iframe.width = options.width || 480;
		iframe.height = options.height || 800;
		iframe.style.border = "none";
		if (src) {
			iframe.src = src;
		}
		iframe.onload = callback.bind(null, iframe);
		document.body.appendChild(iframe);
	};

	window.karmaHelpers = helpers;

	if (typeof define === "function") {
		define(function() {
			return helpers;
		});
	}
}());