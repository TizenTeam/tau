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
			"../DOM"
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
					property,
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
						"border-bottom-width": 0,
						"box-sizing": ""
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

					if (includeOffset) {
						height = offsetHeight;
					} else if (outer && props["box-sizing"] !== 'border-box') {
						height += props["border-top-width"] + props["border-bottom-width"];
					}

					if (includeMargin) {
						height += Math.max(0, props["margin-top"]) + Math.max(0, props["margin-bottom"]);
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
						"border-right-width": 0,
						"box-sizing": ""
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

					if (includeOffset) {
						width = offsetWidth;
					} else if (outer && props["box-sizing"] !== 'border-box') {
						width += props["border-left-width"] + props["border-right-width"];
					}

					if (includeMargin) {
						width += Math.max(0, props["margin-left"]) + Math.max(0, props["margin-right"]);
					}
				}
				return width;
			};

			/**
			 * Returns offset of element
			 * @method getElementOffset
			 * @param {HTMLElement} element
			 * @return {Object}
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.getElementOffset = function (element) {
				var left = 0,
					top = 0;
				do {
					top += element.offsetTop;
					left += element.offsetLeft;
					element = element.offsetParent;
				} while (element !== null);

				return {
					top: top,
					left: left
				};
			};

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ns.utils.DOM;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, ns));
