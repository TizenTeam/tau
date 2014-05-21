/*global window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Util
 * Namespace for all util class
 * @class ns.util
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (window, ns) {
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
				 * @return {Function}
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
				/**
				* Class with util functions
				* @class ns.util
				*/
				/** @namespace ns.util */
				util = ns.util || {};

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

			util.runScript = function (baseUrl, script) {
				var newscript = document.createElement('script'),
					i,
					scriptAttributes = script.attributes,
					count = script.childNodes.length,
					src = script.getAttribute("src"),
					path = util.path,
					xhrObj,
					attribute,
					status;

				// 'src' may become null when none src attribute is set
				if (src !== null) {
					src = path.makeUrlAbsolute(src, baseUrl);
				}

				//Copy script tag attributes
				for (i = scriptAttributes.length - 1; i >= 0; i -= 1) {
					attribute = scriptAttributes[i];
					if (attribute.name !== 'src') {
						newscript.setAttribute(attribute.name, attribute.value);
					}
				}

				// If external script exists, fetch and insert it inline
				if (src) {
					try {
						// get some kind of XMLHttpRequest
						xhrObj = new XMLHttpRequest();
						// open and send a synchronous request
						xhrObj.open('GET', src, false);
						xhrObj.send('');
						status = xhrObj.status;
						if (status === 200 || status === 0) {
							// add the returned content to a newly created script tag
							newscript.type = "text/javascript";
							newscript.text = xhrObj.responseText;
						}
						//>>excludeStart("tauDebug", pragmas.tauDebug);
						if (xhrObj.status !== 200) {
							ns.warn("Failed to fetch and append external script. URL: " + src + "; response status: " + xhrObj.status);
						}
						//>>excludeEnd("tauDebug");
					} catch (ignore) {
					}
				} else {
					for (i = 0; i < count; i++) {
						newscript.appendChild(script.childNodes[i]);
					}
				}
				script.parentNode.replaceChild(newscript, script);
			};

			ns.util = util;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
