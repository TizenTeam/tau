/*global window, define */
/**
 * #Array utilities
 * @class ns.util.array
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/*
			* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL licenses
			* http://phpjs.org/functions/range
			* original by: Waldo Malqui Silva
			* version: 1107.2516
			*/
			function _range(low, high, step) {
				// Create an array containing the range of integers or characters
				// from low to high (inclusive)
				//
				// version: 1107.2516
				// discuss at: http://phpjs.org/functions/range
				// +   original by: Waldo Malqui Silva
				// *	example 1: range ( 0, 12 );
				// *	returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
				// *	example 2: range( 0, 100, 10 );
				// *	returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
				// *	example 3: range( 'a', 'i' );
				// *	returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
				// *	example 4: range( 'c', 'a' );
				// *	returns 4: ['c', 'b', 'a']
				var matrix = [],
					inival,
					endval,
					plus,
					walker = step || 1,
					chars = false;

				if (!isNaN(low) && !isNaN(high)) {
					inival = low;
					endval = high;
				} else if (isNaN(low) && isNaN(high)) {
					chars = true;
					inival = low.charCodeAt(0);
					endval = high.charCodeAt(0);
				} else {
					inival = (isNaN(low) ? 0 : low);
					endval = (isNaN(high) ? 0 : high);
				}

				plus = inival <= endval;
				if (plus) {
					while (inival <= endval) {
						matrix.push((chars ? String.fromCharCode(inival) : inival));
						inival += walker;
					}
				} else {
					while (inival >= endval) {
						matrix.push((chars ? String.fromCharCode(inival) : inival));
						inival -= walker;
					}
				}

				return matrix;
			}

			ns.util.array = {
				/**
				* Create an array containing the range of integers or characters
				* from low to high (inclusive)
				* @param {number|string} low
				* @param {number|string} high
				* @param {number} step
				* @static
				* @return {Array} array containing continous elements
				*/
				range: _range
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.array;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));