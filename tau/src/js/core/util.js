/*global window, define, XMLHttpRequest, console, Blob */
/*jslint nomen: true, browser: true, plusplus: true */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Utilities
 *
 * The Tizen Advanced UI (TAU) framework provides utilities for easy-developing
 * and fully replaceable with jQuery method. When user using these DOM and
 * selector methods, it provide more light logic and it proves performance
 * of web app. The following table displays the utilities provided by the
 * TAU framework.
 *
 * @class ns.util
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core"
		],
		function () {
		//>>excludeEnd("tauBuildExclude");
			var currentFrame = null,
				/**
				 * requestAnimationFrame function
				 * @method requestAnimationFrame
				 * @static
				 * @member ns.util
				*/
				requestAnimationFrame = (window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					function (callback) {
						currentFrame = window.setTimeout(callback.bind(callback, +new Date()), 1000 / 60);
					}).bind(window),
				util = ns.util || {},
				slice = [].slice;

			/**
			 * fetchSync retrieves a text document synchronously, returns null on error
			 * @param {string} url
			 * @param {=string} [mime=""] Mime type of the resource
			 * @return {string|null}
			 * @static
			 * @member ns.util
			 */
			function fetchSync(url, mime) {
				var xhr = new XMLHttpRequest(),
					status;
				xhr.open("get", url, false);
				if (mime) {
					xhr.overrideMimeType(mime);
				}
				xhr.send();
				if (xhr.readyState === 4) {
					status = xhr.status;
					if (status === 200 || (status === 0 && xhr.responseText)) {
						return xhr.responseText;
					}
				}

				return null;
			}
			util.fetchSync = fetchSync;

			/**
			 * Removes all script tags with src attribute from document and returns them
			 * @param {HTMLElement} container
			 * @return {Array.<HTMLElement>}
			 * @private
			 * @static
			 * @member ns.util
			 */
			function removeExternalScripts(container) {
				var scripts = slice.call(container.querySelectorAll("script[src]")),
					i = scripts.length,
					script;

				while (--i >= 0) {
					script = scripts[i];
					script.parentNode.removeChild(script);
				}

				return scripts;
			}

			/**
			 * Evaluates code, reason for a function is for an atomic call to evaluate code
			 * since most browsers fail to optimize functions with try-catch blocks, so this
			 * minimizes the effect, returns the function to run
			 * @param {string} code
			 * @return {Function}
			 * @static
			 * @member ns.util
			 */
			function safeEvalWrap(code) {
				return function () {
					try {
						window.eval(code);
					} catch (e) {
						if (typeof console !== "undefined") {
							if (e.stack) {
								console.error(e.stack);
							} else if (e.name && e.message) {
								console.error(e.name, e.message);
							} else {
								console.error(e);
							}
						}
					}
				};
			}
			util.safeEvalWrap = safeEvalWrap;

			/**
			 * Calls functions in supplied queue (array)
			 * @param {Array.<Function>} functionQueue
			 * @static
			 * @member ns.util
			 */
			function batchCall(functionQueue) {
				var i,
					length = functionQueue.length;
				for (i = 0; i < length; ++i) {
					functionQueue[i].call(window);
				}
			}
			util.batchCall = batchCall;

			/**
			 * Creates new script elements for scripts gathered from a differnt document
			 * instance, blocks asynchronous evaluation (by renaming src attribute) and
			 * returns an array of functions to run to evalate those scripts
			 * @param {Array.<HTMLElement>} scripts
			 * @param {HTMLElement} container
			 * @return {Array.<Function>}
			 * @private
			 * @static
			 * @member ns.util
			 */
			function createScriptsSync(scripts, container) {
				var scriptElement,
					scriptBody,
					i,
					length,
					queue = [];

				// proper order of execution
				for (i = 0, length = scripts.length; i < length; ++i) {
					scriptBody = fetchSync(scripts[i].src, "text/plain");
					if (scriptBody) {
						scriptElement = document.adoptNode(scripts[i]);
						scriptElement.setAttribute("data-src", scripts[i].src);
						scriptElement.removeAttribute("src"); // block evaluation
						queue.push(safeEvalWrap(scriptBody));
						if (container) {
							container.appendChild(scriptElement);
						}
					}
				}

				return queue;
			}

			util.requestAnimationFrame = requestAnimationFrame;

			/**
			* cancelAnimationFrame function
			* @method cancelAnimationFrame
			* @return {Function}
			* @member ns.util
			* @static
			*/
			util.cancelAnimationFrame = (window.cancelAnimationFrame ||
					window.webkitCancelAnimationFrame ||
					window.mozCancelAnimationFrame ||
					window.oCancelAnimationFrame ||
					function () {
						// propably wont work if there is any more than 1
						// active animationFrame but we are trying anyway
					window.clearTimeout(currentFrame);
				}).bind(window);

			/**
			 * Method make asynchronous call of function
			 * @method async
			 * @inheritdoc #requestAnimationFrame
			 * @member ns.util
			 * @static
			 */
			util.async = requestAnimationFrame;

			/**
			 * Appends element from different document instance to current document in the
			 * container element and evaluates scripts (synchronously)
			 * @param {HTMLElement} element
			 * @param {HTMLElement} container
			 * @method importEvaluateAndAppendElement
			 * @member ns.util
			 * @static
			 */
			util.importEvaluateAndAppendElement = function (element, container) {
				var externalScriptsQueue = createScriptsSync(removeExternalScripts(element), element),
					newNode = document.importNode(element, true);

				container.appendChild(newNode); // append and eval inline
				batchCall(externalScriptsQueue);

				return newNode;
			};

			/**
			* Checks if specified string is a number or not
			* @method isNumber
			* @return {boolean}
			* @member ns.util
			* @static
			*/
			util.isNumber = function (query) {
				var parsed = parseFloat(query);
				return !isNaN(parsed) && isFinite(parsed);
			};

			/**
			 * Reappend script tags to DOM structure to correct run script
			 * @method runScript
			 * @param {string} baseUrl
			 * @param {HTMLScriptElement} script
			 * @member ns.util
			 * @deprecated 2.3
			 */
			util.runScript = function (baseUrl, script) {
				var newScript = document.createElement("script"),
					scriptData = null,
					i,
					scriptAttributes = slice.call(script.attributes),
					src = script.getAttribute("src"),
					path = util.path,
					request,
					attribute,
					status;

				// 'src' may become null when none src attribute is set
				if (src !== null) {
					src = path.makeUrlAbsolute(src, baseUrl);
				}

				//Copy script tag attributes
				i = scriptAttributes.length;
				while (--i >= 0) {
					attribute = scriptAttributes[i];
					if (attribute.name !== "src") {
						newScript.setAttribute(attribute.name, attribute.value);
					} else {
						newScript.setAttribute("data-src", attribute.value);
					}
				}

				if (src) {
					scriptData = fetchSync(src, "text/plain");
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					if (!scriptData) {
						ns.warn("Failed to fetch and append external script. URL: " + src + "; response status: " + status);
					}
					//>>excludeEnd("tauDebug");
				} else {
					scriptData = script.textContent;
				}

				if (scriptData) {
					// add the returned content to a newly created script tag
					newScript.src = URL.createObjectURL(new Blob([scriptData], {type: "text/javascript"}));
					newScript.textContent = scriptData; // for compatibility with some libs ex. templating systems
				}
				script.parentNode.replaceChild(newScript, script);
			};

			ns.util = util;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
