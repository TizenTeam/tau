/*global window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/** @namespace ej.utils */
/**
 * @class ej.utils
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (window, ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"./core"
		],
		function () {
		//>>excludeEnd("ejBuildExclude");
			var currentFrame = null,
				/**
				* requestAnimationFrame function
				* @method requestAnimationFrame
				* @return {Function}
				* @memberOf ej.utils
				* @static
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
				* @class ej.utils
				*/
				/** @namespace ej.utils */
				utils = ej.utils || {};

			utils.requestAnimationFrame = requestAnimationFrame;

			/**
			* cancelAnimationFrame function
			* @method requestAnimationFrame
			* @return {Function}
			* @memberOf ej.utils
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
			* @alias requestAnimationFrame
			*/
			utils.async = requestAnimationFrame;

			/**
			* Checks if specified string is a number or not
			* @method isNumber
			* @return {boolean}
			* @memberOf ej.utils
			* @static
			*/
			utils.isNumber = function (query) {
				var parsed = parseFloat(query);
				return !isNaN(parsed) && isFinite(parsed);
			};

			ej.utils = utils;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ej.utils;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.ej));
