/*global window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Utils
 * Namespace for all utils class
 * @class ns.utils
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../core"
		],
		function () {
		//>>excludeEnd("ejBuildExclude");
			var currentFrame = null,
				/**
				 * requestAnimationFrame function
				 * @method requestAnimationFrame
				 * @return {Function}
				 * @static
				 * @memberOf ns.utils
				*/
				requestAnimationFrame = (window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					function (callback) {
						currentFrame = window.setTimeout(callback.bind(callback, +new Date()), 1000 / 60);
					}).bind(window),
				/**
				* Class with utils functions
				* @class ns.utils
				*/
				/** @namespace ns.utils */
				utils = ns.utils || {};

			utils.requestAnimationFrame = requestAnimationFrame;

			/**
			* cancelAnimationFrame function
			* @method cancelAnimationFrame
			* @return {Function}
			* @memberOf ns.utils
			* @static
			*/
			utils.cancelAnimationFrame = (window.cancelAnimationFrame ||
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
			 * @memberOf ns.utils
			 * @static
			 */
			utils.async = requestAnimationFrame;

			/**
			* Checks if specified string is a number or not
			* @method isNumber
			* @return {boolean}
			* @memberOf ns.utils
			* @static
			*/
			utils.isNumber = function (query) {
				var parsed = parseFloat(query);
				return !isNaN(parsed) && isFinite(parsed);
			};

			ns.utils = utils;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ns.utils;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, ns));
