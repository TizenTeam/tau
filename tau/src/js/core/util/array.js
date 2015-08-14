/*global window, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Array Utility
 * Utility helps work with arrays.
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
			/**
			 * Create an array containing the range of integers or characters
			 * from low to high (inclusive)
			 * @method range
			 * @param {number|string} low
			 * @param {number|string} high
			 * @param {number} step
			 * @static
			 * @return {Array} array containing continous elements
			 * @member ns.util.array
			 */
			function range(low, high, step) {
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

			/**
			 * Check object is arraylike (arraylike include array and
			 * collection)
			 * @method isArrayLike
			 * @param {Object} object
			 * @return {boolean} Whether arraylike object or not
			 * @member ns.util.array
			 * @static
			 */
			function isArrayLike(object) {
				var type = typeof object,
					length = object && object.length;

				// if object exists and is different from window
				// window object has length property
				if (object && object !== object.window) {
					// If length value is not number, object is not array and collection.
					// Collection type is not array but has length value.
					// e.g) Array.isArray(document.childNodes) ==> false
					return Array.isArray(object) || object instanceof NodeList || type === "function" &&
						(length === 0 || typeof length === "number" && length > 0 && (length - 1) in object);
				}
				return false;
			}

			/**
			 * Faster version of standard forEach method in array
	 		 * Confirmed that this method is 20 times faster then native
			 * @method forEach
			 * @param {Array} array
			 * @param {Function} callback
			 * @member ns.util.array
			 * @static
			 */
			function forEach(array, callback) {
				var i,
					length;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					callback(array[i], i, array);
				}
			}


			/**
			 * Faster version of standard filter method in array
			 * @method filter
			 * @param {Array} array
			 * @param {Function} callback
			 * @member ns.util.array
			 * @static
			 */
			function filter(array, callback) {
				var result = [],
					i,
					length,
					value;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					value = array[i];
					if (callback(value, i, array)) {
						result.push(value);
					}
				}
				return result;
			}

			/**
			 * Faster version of standard map method in array
			 * Confirmed that this method is 60% faster then native
			 * @method map
			 * @param {Array} array
			 * @param {Function} callback
			 * @member ns.util.array
			 * @static
			 */
			function map(array, callback) {
				var result = [],
					i,
					length;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					result.push(callback(array[i], i, array));
				}
				return result;
			}

			/**
			 * Faster version of standard reduce method in array
			 * Confirmed that this method is 60% faster then native
			 * @method reduce
			 * @param {Array} array
			 * @param {Function} callback
			 * @param {*} [initialValue]
			 * @member ns.util.array
			 * @return {*}
			 * @static
			 */
			function reduce(array, callback, initialValue) {
				var i,
					length,
					value,
					result = initialValue;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					value = array[i];
					if (result === undefined && i === 0) {
						result = value;
					} else {
						result = callback(result, value, i, array);
					}
				}
				return result;
			}

			ns.util.array = {
				range: range,
				isArrayLike: isArrayLike,
				forEach: forEach,
				filter: filter,
				map: map,
				reduce: reduce
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.array;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
