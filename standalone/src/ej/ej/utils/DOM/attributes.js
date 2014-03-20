/*global window, define */
/*jslint plusplus: true */
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
			"../selectors",
			"./core"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");


			var selectors = ns.utils.selectors,
				DOM = ns.utils.DOM;

			/**
			 * Returns given attribute from element or the closest parent,
			 * which matches the selector.
			 * @method inheritAttr
			 * @memberOf ns.utils.DOM
			 * @param {HTMLElement} element
			 * @param {string} attr
			 * @param {string} selector
			 * @return {?string}
			 * @static
			 */
			DOM.inheritAttr = function (element, attr, selector) {
				var value = element.getAttribute(attr),
					parent;
				if (!value) {
					parent = selectors.getClosestBySelector(element, selector);
					if (parent) {
						return parent.getAttribute(attr);
					}
				}
				return value;
			};

			/**
			 * Returns Number from properties described in html tag
			 * @method getNumberFromAttribute
			 * @memberOf ns.utils.DOM
			 * @param {HTMLElement} element
			 * @param {string} attribute
			 * @param {string=} [type] auto type casting
			 * @param {number} [defaultValue] default returned value
			 * @static
			 * @return {number}
			 */
			DOM.getNumberFromAttribute = function (element, attribute, type, defaultValue) {
				var value = element.getAttribute(attribute),
					result = defaultValue;

				if (value) {
					if (type === "float") {
						value = parseFloat(value);
						if (value) {
							result = value;
						}
					} else {
						value = parseInt(value, 10);
						if (value) {
							result = value;
						}
					}
				}
				return result;
			};

			/**
			 * This function sets value of attribute data-{namespace}-{name} for element.
			 * If the namespace is empty, the attribute data-{name} is used.
			 * @method setNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @param {string|number|boolean} value New value
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.setNSData = function (element, name, value) {
				var namespace = ns.get("namespace"),
					dataNamespaceName = "data-" + (namespace ? namespace + "-" : "") + name;
				element.setAttribute(dataNamespaceName, value);
			};

			/**
			 * This function returns value of attribute data-{namespace}-{name} for element.
			 * If the namespace is empty, the attribute data-{name} is used.
			 * Method may return boolean in case of 'true' or 'false' strings as attribute value.
			 * @method getNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @memberOf ns.utils.DOM
			 * @return {?string|boolean}
			 * @static
			 */
			DOM.getNSData = function (element, name) {
				var namespace = ns.get("namespace"),
					dataNamespaceName = "data-" + (namespace ? namespace + "-" : "") + name,
					value = element.getAttribute(dataNamespaceName);

				if (value === "true") {
					return true;
				}

				if (value === "false") {
					return false;
				}

				return value;
			};

			/**
			 * This function returns true if attribute data-{namespace}-{name} for element is set
			 * or false in another case. If the namespace is empty, attribute data-{name} is used.
			 * @method hasNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @memberOf ns.utils.DOM
			 * @return {boolean}
			 * @static
			 */
			DOM.hasNSData = function (element, name) {
				var namespace = ns.get("namespace"),
					dataNamespaceName = "data-" + (namespace ? namespace + "-" : "") + name;
				return element.hasAttribute(dataNamespaceName);
			};

			/**
			 * This function removes attribute data-{namespace}-{name} from element.
			 * If the namespace is empty, attribute data-{name} is used.
			 * @method removeNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.removeNSData = function (element, name) {
				var namespace = ns.get("namespace"),
					dataNamespaceName = "data-" + (namespace ? namespace + "-" : "") + name;
				element.removeAttribute(dataNamespaceName);
			};

			/**
			 * Returns object with all data-* attributes of element
			 * @method getData
			 * @param {HTMLElement} element Base element
			 * @memberOf ns.utils.DOM
			 * @return {Object}
			 * @static
			 */
			DOM.getData = function (element) {
				var dataPrefix = "data-",
					data = {},
					attrs = element.attributes,
					attr,
					nodeName,
					i,
					length = attrs.length;

				for (i = 0; i < length; i++) {
					attr = attrs.item(i);
					nodeName = attr.nodeName;
					if (nodeName.indexOf(dataPrefix) > -1) {
						data[nodeName.replace(dataPrefix, "")] = attr.nodeValue;
					}
				}

				return data;
			};

			/**
			 * Special function to remove attribute and property in the same time
			 * @method removeAttribute
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.removeAttribute = function (element, name) {
				element.removeAttribute(name);
				element[name] = false;
			};

			/**
			 * Special function to set attribute and property in the same time
			 * @method setAttribute
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @param {Mixed} value
			 * @memberOf ns.utils.DOM
			 * @static
			 */
			DOM.setAttribute = function (element, name, value) {
				element[name] = value;
				element.setAttribute(name, value);
			};
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ns.utils.DOM;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
