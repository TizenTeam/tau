/*global window, define, ns */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * Utility enable highlight links.
 * @class ns.utils.anchorHighlight
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, window, ns) {
	'use strict';
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"./selectors"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
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
			 * @property {number} startX Touch start x
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			var startX,
				/**
				 * @property {number} startY Touch start y
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				startY,
				/**
				 * @property {boolean} didScroll Did page scrolled
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				didScroll,
				/**
				 * @property {HTMLElement} target Touch target element
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				target,
				/**
				 * @property {number} touchLength Length of touch
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				touchLength,
				/**
				 * @property {number} addActiveClassTimerID Timer id of adding activeClass delay
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				addActiveClassTimerID,
				/**
				 * @property {Object} options Object with default options
				 * @property {number} [options.scrollThreshold=5] Treshold after which didScroll will be set
				 * @property {number} [options.addActiveClassDelay=10] Time to wait before adding activeClass
				 * @property {number} [options.keepActiveClassDelay=100] Time to stay activeClass after touch end
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				options = {
					scrollThreshold: 5,
					addActiveClassDelay: 10,
					keepActiveClassDelay: 100
				},
				/**
				 * @property {string} [activeClassLI='ui-li-active'] Class used to mark element as active
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				activeClassLI = "ui-li-active",
				/**
				 * Function invoked after touch move ends
				 * @method removeTouchMove
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				removeTouchMove,
				/**
				 * @property {Object} selectors Alias for class {@link ns.utils.selectors}
				 * @memberOf ns.utils.anchorHighlight
				 * @private
				 * @static
				 */
				selectors = ns.utils.selectors;


			/**
			 * Get closest highlightable element
			 * @method detectHighlightTarget
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function detectHighlightTarget(target) {
				target = selectors.getClosestBySelector(target, 'a, label');
				return target;
			}

			/**
			 * Get closest li element
			 * @method detectLiElement
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function detectLiElement(target) {
				target = selectors.getClosestByTag(target, 'li');
				return target;
			}

			/**
			 * Add active class to touched element
			 * @method addActiveClass
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function addActiveClass() {
				var liTarget;
				target = detectHighlightTarget(target);
				if (!didScroll && target && (target.tagName === "A" || target.tagName === "LABEL")) {
					liTarget = detectLiElement(target);
					if( liTarget ) {
						liTarget.classList.add(activeClassLI);
					}
				}
			}

			/**
			 * Get all active elements
			 * @method getActiveElements
			 * @return {Array}
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function getActiveElements() {
				return document.getElementsByClassName(activeClassLI);
			}

			/**
			 * Remove active class from active elements
			 * @method removeActiveClass
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function removeActiveClass() {
				var activeA = getActiveElements(),
					activeALength = activeA.length,
					i;
				for (i = 0; i < activeALength; i++) {
					activeA[i].classList.remove(activeClassLI);
				}
			}

			/**
			 * Function invoked during touch move
			 * @method touchmoveHandler
			 * @param {Event} event
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function touchmoveHandler(event) {
				var touch = event.touches[0];
				didScroll = didScroll ||
					(Math.abs(touch.clientX - startX) > options.scrollThreshold || Math.abs(touch.clientY - startY) > options.scrollThreshold);

				if (didScroll) {
					removeTouchMove();
					removeActiveClass();
				}
			}

			/**
			 * Function invoked after touch start
			 * @method touchstartHandler
			 * @param {Event} event
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function touchstartHandler(event) {
				var touches = event.touches,
					touch = touches[0];
				touchLength = touches.length;

				if (touchLength === 1) {
					didScroll = false;
					startX = touch.clientX;
					startY = touch.clientY;
					target = event.target;

					document.addEventListener("touchmove", touchmoveHandler, false);
					clearTimeout(addActiveClassTimerID);
					addActiveClassTimerID = setTimeout(addActiveClass, options.addActiveClassDelay);
				}
			}

			removeTouchMove = function () {
				document.removeEventListener("touchmove", touchmoveHandler, false);
			};

			/**
			 * Function invoked after touch
			 * @method touchendHandler
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function touchendHandler() {
				if (touchLength === 1) {
					clearTimeout(addActiveClassTimerID);
					addActiveClassTimerID = null;
					if (!didScroll) {
						setTimeout(removeActiveClass, options.keepActiveClassDelay);
					}
					didScroll = false;
				}
			}

			/**
			 * Bind events to document
			 * @method eventBinding
			 * @memberOf ns.utils.anchorHighlight
			 * @private
			 * @static
			 */
			function eventBinding() {
				document.addEventListener("touchstart", touchstartHandler, false);
				document.addEventListener("touchend", touchendHandler, false);
				window.addEventListener("pagehide", removeActiveClass, false);
			}

			eventBinding();

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(document, window, ns));