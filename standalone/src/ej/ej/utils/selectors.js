/*global define: true, window: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class ns.utils.selectors
 * Utils class with selectors functions
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../utils" // fetch namespace
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var slice = [].slice,
				/**
				* @method matchesSelectorType
				* @return {string}
				* @private
				* @static
				* @memberOf ns.utils.selectors
				*/
				matchesSelectorType = (function () {
					var el = document.createElement("div");

					if (typeof el.webkitMatchesSelector === "function") {
						return "webkitMatchesSelector";
					}

					if (typeof el.mozMatchesSelector === "function") {
						return "mozMatchesSelector";
					}

					if (typeof el.msMatchesSelector === "function") {
						return "msMatchesSelector";
					}

					if (typeof el.matchesSelector === "function") {
						return "matchesSelector";
					}

					return false;
				}());

			function matchesSelector(element, selector) {
				if (matchesSelectorType) {
					return element[matchesSelectorType](selector);
				}
				return false;
			}

			function parents(element) {
				var items = [],
					current = element.parentNode;
				while (current && current !== document) {
					items.push(current);
					current = current.parentNode;
				}
				return items;
			}

			/**
			* Checks if given element and its ancestors matches given function
			* @method closest
			* @param {HTMLElement} element
			* @param {Function} testFunction
			* @return {?HTMLElement}
			* @static
			* @private
			* @memberOf ns.utils.selectors
			*/
			function closest(element, testFunction) {
				var current = element;
				while (current && current !== document) {
					if (testFunction(current)) {
						return current;
					}
					current = current.parentNode;
				}
				return null;
			}

			function testSelector(selector, node) {
				return matchesSelector(node, selector);
			}

			function testClass(className, node) {
				return node.classList.contains(className);
			}

			function testTag(tagName, node) {
				return node.tagName.toLowerCase() === tagName;
			}

			ns.utils.selectors = {
				/**
				* Runs matches implementation of matchesSelector
				* method on specified element
				* @method matchesSelector
				* @param {HTMLElement} element
				* @param {string} Selector
				* @return {boolean}
				* @static
				* @memberOf ns.utils.selectors
				*/
				matchesSelector: matchesSelector,

				/**
				* Return array with children pass by given selector.
				* @method getChildrenBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getChildrenBySelector: function (context, selector) {
					return slice.call(context.children).filter(testSelector.bind(null, selector));
				},

				/**
				* Return array with children pass by given data-namespace-selector.
				* @method getChildrenByDataNS
				* @param {HTMLElement} context
				* @param {string} dataSelector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getChildrenByDataNS: function (context, dataSelector) {
					var namespace = ns.get('namespace'),
						fullDataSelector = '[data-' + (namespace ? namespace + '-' : '') + dataSelector + ']';
					return slice.call(context.children).filter(testSelector.bind(null, fullDataSelector));
				},

				/**
				* Return array with children with given class name.
				* @method getChildrenByClass
				* @param {HTMLElement} context
				* @param {string} className
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getChildrenByClass: function (context, className) {
					return slice.call(context.children).filter(testClass.bind(null, className));
				},

				/**
				* Return array with children with given tag name.
				* @method getChildrenByTag
				* @param {HTMLElement} context
				* @param {string} tagName
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getChildrenByTag: function (context, tagName) {
					return slice.call(context.children).filter(testTag.bind(null, tagName));
				},

				/**
				* Return array with all parents of element.
				* @method getParents
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getParents: parents,

				/**
				* Return array with all parents of element pass by given selector.
				* @method getParentsBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getParentsBySelector: function (context, selector) {
					return parents(context).filter(testSelector.bind(null, selector));
				},

				/**
				* Return array with all parents of element pass by given selector with namespace.
				* @method getParentsBySelectorNS
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getParentsBySelectorNS: function (context, selector) {
					var namespace = ns.get('namespace'),
						fullSelector = '[data-' + (namespace ? namespace + '-' : '') + selector + ']';
					return parents(context).filter(testSelector.bind(null, fullSelector));
				},

				/**
				* Return array with all parents of element with given class name.
				* @method getParentsByClass
				* @param {HTMLElement} context
				* @param {string} className
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getParentsByClass: function (context, className) {
					return parents(context).filter(testClass.bind(null, className));
				},

				/**
				* Return array with all parents of element with given tag name.
				* @method getParentsByTag
				* @param {HTMLElement} context
				* @param {string} tagName
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getParentsByTag: function (context, tagName) {
					return parents(context).filter(testTag.bind(null, tagName));
				},

				/**
				* Return first element from parents of element pass by selector.
				* @method getClosestBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getClosestBySelector: function (context, selector) {
					return closest(context, testSelector.bind(null, selector));
				},

				/**
				* Return first element from parents of element pass by selector with namespace.
				* @method getClosestBySelectorNS
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getClosestBySelectorNS: function (context, selector) {
					var namespace = ns.get('namespace'),
						fullSelector = '[data-' + (namespace ? namespace + '-' : '') + selector + ']';
					return closest(context, testSelector.bind(null, fullSelector));
				},

				/**
				* Return first element from parents of element with given class name.
				* @method getClosestByClass
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getClosestByClass: function (context, selector) {
					return closest(context, testClass.bind(null, selector));
				},

				/**
				* Return first element from parents of element with given tag name.
				* @method getClosestByTag
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getClosestByTag: function (context, selector) {
					return closest(context, testTag.bind(null, selector));
				},

				/**
				* Return array of elements from context with given data-selector
				* @method getAllByDataNS
				* @param {HTMLElement} context
				* @param {string} dataSelector
				* @return {Array}
				* @static
				* @memberOf ns.utils.selectors
				*/
				getAllByDataNS: function (context, dataSelector) {
					var namespace = ns.get('namespace'),
						fullDataSelector = '[data-' + (namespace ? namespace + '-' : '') + dataSelector + ']';
					return slice.call(context.querySelectorAll(fullDataSelector));
				}
			};
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ns.utils.selectors;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej));
