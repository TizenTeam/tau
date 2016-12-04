/*global window, define, ns */
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
 * #Anchor Highlight Utility
 *
 * Utility enables highlight on clickable components.
 * @class ns.util.anchorHighlight
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 * @author Konrad Lipner <k.lipner@samsung.com>
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./selectors"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/* anchorHighlightController.js
			 To prevent perfomance regression when scrolling,
			 do not apply hover class in anchor.
			 Instead, this code checks scrolling for time threshold and
			 decide how to handle the color.
			 When scrolling with anchor, it checks flag and decide to highlight anchor.
			 While it helps to improve scroll performance,
			 it lowers responsiveness of the element for 50msec.
			 */

			/**
			 * Touch start x
			 * @property {number} startX
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			var startX = 0,
				/**
				 * Touch start y
				 * @property {number} startY
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				startY = 0,
				/**
				 * Did page scrolled
				 * @property {boolean} didScroll
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				didScroll = false,
				/**
				 * Touch button target element
				 * @property {HTMLElement} buttonTarget
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				buttonTarget = null,
				/**
				 * Touch target element
				 * @property {HTMLElement} target
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				target = null,
				/**
				 * Object with default options
				 * @property {Object} options
				 * Treshold after which didScroll will be set
				 * @property {number} [options.scrollThreshold=10]
				 * Time to wait before adding activeClass
				 * @property {number} [options.addActiveClassDelay=50]
				 * Time to stay activeClass after touch end
				 * @property {number} [options.keepActiveClassDelay=100]
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				options = {
					scrollThreshold: 10,
					addActiveClassDelay: 50,
					keepActiveClassDelay: 100
				},
				classes = {
					/**
					 * Class used to mark element as active
					 * @property {string} [classes.ACTIVE_LI="ui-li-active"]
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					ACTIVE_LI: "ui-li-active",
					/**
					 * Class used to mark button as active
					 * @property {string} [classes.ACTIVE_BTN="ui-btn-active"]
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					ACTIVE_BTN: "ui-btn-active",
					/**
					 * Class used to mark button as inactive
					 * @property {string} [classes.INACTIVE_BTN="ui-btn-inactive"]
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					INACTIVE_BTN: "ui-btn-inactive",
					/**
					 * Class used to select button
					 * @property {string} [classes.BUTTON="ui-btn"] btn
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					BUTTON: "ui-btn",
					/**
					 * Class used to select button in header (old notation)
					 * @property {string} [classes.HEADER_BUTTON="ui-header-btn"] btn
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					HEADER_BUTTON: "ui-header-btn",
					/**
					 * Class used to select anchor in tabbar widget
					 * @property {string} [classes.TABBAR_ANCHOR="ui-tabbar-anchor"] anchor
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					TABBAR_ANCHOR: "ui-tabbar-anchor",
					/**
					 * Class used to select navigation item
					 * @property {string} [classes.NAVIGATION_BUTTON="ui-navigation-item"] btn
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					NAVIGATION_BUTTON: "ui-navigation-item"
				},
				/**
				 * Alias for class {@link ns.util.selectors}
				 * @property {Object} selectors
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				// cache function
				requestAnimationFrame = ns.util.requestAnimationFrame,
				// cache function
				abs = Math.abs,
				startTime = 0,
				startRemoveTime = 0,
				// inform that touch was ended
				touchEnd = false,
				// inform that animation of button's activation was ended
				activeAnimationFinished = false,
				// cache function
				slice = Array.prototype.slice;


			/**
			 * Get closest highlightable element
			 * @method detectHighlightTarget
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function detectHighlightTarget(target) {
				return selectors.getClosestBySelector(target, "a, label");
			}

			/**
			 * Get closest li element
			 * @method detectLiElement
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function detectLiElement(target) {
				return selectors.getClosestByTag(target, "li");
			}

			/**
			 * Get closest button element
			 * @method detectLiElement
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function detectBtnElement(target) {
				return selectors.getClosestByClass(target, classes.BUTTON) ||
					selectors.getClosestByClass(target, classes.HEADER_BUTTON) ||
					selectors.getClosestByClass(target, classes.NAVIGATION_BUTTON) ||
					selectors.getClosestByClass(target, classes.TABBAR_ANCHOR);
			}

			/**
			 * Clear active class on button
			 * @method clearBtnActiveClass
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function clearBtnActiveClass(event) {
				var target = event.target,
					classList = target.classList;
				// if this is callback of activate animation and

				if (classList.contains(classes.ACTIVE_BTN) && !classList.contains(classes.INACTIVE_BTN)) {
					// set that animation was ended (used in touch end)
					activeAnimationFinished = true;

					// if touch end previously
					if (touchEnd || target !== buttonTarget) {
						// start inactivate animation
						classList.add(classes.INACTIVE_BTN);
					}
				} else {
					// this is callback for inactive animation end
					classList.remove(classes.INACTIVE_BTN);
					classList.remove(classes.ACTIVE_BTN);
				}
			}

			/**
			 * Add inactive class on touch end
			 * @method addButtonInactiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function addButtonInactiveClass() {
				if (buttonTarget) {
					buttonTarget.classList.add(classes.INACTIVE_BTN);
				}
			}

			/**
			 * Add active class on touch end
			 * @method addButtonActiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function addButtonActiveClass() {
				buttonTarget.classList.add(classes.ACTIVE_BTN);
				activeAnimationFinished = false;
			}

			/**
			 * Clear classes on page or popup hide
			 * @method hideClear
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function hideClear() {
				if (buttonTarget) {
					buttonTarget.classList.remove(classes.ACTIVE_BTN);
					buttonTarget.classList.remove(classes.INACTIVE_BTN);
				}
				if (target) {
					target.classList.remove(classes.ACTIVE_LI);
				}
			}

			/**
			 * Add active class to touched element
			 * @method addActiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function addActiveClass() {
				var liTarget = null,
					btnTargetClassList = null,
					dTime = 0;

				if (startTime) {
					dTime = Date.now() - startTime;

					if (dTime > options.addActiveClassDelay) {
						startTime = 0;
						buttonTarget = detectBtnElement(target);
						target = detectHighlightTarget(target);
						if (!didScroll) {
							liTarget = detectLiElement(target);
							if (liTarget) {
								liTarget.classList.add(classes.ACTIVE_LI);
							}
							liTarget = null;
							if (buttonTarget) {
								btnTargetClassList = buttonTarget.classList;
								btnTargetClassList.remove(classes.ACTIVE_BTN);
								btnTargetClassList.remove(classes.INACTIVE_BTN);
								requestAnimationFrame(addButtonActiveClass);
							}
						}
					} else {
						requestAnimationFrame(addActiveClass);
					}
				}
			}

			/**
			 * Get all active elements
			 * @method getActiveElements
			 * @return {Array}
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function getActiveElements() {
				return slice.call(document.getElementsByClassName(classes.ACTIVE_LI));
			}

			/**
			 * Remove active class from current active objects
			 * @method clearActiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function clearActiveClass() {
				var activeA = getActiveElements(),
					activeALength = activeA.length,
					i = 0;

				for (; i < activeALength; i++) {
					activeA[i].classList.remove(classes.ACTIVE_LI);
				}
				activeA = null;
			}

			/**
			 * Remove active class from active elements
			 * @method removeActiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function removeActiveClassLoop() {
				var dTime = Date.now() - startRemoveTime;

				if (dTime > options.keepActiveClassDelay) {
					// after touchend
					clearActiveClass();
				} else {
					requestAnimationFrame(removeActiveClassLoop);
				}
			}

			/**
			 * Function invoked during touch move
			 * @method touchmoveHandler
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function touchmoveHandler(event) {
				var touch = event.touches[0],
					scrollThreshold = options.scrollThreshold;

				// if move looks like scroll
				if (!didScroll &&
					// if move is bigger then threshold
					(abs(touch.clientX - startX) > scrollThreshold || abs(touch.clientY - startY) > scrollThreshold)) {
					startTime = 0;
					// we clear active classes
					requestAnimationFrame(clearActiveClass);
					didScroll = true;
				}
				touch = null;
			}

			/**
			 * Function invoked after touch start
			 * @method touchstartHandler
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function touchstartHandler(event) {
				var touches = event.touches,
					touch = null;

				if (touches.length === 1) {
					touch = touches[0];
					didScroll = false;
					startX = touch.clientX;
					startY = touch.clientY;
					target = event.target;
					startTime = Date.now();
					startRemoveTime = 0;
					requestAnimationFrame(addActiveClass);
					touch = null;
					touchEnd = false;
				}
				touches = null;
			}


			/**
			 * Function invoked after touch
			 * @method touchendHandler
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function touchendHandler(event) {
				startRemoveTime = event.timeStamp;

				if (event.touches.length === 0) {
					if (!didScroll) {
						startTime = 0;
						requestAnimationFrame(removeActiveClassLoop);
					}
					// if we finished activate animation then start inactive animation
					if (activeAnimationFinished) {
						requestAnimationFrame(addButtonInactiveClass);
					}
					didScroll = false;
					touchEnd = true;
				}
			}

			/**
			 * Function invoked after visibilitychange event
			 * @method checkPageVisibility
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function checkPageVisibility() {
				if (document.visibilityState === "hidden") {
					removeActiveClassLoop();
				}
			}

			/**
			 * Bind events to document
			 * @method enable
			 * @member ns.util.anchorHighlight
			 * @static
			 */
			function enable() {
				document.addEventListener("touchstart", touchstartHandler, false);
				document.addEventListener("touchend", touchendHandler, false);
				document.addEventListener("touchmove", touchmoveHandler, false);

				document.addEventListener("visibilitychange", checkPageVisibility, false);
				document.addEventListener("pagehide", hideClear, false);
				document.addEventListener("popuphide", hideClear, false);
				document.addEventListener("animationend", clearBtnActiveClass, false);
				document.addEventListener("animationEnd", clearBtnActiveClass, false);
				document.addEventListener("webkitAnimationEnd", clearBtnActiveClass, false);
			}

			/**
			 * Unbinds events from document.
			 * @method disable
			 * @member ns.util.anchorHighlight
			 * @static
			 */
			function disable() {
				document.removeEventListener("touchstart", touchstartHandler, false);
				document.removeEventListener("touchend", touchendHandler, false);
				document.removeEventListener("touchmove", touchmoveHandler, false);

				document.removeEventListener("visibilitychange", checkPageVisibility, false);
				document.removeEventListener("pagehide", hideClear, false);
				document.removeEventListener("popuphide", hideClear, false);
				document.removeEventListener("animationend", clearBtnActiveClass, false);
				document.removeEventListener("animationEnd", clearBtnActiveClass, false);
				document.removeEventListener("webkitAnimationEnd", clearBtnActiveClass, false);
			}

			enable();

			ns.util.anchorHighlight = {
				enable: enable,
				disable: disable
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
