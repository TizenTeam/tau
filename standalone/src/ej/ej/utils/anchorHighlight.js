/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
define(
	[],
	function (document, window) {
		'use strict';
		//>>excludeEnd("ejBuildExclude");
		(function () {
			/* anchorHighlightController.js
			To prevent perfomance regression when scrolling,
			do not apply hover class in anchor.
			Instead, this code checks scrolling for time threshold and
			decide how to handle the color.
			When scrolling with anchor, it checks flag and decide to highlight anchor.
			While it helps to improve scroll performance,
			it lowers responsiveness of the element for 50msec.
			*/
			var startX,
				startY,
				didScroll,
				target,
				touchLength,
				addActiveClassTimerID,
				options = {
					scrollThreshold: 5,
					addActiveClassDelay: 10,	// wait before adding activeClass
					keepActiveClassDelay: 100	// stay activeClass after touchend
				},
				activeClassLI = "ui-li-active",
				removeTouchMove;


			function detectHighlightTarget(target) {
				while (target && target.tagName !== "A" && target && target.tagName !== "LABEL") {
					target = target.parentNode;
				}
				return target;
			}

			function detectLiElement(target) {
				while (target && target.tagName !== "LI") {
					target = target.parentNode;
				}
				return target;
			}

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

			function getActiveElements() {
				return document.getElementsByClassName(activeClassLI);
			}

			function removeActiveClass() {
				var activeA = getActiveElements(),
					activeALength = activeA.length,
					i;
				for (i = 0; i < activeALength; i++) {
					activeA[i].classList.remove(activeClassLI);
				}
			}

			function touchmoveHandler(event) {
				var touch = event.touches[0];
				didScroll = didScroll ||
					(Math.abs(touch.clientX - startX) > options.scrollThreshold || Math.abs(touch.clientY - startY) > options.scrollThreshold);

				if (didScroll) {
					removeTouchMove();
					removeActiveClass();
				}
			}

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

			function eventBinding() {
				document.addEventListener("touchstart", touchstartHandler, false);
				document.addEventListener("touchend", touchendHandler, false);
				window.addEventListener("pagehide", removeActiveClass, false);
			}

			if (document.readyState === "complete") {
				eventBinding();
			} else {
				window.addEventListener("load", eventBinding);
			}
		}(document, window));
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	}
);
//>>excludeEnd("ejBuildExclude");
