/*global window, define, NodeList */
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
			"./core"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			/**
			 * @property {DocumentFragment} fragment
			 * @memberOf ns.utils.DOM
			 * @private
			 * @static
			 */
			/*
			 * @todo maybe can be moved to function scope?
			 */
			var fragment = document.createDocumentFragment(),
				/**
				 * @property {DocumentFragment} fragment2
				 * @memberOf ns.utils.DOM
				 * @private
				 * @static
				 */
				/*
				 * @todo maybe can be moved to function scope?
				 */
				fragment2 = document.createDocumentFragment(),
				/**
				 * @property {number} [containerCounter=0]
				 * @memberOf ns.utils.DOM
				 * @private
				 * @static
				 */
				/*
				 * @todo maybe can be moved to function scope?
				 */
				containerCounter = 0,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @memberOf ns.utils.DOM
				 * @private
				 * @static
				 */
				slice = [].slice,
				DOM = ns.utils.DOM;

			/**
			 * Appends node or array-like node list array
			 * to context
			 * @method appendNodes
			 * @memberOf ns.utils.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 */
			DOM.appendNodes = function (context, elements) {
				var i,
					len;
				if (context) {
					if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
						elements = slice.call(elements);
						for (i = 0, len = elements.length; i < len; ++i) {
							context.appendChild(elements[i]);
						}
					} else {
						context.appendChild(elements);
					}
					return elements;
				}

				throw "Context empty!";
			};

			/**
			 * Replaces context with node or array-like node
			 * list
			 * @method replaceWithNodes
			 * @memberOf ns.utils.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 */
			DOM.replaceWithNodes = function (context, elements) {
				if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
					elements = this.insertNodesBefore(context, elements);
					context.parentNode.removeChild(context);
				} else {
					context.parentNode.replaceChild(elements, context);
				}
				return elements;
			};

			/**
			 * Remove all children
			 * @method removeAllChildren
			 * @memberOf ns.utils.DOM
			 * @param {HTMLElement} context
			 * @static
			 */
			DOM.removeAllChildren = function (context) {
				context.innerHTML = "";
			};

			/**
			* Inserts node or array-like node list before
			* context
			* @method insertNodesBefore
			* @memberOf ns.utils.DOM
			* @param {HTMLElement} context
			* @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			* @return {HTMLElement|Array|null}
			* @static
			*/
			DOM.insertNodesBefore = function (context, elements) {
				var i,
					len,
					parent;
				if (context) {
					parent = context.parentNode;
					if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
						elements = slice.call(elements);
						for (i = 0, len = elements.length; i < len; ++i) {
							parent.insertBefore(elements[i], context);
						}
					} else {
						parent.insertBefore(elements, context);
					}
					return elements;
				}

				throw "Context empty!";

			};

			/**
			* Inserts node after context
			* @method insertNodeAfter
			* @memberOf ns.utils.DOM
			* @param {HTMLElement} context
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @static
			*/
			DOM.insertNodeAfter = function (context, element) {
				if (context) {
					context.parentNode.insertBefore(element, context.nextSibling);
					return element;
				}
				throw "Context empty!";
			};

			/**
			* Wraps element or array-like node list in html
			* markup
			* @method wrapInHTML
			* @memberOf ns.utils.DOM
			* @param {HTMLElement|NodeList|HTMLCollection|Array} elements
			* @param {string} html
			* @return {HTMLElement|NodeList|Array} wrapped element
			* @static
			*/
			DOM.wrapInHTML = function (elements, html) {
				var container = document.createElement("div"),
					contentFlag = false,
					elementsLen = elements.length,
					//if elements is nodeList, retrieve parentNode of first node
					originalParentNode = elementsLen ? elements[0].parentNode : elements.parentNode,
					next = elementsLen ? elements[elementsLen - 1].nextSibling : elements.nextSibling,
					innerContainer;

				fragment.appendChild(container);
				html = html.replace(/(\$\{content\})/gi, function () {
					contentFlag = true;
					return "<span id='temp-container-" + (++containerCounter) + "'></span>";
				});
				container.innerHTML = html;

				if (contentFlag === true) {
					innerContainer = container.querySelector("span#temp-container-" + containerCounter);
					elements = this.replaceWithNodes(innerContainer, elements);
				} else {
					innerContainer = container.children[0];
					elements = this.appendNodes(innerContainer || container, elements);
				}

				// move the nodes
				while (fragment.firstChild.firstChild) {
					fragment2.appendChild(fragment.firstChild.firstChild);
				}

				// clean up
				while (fragment.firstChild) {
					fragment.removeChild(fragment.firstChild);
				}

				if (originalParentNode) {
					if (next) {
						originalParentNode.insertBefore(fragment2, next);
					} else {
						originalParentNode.appendChild(fragment2);
					}
				} else {
					// clean up
					while (fragment2.firstChild) {
						fragment2.removeChild(fragment2.firstChild);
					}
				}
				return elements;
			};
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ns.utils.DOM;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
