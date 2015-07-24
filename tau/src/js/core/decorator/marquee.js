/* global define, window, ns */
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
 * #Dectorator for marquee
 *
 * @class ns.decorator.focusAnimation
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../decorator",
			"../util/DOM/css"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var marquee,
				domUtils = ns.util.DOM,
				classes = {
					marquee: "ui-marquee",
					marqueeStart: "ui-marquee-start",
					clone: "ui-marquee-clone"
				},
				// number of pixels per s
				SPEED = 80,
				// space in pixels between repeat
				SPACE = 50,
				status;

			/**
			 * Prepare animation stylesheet and css style on element.
			 * @method prepareAnimation
			 * @param {HTMLElement} element
			 * @param {string} index index of element
			 * @member ns.decorator.marquee
			 * @private
			 * @static
			 */
			function prepareAnimation(element, index) {
				var style = document.createElement("style"),
					elementWidth = element.scrollWidth + SPACE,
					animationNode,
					animationName = "marquee" + index,
					animation;

				// prepare definition of animation
				// the id of stylesheet is the same as name of animation used on element
				style.id = animationName;
				// @-webkit-keyframes
				animation = "@-webkit-keyframes " + animationName +" {" +
					" 0% {  text-indent: 0px; }" +
					" 100% { text-indent: -" + elementWidth + "px } }";
				// @keyframes
				animation += " @keyframes " + animationName +" {" +
				  " 0% {  text-indent: 0px; }" +
				  " 100% { text-indent: -" + elementWidth + "px } }";
				// @-moz-keyframes
				animation += " @-moz-keyframes " + animationName +" {" +
				  " 0% {  text-indent: 0px; }" +
				  " 100% { text-indent: -" + elementWidth + "px } }";
				// create text node with definition of animation
				animationNode = document.createTextNode(animation);

				// add stylesheet with animation to document
				style.appendChild(animationNode);
				document.head.appendChild(style);

				// set animation on element
				domUtils.setPrefixedStyle(element, "animation", animationName + " " + elementWidth/SPEED  + "s linear 1s infinite");
			}

			/**
			 * Create copy of element
			 * @method createCopy
			 * @param {HTMLElement} element
			 * @member ns.decorator.marquee
			 * @private
			 * @static
			 */
			function createCopy(element) {
				var clone,
					cloneStyle;

				clone = element.cloneNode(true);
				clone.classList.add(classes.clone);
				domUtils.setPrefixedStyle(clone, "animation", "");
				cloneStyle = clone.style;
				// set margins for cloned element
				// this is space between text and its repeat
				cloneStyle.marginLeft = SPACE + "px";
				cloneStyle.marginRight = SPACE + "px";
				element.appendChild(clone);
			}

			/**
			 * Set marquee on single element.
			 * @method setMarqueeOnElement
			 * @param {HTMLElement} element
			 * @param {string} index index of element
			 * @param {boolean} [withoutCopy] if true, element will not be copied and there will be only long space
			 * @return {boolean}
			 * @member ns.decorator.marquee
			 * @private
			 * @static
			 */
			function setMarqueeOnElement(element, index, withoutCopy) {
				var elementClasses = element.classList;

				// if text is longer than space, the marquee will be set
				if (element.clientWidth < element.scrollWidth) {
					// set animation
					prepareAnimation(element, index);
					if (!withoutCopy) {
						createCopy(element);
					}
					elementClasses.add(classes.marqueeStart);
					return true;
				}
				return false;
			}

			/**
			 * Enable marquee on children of element
			 * @method setChildren
			 * @param {HTMLElement} element
			 * @param {string} index
			 * @member ns.decorator.marquee
			 * @private
			 * @static
			 */
			function setChildren(element, index) {
				var marqueeStartClass = classes.marqueeStart,
					children = element.children,
					length = children.length,
					status = false,
					child,
					i;

				// if element has children, we try to set marquee on elements inside
				for (i = 0; i < length; i++) {
					child = children[i];
					// if element has already set marquee, we finish adding marquee effect
					if (child.classList.contains(marqueeStartClass)) {
						return true;
					}
					if (child.children.length) {
						// status OR result of function setChildren
						status |= setChildren(child, index + i);
					} else {
						status |= setMarqueeOnElement(child, index + i);
					}
				}

				return status;
			}

			/**
			 * Enable marquee on given element.
			 * @method prepareFocusAnimation
			 * @param {Event} event
			 * @member ns.decorator.marquee
			 * @private
			 * @static
			 */
			function prepareFocusAnimation(event) {
				var options = event.detail || {},
					baseElement = options.element,
					element = baseElement && baseElement.querySelector("." + classes.marquee),
					children,
					length,
					success = false;

				if (element) {
					children = element.children;
					length = children.length;

					// if element has children, we try to set marquee on elements inside
					if (length) {
						success = setChildren(element, "0");
						// if marquee was not set on any child, we set it on element,
						// but without making copy of element
						if (!success) {
							success = setMarqueeOnElement(element, "0", true);
						}
					} else {
						// if element hasn't got children, the marquee is set on it
						success = setMarqueeOnElement(element, "0");
					}
				}
				return success;
			}

			/**
			 * Remove animation connected with marquee.
			 * @method removeAnimation
			 * @param {HTMLElement} element
			 * @member ns.decorator.marquee
			 * @private
			 * @static
			 */
			function removeAnimation(element) {
				var elementStyle = element.style,
					style;

				// the id of created stylesheet is the same as name of elements' animation
				style = document.getElementById(elementStyle.animationName) ||
					document.getElementById(elementStyle.webkitAnimationName) ||
					document.getElementById(elementStyle.mozAnimationName);

				// remove stylesheet
				if (style) {
					style.parentNode.removeChild(style);
				}
				// remove animation set on element
				domUtils.setPrefixedStyle(element, "animation", "");
			}

			/**
			 * Remove created element.
			 * @method removeCopiedElement
			 * @param {HTMLElement} element
			 * @member ns.decorator.marquee
			 * @private
			 * @static
			 */
			function removeCopiedElement(element) {
				var clone = element.querySelector("." + classes.clone);

				// remove cloned element
				if (clone) {
					element.removeChild(clone);
				}
				// remove set styles on element
				element.classList.remove(classes.marqueeStart);
			}

			/**
			 * Disable marquee on given element.
			 * @method prepareBlurAnimation
			 * @param {Event} event
			 * @member ns.decorator.marquee
			 * @private
			 * @static
			 */
			function prepareBlurAnimation(event) {
				var options = event.detail || {},
					element = options.element,
					marqueeStartElements = element && [].slice.call(element.querySelectorAll("." + classes.marqueeStart)),
					length = marqueeStartElements && marqueeStartElements.length,
					item,
					i;

				// remove style and animation for marquee elements
				for (i = 0; i < length; i++) {
					item = marqueeStartElements[i];
					removeCopiedElement(item);
					removeAnimation(item);
				}
			}

			/**
			 * Enable decorator
			 * @method enable
			 * @member ns.decorator.marquee
			 * @static
			 */
			function enable() {
				if (!status) {
					document.addEventListener("taufocus", prepareFocusAnimation, false);
					document.addEventListener("taublur", prepareBlurAnimation, false);
				}
				status = true;
			}

			/**
			 * Disable decorator
			 * @method enable
			 * @member ns.decorator.marquee
			 * @static
			 */
			function disable() {
				status = false;
				document.removeEventListener("taufocus", prepareFocusAnimation, false);
				document.removeEventListener("taublur", prepareBlurAnimation, false);
			}

			marquee = {
				classes: classes,

				enable: enable,
				disable: disable,
				/**
				 * Return status of decorator
				 * @method isEnabled
				 * @member ns.decorator.marquee
				 * @static
				 */
				isEnabled: function () {
					return status;
				}
			};

			ns.decorator.marquee = marquee;

			enable();

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return marquee;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
