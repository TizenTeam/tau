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
/*global window, ns, define, NodeList, HTMLCollection */
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../DOM"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var /**
				 * @property {number} [containerCounter=0]
				 * @member ns.util.DOM
				 * @private
				 * @static
				 */
				containerCounter = 0,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @member ns.util.DOM
				 * @private
				 * @static
				 */
				slice = [].slice,
				DOM = ns.util.DOM,
				contentRegex = /(\$\{content\})/gi;

			/**
			 * Appends node or array-like node list array to context
			 * @method appendNodes
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 * @throws {string}
			 */
			DOM.appendNodes = function (context, elements) {
				var i,
					length,
					arrayElements;

				if (context) {
					if (elements instanceof Array || elements instanceof NodeList ||
						elements instanceof HTMLCollection) {
						arrayElements = slice.call(elements);
						for (i = 0, length = arrayElements.length; i < length; i += 1) {
							context.appendChild(arrayElements[i]);
						}
					} else {
						context.appendChild(elements);
						arrayElements = elements;
					}
					return arrayElements;
				}

				throw "Context empty!";
			};

			/**
			 * Replaces context with node or array-like node list
			 * @method replaceWithNodes
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 */
			DOM.replaceWithNodes = function (context, elements) {
				var returnElements;

				if (elements instanceof Array || elements instanceof NodeList ||
					elements instanceof HTMLCollection) {
					returnElements = this.insertNodesBefore(context, elements);
					context.parentNode.removeChild(context);
				} else {
					context.parentNode.replaceChild(elements, context);
					returnElements = elements;
				}
				return returnElements;
			};

			/**
			 * Remove all children
			 * @method removeAllChildren
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @static
			 */
			DOM.removeAllChildren = function (context) {
				context.innerHTML = "";
			};

			/**
			 * Inserts node or array-like node list before context
			 * @method insertNodesBefore
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 * @throws {string}
			 */
			DOM.insertNodesBefore = function (context, elements) {
				var i,
					length,
					parent,
					returnElements;

				if (context) {
					parent = context.parentNode;
					if (elements instanceof Array || elements instanceof NodeList ||
						elements instanceof HTMLCollection) {
						returnElements = slice.call(elements);
						for (i = 0, length = returnElements.length; i < length; ++i) {
							parent.insertBefore(returnElements[i], context);
						}
					} else {
						parent.insertBefore(elements, context);
						returnElements = elements;
					}
					return returnElements;
				}

				throw "Context empty!";

			};

			/**
			 * Inserts node after context
			 * @method insertNodeAfter
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @static
			 * @throws {string}
			 */
			DOM.insertNodeAfter = function (context, element) {
				if (context) {
					context.parentNode.insertBefore(element, context.nextSibling);
					return element;
				}
				throw "Context empty!";
			};

			/**
			 * Remove all children of node.
			 * @param {Node} fragment
			 */
			function cleanFragment(fragment) {
				// clean up
				while (fragment.firstChild) {
					fragment.removeChild(fragment.firstChild);
				}
			}

			/**
			 * Move nodes from one node to another.
			 * @param {Node} fromNode
			 * @param {Node} toNode
			 */
			function moveChilds(fromNode, toNode) {
				// move the nodes
				while (fromNode.firstChild) {
					toNode.appendChild(fromNode.firstChild);
				}
			}

			/**
			 * Prepare container for filling template
			 * @param {Node} fragment
			 * @param {string} html
			 * @return {{container: *, contentFlag: boolean}}
			 */
			function prepareContainer(fragment, html) {
				var container = document.createElement("div"),
					contentFlag = false;

				fragment.appendChild(container);

				container.innerHTML = html.replace(contentRegex, function () {
					contentFlag = true;
					return "<span id='temp-container-" + (++containerCounter) + "'></span>";
				});

				return {
					container: container,
					contentFlag: contentFlag
				};
			}

			/**
			 * Wraps element or array-like node list in html markup
			 * @method wrapInHTML
			 * @param {HTMLElement|NodeList|HTMLCollection|Array} elements
			 * @param {string} html
			 * @return {HTMLElement|NodeList|Array} wrapped element
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.wrapInHTML = function (elements, html) {
				var fragment = document.createDocumentFragment(),
					fragment2 = document.createDocumentFragment(),
					elementsLen = elements.length,
					//if elements is nodeList, retrieve parentNode of first node
					originalParentNode = elementsLen ? elements[0].parentNode : elements.parentNode,
					next = elementsLen ? elements[elementsLen - 1].nextSibling : elements.nextSibling,
					innerContainer,
					resultElements,
					containerData;

				containerData = prepareContainer(fragment, html);

				if (containerData.contentFlag === true) {
					innerContainer = containerData.container.querySelector("span#temp-container-" +
						containerCounter);
					resultElements = this.replaceWithNodes(innerContainer, elements);
				} else {
					innerContainer = containerData.container.children[0];
					resultElements = this.appendNodes(innerContainer || containerData.container, elements);
				}

				moveChilds(fragment.firstChild, fragment2);
				cleanFragment(fragment);

				if (originalParentNode) {
					originalParentNode.insertBefore(fragment2, next);
				} else {
					cleanFragment(fragment2);
				}

				return resultElements;
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.DOM;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
