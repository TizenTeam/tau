/*global window, define */
/*jslint plusplus: true */
/*jshint -W069 */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			var DOM = ns.utils.DOM;

			/**
			 * Returns css property for element
			 * @param {HTMLElement} element
			 * @param {string} property
			 * @param {string=} [def] default returned value
			 * @param {string=} [type] auto type casting
			 * @return {string|number|null}
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.getCSSProperty = function (element, property, def, type) {
				var style = window.getComputedStyle(element),
					value = null,
					result = def;
				if (style) {
					value = style.getPropertyValue(property);
					if (value) {
						switch (type) {
						case "integer":
							value = parseInt(value, 10);
							if (!isNaN(value)) {
								result = value;
							}
							break;
						case "float":
							value = parseFloat(value);
							if (!isNaN(value)) {
								result = value;
							}
							break;
						default:
							result = value;
							break;
						}
					}
				}
				return result;
			};

			/**
			 * Extracts css properties from computed css for an element.
			 * The properties values are applied to the specified
			 * properties list (dictionary)
			 * @param {HTMLElement} element
			 * @param {Object} properties
			 * @param {string=} [pseudoSelector]
			 * @param {boolean=} [noConversion]
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.extractCSSProperties = function (element, properties, pseudoSelector, noConversion) {
				var style = window.getComputedStyle(element, pseudoSelector),
					property = null,
					value = null,
					utils = ns.utils;
				for (property in properties) {
					if (properties.hasOwnProperty(property)) {
						value = style.getPropertyValue(property);
						if (utils.isNumber(value) && !noConversion) {
							if (value.match(/\./gi)) {
								properties[property] = parseFloat(value);
							} else {
								properties[property] = parseInt(value, 10);
							}
						} else {
							properties[property] = value;
						}
					}
				}
			};

			/**
			 * Returns elements height from computed style
			 * @param {HTMLElement} element
			 * @param {string=} [type] outer|inner
			 * @param {boolean=} [includeOffset]
			 * @param {boolean=} [includeMargin]
			 * @param {string=} [pseudoSelector]
			 * @param {boolean=} [force] check even if element is hidden
			 * @return {number}
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.getElementHeight = function (element, type, includeOffset, includeMargin, pseudoSelector, force) {
				var height = 0,
					style,
					originalDisplay = null,
					originalVisibility = null,
					originalPosition = null,
					outer = (type && type === "outer") || false,
					offsetHeight = 0,
					props = {
						"height": 0,
						"margin-top": 0,
						"margin-bottom": 0,
						"padding-top": 0,
						"padding-bottom": 0,
						"border-top-width": 0,
						"border-bottom-width": 0
					};
				if (element) {
					style = element.style;
					
					if (style.display !== "none") {
						this.extractCSSProperties(element, props, pseudoSelector);
						offsetHeight = element.offsetHeight;
					} else if (force) {
						originalDisplay = style.display;
						originalVisibility = style.visibility;
						originalPosition = style.position;

						style.display = "block";
						style.visibility = "hidden";
						style.position = "relative";

						this.extractCSSProperties(element, props, pseudoSelector);
						offsetHeight = element.offsetHeight;
						
						style.display = originalDisplay;
						style.visibility = originalVisibility;
						style.position = originalPosition;
					}

					height += props["height"] + props["padding-top"] + props["padding-bottom"];
					if (outer) {
						height += props["border-top-width"] + props["border-bottom-width"];
					}

					if (includeOffset) {
						height += offsetHeight;
					}

					if (includeMargin) {
						height += props["margin-top"] + props["margin-bottom"];
					}
				}
				return height;
			};

			/**
			 * Returns elements width from computed style
			 * @param {HTMLElement} element
			 * @param {string=} [type] outer|inner
			 * @param {boolean=} [includeOffset]
			 * @param {boolean=} [includeMargin]
			 * @param {string=} [pseudoSelector]
			 * @param {boolean=} [force] check even if element is hidden
			 * @return {number}
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.getElementWidth = function (element, type, includeOffset, includeMargin, pseudoSelector, force) {
				var width = 0,
					style,
					originalDisplay = null,
					originalVisibility = null,
					originalPosition = null,
					offsetWidth = 0,
					outer = (type && type === "outer") || false,
					props = {
						"width": 0,
						"margin-left": 0,
						"margin-right": 0,
						"padding-left": 0,
						"padding-right": 0,
						"border-left-width": 0,
						"border-right-width": 0
					};
				if (element) {
					style = element.style;
					
					if (style.display !== "none") {
						this.extractCSSProperties(element, props, pseudoSelector);
						offsetWidth = element.offsetWidth;
					} else if (force) {
						originalDisplay = style.display;
						originalVisibility = style.visibility;
						originalPosition = style.position;

						style.display = "block";
						style.visibility = "hidden";
						style.position = "relative";

						this.extractCSSProperties(element, props, pseudoSelector);
						
						style.display = originalDisplay;
						style.visibility = originalVisibility;
						style.position = originalPosition;
					}

					width += props["width"] + props["padding-left"] + props["padding-right"];
					if (outer) {
						width += props["border-left-width"] + props["border-right-width"];
					}

					if (includeOffset) {
						width += offsetWidth;
					}

					if (includeMargin) {
						width += props["margin-left"] + props["margin-right"];
					}
				}
				return width;
			};

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ns.utils.DOM;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
