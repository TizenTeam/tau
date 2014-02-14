/*global window, define */
/*jslint plusplus: true */
(function (window, document, ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			var DOM = ej.utils.DOM;

			/**
			* Returns css property for element
			* @param {HTMLElement} element
			* @param {string} property
			* @param {string=} [def] default returned value
			* @param {string=} [type] auto type casting
			* @return {string|number|null}
			* @memberOf ej.utils.DOM
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
			* Extracts css properties from computed css for an element
			* The properties values are applied to the specified
			* properties list (dictionary)
			* @param {HTMLElement} element
			* @param {Object} properties
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.extractCSSProperties = function (element, properties) {
				var style = window.getComputedStyle(element),
					property = null,
					value = null,
					utils = ej.utils;
				for (property in properties) {
					if (properties.hasOwnProperty(property)) {
						value = style.getPropertyValue(property);
						if (utils.isNumber(value)) {
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
			* @param {string=} [pseudoSelector]
			* @return {number}
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.getElementHeight = function (element, pseudoSelector) {
				var height = 0,
					style,
					parsedValue;
				if (element) {
					style = window.getComputedStyle(element, pseudoSelector);
					if (style) {
						if (style.getPropertyValue("display") !== "none") {
							parsedValue = parseInt(style.getPropertyValue("height"), 10);
							height += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("padding-top"), 10);
							height += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("padding-bottom"), 10);
							height += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("margin-top"), 10);
							height += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("margin-bottom"), 10);
							height += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("border-top"), 10);
							height += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("border-bottom"), 10);
							height += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;
						}
					}
				}
				return height;
			};

			/**
			* Returns elements width from computed style
			* @param {HTMLElement} element
			* @param {string=} [pseudoSelector]
			* @return {number}
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.getElementWidth = function (element, pseudoSelector) {
				var width = 0,
					style,
					parsedValue;
				if (element) {
					style = window.getComputedStyle(element, pseudoSelector);
					if (style) {
						if (style.getPropertyValue("display") !== "none") {
							parsedValue = parseInt(style.getPropertyValue("width"), 10);
							width += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("padding-left"), 10);
							width += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("padding-right"), 10);
							width += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("margin-left"), 10);
							width += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("margin-right"), 10);
							width += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("border-left"), 10);
							width += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;

							parsedValue = parseInt(style.getPropertyValue("border-right"), 10);
							width += (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : 0;
						}
					}
				}
				return width;
			};

			/**
			* Returns height for all elements from offset. If offset is not set then returns height from computed style
			* @method getHeight
			* @param {HTMLElement} element
			* @param {string=} [pseudoSelector]
			* @return {number}
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.getHeight = function (element, pseudoSelector) {
				var height = 0,
					style,
					parsedValue,
					originalDisplay,
					originalVisibility,
					originalPosition,
					elemStyle = element.style;
				pseudoSelector = (pseudoSelector === undefined) ? null : pseudoSelector;

				if (element) {
					height = element.offsetHeight;
					// some non-html elements return undefined for offsetWidth, so check for null/undefined
					if (height <= 0 || height === null) {
						if (elemStyle.display !== "none") {
							style = window.getComputedStyle(element, pseudoSelector);
							parsedValue = parseInt(style.getPropertyValue("height"), 10);
							height = (!isNaN(parsedValue)) ? parsedValue : 0;
						} else {
							//temporary invisibly show element to get dimensions
							originalDisplay = elemStyle.display;
							originalVisibility = elemStyle.visibility;
							originalPosition = elemStyle.position;

							elemStyle.display = "block";
							elemStyle.visibility = "hidden";
							elemStyle.position = "absolute";
							style = window.getComputedStyle(element, pseudoSelector);
							parsedValue = parseInt(style.getPropertyValue("height"), 10);
							height = (!isNaN(parsedValue)) ? parsedValue : 0;

							elemStyle.display = originalDisplay;
							elemStyle.visibility = originalVisibility;
							elemStyle.position = originalPosition;
						}
					}
				}
				return height;
			};

			/**
			* Returns width for all elements from offset. If offset is not set then returns width from computed style
			* @method getWidth
			* @param {HTMLElement} element
			* @param {string=} [pseudoSelector]
			* @return {number}
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.getWidth = function (element, pseudoSelector) {
				var width = 0,
					style,
					parsedValue,
					originalDisplay,
					originalVisibility,
					originalPosition,
					elemStyle = element.style;
				pseudoSelector = (pseudoSelector === undefined) ? null : pseudoSelector;

				if (element) {
					width = element.offsetWidth;
					// some non-html elements return undefined for offsetWidth, so check for null/undefined
					if (width <= 0 || width === null) {
						if (elemStyle.display !== "none") {
							style = window.getComputedStyle(element, pseudoSelector);
							parsedValue = parseInt(style.getPropertyValue("width"), 10);
							width = (!isNaN(parsedValue)) ? parsedValue : 0;
						} else {
							//temporary invisibly show element to get dimensions
							originalDisplay = elemStyle.display;
							originalVisibility = elemStyle.visibility;
							originalPosition = elemStyle.position;

							elemStyle.display = "block";
							elemStyle.visibility = "hidden";
							elemStyle.position = "absolute";
							style = window.getComputedStyle(element, pseudoSelector);
							parsedValue = parseInt(style.getPropertyValue("width"), 10);
							width = (!isNaN(parsedValue)) ? parsedValue : 0;
							elemStyle.display = originalDisplay;

							elemStyle.display = originalDisplay;
							elemStyle.visibility = originalVisibility;
							elemStyle.position = originalPosition;
						}
					}
				}
				return width;
			};
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ej.utils.DOM;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
