/*global window, define */
/*jslint nomen: true */
/** @namespace ej.utils */
/**
 * @class ej.utils
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
				/**
				* return requestAnimationFrame function
				* @method requestAnimationFrame
				* @return {Function}
				* @memberOf ej.utils
				* @static
				*/
			var requestAnimationFrame = (function () {
					return window.requestAnimationFrame
						|| window.webkitRequestAnimationFrame
						|| window.mozRequestAnimationFrame
						|| window.oRequestAnimationFrame
						|| function (callback) {
							window.setTimeout(callback, 1000 / 60);
						};
				}()).bind(window),
				/**
				* return cancelAnimationFrame function
				* @method requestAnimationFrame
				* @return {Function}
				* @memberOf ej.utils
				* @static
				*/
				cancelAnimationFrame = (function () {
					return window.cancelAnimationFrame
						|| window.webkitCancelAnimationFrame
						|| window.mozCancelAnimationFrame
						|| window.oCancelAnimationFrame
						|| function (id) {
							window.clearTimeout(id);
						};
				}()).bind(window);

			/**
			* Class with utils functions
			* @class ej.utils
			*/
			/** @namespace ej.utils */
			ej.utils = {
				requestAnimationFrame: requestAnimationFrame,
				cancelAnimationFrame: cancelAnimationFrame,
				/**
				* @alias requestAnimationFrame
				*/
				async: requestAnimationFrame,

				/**
				* Checks if specified string is a number or not
				* @method isNumber
				* @return {boolean}
				* @memberOf ej.utils
				* @static
				*/
				isNumber: function (query) {
					var parsed = parseFloat(query);
					return !isNaN(parsed) && isFinite(parsed);
				}
			};

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ej.utils;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.ej));
