/*global window, define, XMLHttpRequest */
/**
 * @class ns.util.load
 */
(function (document, ns) {
	'use strict';
	//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
	define(
		[
			'../util'
		],
		function () {
			//>>excludeEnd('tauBuildExclude');

			/**
			 * @property {HTMLHeadElement} head local alias for document HEAD element
			 * @static
			 * @private
			 */
			var head = document.head,
				styleSheets = document.styleSheets,
				utilDOM = ns.util.DOM,
				getNSData = utilDOM.getNSData,
				setNSData = utilDOM.setNSData,
				load = ns.util.load || {},
				IMAGE_PATH_REGEXP = /url\((\.\/)?images/gm,
				CSS_FILE_REGEXP = /[^/]+\.css$/;

			/**
			 * Load file
			 * (synchronous loading)
			 * @method loadFileSync
			 * @param {string} scriptPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @member ns.util.load
			 */
			 function loadFileSync(scriptPath, successCB, errorCB) {
				var xhrObj = new XMLHttpRequest();

				// open and send a synchronous request
				xhrObj.open('GET', scriptPath, false);
				xhrObj.send();
				// add the returned content to a newly created script tag
				if (xhrObj.status === 200 || xhrObj.status === 0) {
					if (typeof successCB === 'function') {
						successCB(xhrObj, xhrObj.status);
					}
				} else {
					if (typeof errorCB === 'function') {
						errorCB(xhrObj, xhrObj.status, new Error(xhrObj.statusText));
					}
				}
			}

			/**
			 * Callback function on javascript load success
			 * @param {?Function} successCB
			 * @param {?Function} xhrObj
			 * @param {?string} status
			 */
			function scriptSyncSuccess(successCB, xhrObj, status) {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.text = xhrObj.responseText;
				document.body.appendChild(script);
				if (typeof successCB === 'function') {
					successCB(xhrObj, status);
				}
			}


			/**
			 * Add script to document
			 * (synchronous loading)
			 * @method scriptSync
			 * @param {string} scriptPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @member ns.util.load
			 */
			function scriptSync(scriptPath, successCB, errorCB) {
				loadFileSync(scriptPath, scriptSyncSuccess.bind(null, successCB), errorCB);
			}

			/**
			 * Callback function on css load success
			 * @param {string} cssPath
			 * @param {?Function} successCB
			 * @param {?Function} xhrObj
			 */
			function cssSyncSuccess(cssPath, successCB, xhrObj) {
				var css = document.createElement('style');
				css.type = 'text/css';
				css.textContent = xhrObj.responseText.replace(
					IMAGE_PATH_REGEXP,
					'url(' + cssPath.replace(CSS_FILE_REGEXP, 'images')
				);
				if (typeof successCB === 'function') {
					successCB(css);
				}
			}

			/**
			 * Add css to document
			 * (synchronous loading)
			 * @method cssSync
			 * @param {string} cssPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @member ns.util.load
			 */
			function cssSync(cssPath, successCB, errorCB) {
				loadFileSync(cssPath, cssSyncSuccess.bind(null, cssPath, successCB), errorCB);
			}

			/**
			 * Add element to head tag
			 * @method addElementToHead
			 * @param {HTMLElement} element
			 * @param {boolean} [asFirstChildElement=false]
			 * @member ns.util.load
			 * @static
			 */
			function addElementToHead(element, asFirstChildElement) {
				var firstElement;
				if (head) {
					if (asFirstChildElement) {
						firstElement = head.firstElementChild;
						if (firstElement) {
							head.insertBefore(element, firstElement);
							return;
						}
					}
					head.appendChild(element);
				}
			}

			/**
			 * Create HTML link element with href
			 * @method makeLink
			 * @param {string} href
			 * @returns {HTMLLinkElement}
			 * @member ns.util.load
			 * @static
			 */
			function makeLink(href) {
				var cssLink = document.createElement('link');
				cssLink.setAttribute('rel', 'stylesheet');
				cssLink.setAttribute('href', href);
				cssLink.setAttribute('name', 'tizen-theme');
				return cssLink;
			}

			/**
			 * Add css link element to head if not exists
			 * @method css
			 * @param {string} path
			 * @param {string} themeName
			 * @member ns.util.load
			 * @static
			 */
			function themeCSS(path, themeName) {
				var i,
					styleSheetsLength = styleSheets.length,
					ownerNode,
					previousElement = null;
				// Find css link or style elements
				for (i = 0; i < styleSheetsLength; i++) {
					ownerNode = styleSheets[i].ownerNode;
					if (getNSData(ownerNode, 'name') === 'tizen-theme') {
						if (getNSData(ownerNode, 'theme-name') === themeName) {
							return;
						}
						previousElement = ownerNode;
						break;
					}
				}
				// Load and replace old styles or append new styles
				cssSync(path, function onSuccess(style) {
					setNSData(style, 'name', 'tizen-theme');
					setNSData(style, 'theme-name', themeName);
					if (previousElement) {
						previousElement.parentNode.replaceChild(style, previousElement);
					} else {
						addElementToHead(style, true);
					}
				});
			}

			/**
			 * @property {string} cacheBust
			 * @member ns.util.load
			 */
			load.cacheBust = (document.location.href.match(/debug=true/)) ? '?cacheBust=' + (new Date()).getTime() : '';
			// the binding a local methods with the namespace
			load.scriptSync = scriptSync;
			load.addElementToHead = addElementToHead;
			load.makeLink = makeLink;
			load.themeCSS = themeCSS;

			ns.util.load = load;
			//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
			return ns.util.load;
		}
	);
	//>>excludeEnd('tauBuildExclude');
}(window.document, ns));
