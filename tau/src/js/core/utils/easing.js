/*global window, define */
/*jslint nomen: true, plusplus: true */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../utils"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			* easing
			* @class ns.utils.easing
			*/
			ns.utils.easing = {
				/**
				* Performs cubit out easing calcuclations based on time
				* @method cubicOut
				* @member ns.utils.easing
				* @param {number} currentTime
				* @param {number} startValue
				* @param {number} changeInValue
				* @param {number} duration
				* @return {number}
				* @static
				*/
				cubicOut: function (currentTime, startValue, changeInValue, duration) {
					currentTime /= duration;
					currentTime--;
					return changeInValue * (currentTime * currentTime * currentTime + 1) + startValue;
				},

				/**
				 * Performs quad easing out calcuclations based on time
				 * @method cubicOut
				 * @member ns.utils.easing
				 * @param {number} currentTime
				 * @param {number} startValue
				 * @param {number} changeInValue
				 * @param {number} duration
				 * @return {number}
				 * @static
				 */
				easeOutQuad: function (currentTime, startValue, changeInValue, duration) {
					return -changeInValue * (currentTime /= duration) * (currentTime - 2) + startValue;
				},

				/**
				* Performs out expo easing calcuclations based on time
				* @method easeOutExpo
				* @member ns.utils.easing
				* @param {number} currentTime
				* @param {number} startValue
				* @param {number} changeInValue
				* @param {number} duration
				* @return {number}
				* @static
				*/
				easeOutExpo: function (currentTime, startValue, changeInValue, duration) {
					return (currentTime === duration) ?
							startValue + changeInValue :
								changeInValue * (-Math.pow(2, -10 * currentTime / duration) + 1) +
								startValue;
				},
				/**
				* Performs out linear calcuclations based on time
				* @method linear
				* @member ns.utils.easing
				* @param {number} currentTime
				* @param {number} startValue
				* @param {number} changeInValue
				* @param {number} duration
				* @return {number}
				* @static
				*/
				linear: function (currentTime, startValue, changeInValue, duration) {
					return startValue + duration * currentTime;
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.utils.easing;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));