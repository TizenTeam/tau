/*global window, define */
/*jslint plusplus: true */
(function (window, document, ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../selectors",
			"./core"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");


			var selectors = ej.utils.selectors,
				DOM = ej.utils.DOM;

			/**
			* Returns given attribute set in closest elements from selector it in
			* closest form or fieldset.
			* @method inheritAttr
			* @memberOf ej.utils.DOM
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
			* @memberOf ej.utils.DOM
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
			* This function set value of attribute data-{namespace}-{name} for element. If namespace is empty then use attribute name data-{name}.
			* @method setNSData
			* @param {HTMLElement} element Base element
			* @param {string} name Name of attribute
			* @param {string|number|boolean} value New value
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.setNSData = function (element, name, value) {
				var namespace = ej.get('namespace'),
					dataNamespaceName = 'data-' + (namespace ? namespace + '-' : '') + name;
				element.setAttribute(dataNamespaceName, value);
			};

			/**
			* This function return value of attribute data-{namespace}-{name} for element. If namespace is empty then use attribute name data-{name}.
			* Method may return boolean in case of 'true' or 'false' strings as attribute value.
			* @method getNSData
			* @param {HTMLElement} element Base element
			* @param {string} name Name of attribute
			* @memberOf ej.utils.DOM
			* @return {?string|boolean}
			* @static
			*/
			DOM.getNSData = function (element, name) {
				var namespace = ej.get('namespace'),
					dataNamespaceName = 'data-' + (namespace ? namespace + '-' : '') + name,
					value = element.getAttribute(dataNamespaceName);

				if (value === 'true') {
					return true;
				}

				if (value === 'false') {
					return false;
				}

				return value;
			};

			/**
			* This function return true if attribute data-{namespace}-{name} for element is set or false in another case. If namespace is empty then use attribute name data-{name}.
			* @method hasNSData
			* @param {HTMLElement} element Base element
			* @param {string} name Name of attribute
			* @memberOf ej.utils.DOM
			* @return {boolean}
			* @static
			*/
			DOM.hasNSData = function (element, name) {
				var namespace = ej.get('namespace'),
					dataNamespaceName = 'data-' + (namespace ? namespace + '-' : '') + name;
				return element.hasAttribute(dataNamespaceName);
			};

			/**
			* This function remove attribute data-{namespace}-{name} from element. If namespace is empty then use attribute name data-{name}.
			* @method removeNSData
			* @param {HTMLElement} element Base element
			* @param {string} name Name of attribute
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.removeNSData = function (element, name) {
				var namespace = ej.get('namespace'),
					dataNamespaceName = 'data-' + (namespace ? namespace + '-' : '') + name;
				element.removeAttribute(dataNamespaceName);
			};

			/**
			* Return object with all data-* attributes of element
			* @method getData
			* @param {HTMLElement} element Base element
			* @memberOf ej.utils.DOM
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
			* @memberOf ej.utils.DOM
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
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.setAttribute = function (element, name, value) {
				element[name] = value;
				element.setAttribute(name, value);
			};
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ej.utils.DOM;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
