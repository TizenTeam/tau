/*global window, define, ns */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #String Utility
 * Utility helps work with strings.
 * @class ns.util.string
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util", // fetch namespace
			"./array"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var DASH_TO_UPPER_CASE_REGEXP = /-([a-z])/gi,
				UPPER_TO_DASH_CASE_REGEXP = /([a-z0-9])([A-Z])/g,
				arrayUtil = ns.util.array;

			/**
			 * Callback method for regexp used in dashesToCamelCase method
			 * @method toUpperCaseFn
			 * @param {string} match
			 * @param {string} value
			 * @return {string}
			 * @member ns.util.string
			 * @static
			 * @private
			 */
			function toUpperCaseFn(match, value) {
				return value.toLocaleUpperCase();
			}

			/**
			 * Callback method for regexp used in camelCaseToDashes method
			 * @method toUpperCaseFn
			 * @param {string} match
			 * @param {string} value1
			 * @param {string} value2
			 * @return {string}
			 * @member ns.util.string
			 * @static
			 * @private
			 */
			function toLowerCaseFn(match, value1, value2) {
				return value1 + "-" + value2.toLocaleLowerCase();
			}

			/**
			 * Changes dashes string to camel case string
			 * @method firstToUpperCase
			 * @param {string} str
			 * @return {string}
			 * @member ns.util.string
			 * @static
			 */
			function dashesToCamelCase(str) {
				return str.replace(DASH_TO_UPPER_CASE_REGEXP, toUpperCaseFn);
			}

			/**
			 * Changes camel case string to dashes string
			 * @method camelCaseToDashes
			 * @param {string} str
			 * @return {string}
			 * @member ns.util.string
			 * @static
			 */
			function camelCaseToDashes(str) {
				return str.replace(UPPER_TO_DASH_CASE_REGEXP, toLowerCaseFn);
			}

			/**
			 * Changes the first char in string to uppercase
			 * @method firstToUpperCase
			 * @param {string} str
			 * @return {string}
			 * @member ns.util.string
			 * @static
			 */
			function firstToUpperCase(str) {
				return str.charAt(0).toLocaleUpperCase() + str.substring(1);
			}

			/**
			 * Parses comma separated string to array
			 * @method parseProperty
			 * @param {string} property
			 * @return {Array} containing number or null
			 * @member ns.util.string
			 * @static
			 */
			function parseProperty(property) {
				if (typeof property === "string") {
					property = property.split(",");
				}
				property = property || [];

				return arrayUtil.map(property, function (x) {
					var parsed;

					if (x && x.indexOf("%") === -1) {
						parsed = parseInt(x, 10);
						if (isNaN(parsed)) {
							parsed = null;
						}
						return parsed;
					} else {
						return x;
					}
				});
			}

			ns.util.string = {
				dashesToCamelCase: dashesToCamelCase,
				camelCaseToDashes: camelCaseToDashes,
				firstToUpperCase: firstToUpperCase,
				parseProperty: parseProperty
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.string;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
