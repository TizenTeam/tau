/* global requestAnimationFrame, define, ns */
/**
 * # JS base scrolling tool
 *
 * This enable fast scrolling on element
 *
 * @class ns.util.scrolling
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util",
			"../event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var eventUtil = ns.event,
				// position when was last touch start
				startPosition = 0,
				// current state of scroll position
				scrollPosition = 0,
				lastScrollPosition = 0,
				moveToPosition = 0,
				lastRenderedPosition = 0,
				lastTime = Date.now(),
				elementStyle = null,
				maxScrollPosition = 0,
				// scrolling element
				scrollingElement = null,
				// cache of previous overflow style to revert after disable
				previousOverflow = "",
				// cache abs function
				abs = Math.abs,
				// inform that is touched
				isTouch = false,
				isScroll = false,
				// direction of scrolling, 0 - mean Y, 1 - mean X
				direction = 0,
				// cache of round function
				round = Math.round;


			/**
			 * Check that current target is inside scrolling element
			 * @param {HTMLElement} target
			 * @return boolean
			 */
			function detectTarget(target) {
				while (target && target !== document) {
					if (target === scrollingElement) {
						return true;
					}
					target = target.parentElement;
				}
				return false;
			}

			/**
			 * Handler for touchstart event
			 * @param {Event} event
			 */
			function touchStart(event) {
				var touches = event.touches,
					touch = touches[0];

				isScroll = detectTarget(event.target);
				// is is only one touch
				if (isScroll && touches.length === 1) {
					// save current touch point
					startPosition = direction ? touch.clientX : touch.clientY;
					// save current time for calculate acceleration on touchend
					lastTime = Date.now();
					// reset acceleration state
					moveToPosition = scrollPosition;
				}
				// clean
				touches = null;
				touch = null;
			}

			/**
			 * Handler for touchmove event
			 * @param event
			 */
			function touchMove(event) {
				var touches = event.touches,
					touch = touches[0],
					// get current position in correct direction
					clientPosition = direction ? touch.clientX : touch.clientY;

				// if touch start was on scrolled element
				if (isScroll) {
					// if is only one touch
					if (touches.length === 1) {
						// calculate difference between touch start and current position
						lastScrollPosition = clientPosition - startPosition;
						// normalize value to be in bound [0, maxScroll]
						if (scrollPosition + lastScrollPosition > 0) {
							lastScrollPosition = -scrollPosition;
						}
						if (scrollPosition + lastScrollPosition < -maxScrollPosition) {
							lastScrollPosition = -maxScrollPosition - scrollPosition;
						}
						// trigger event scroll
						eventUtil.trigger(scrollingElement, "scroll", {scrollTop: -(scrollPosition + lastScrollPosition)});
					}
					// if this is first touch move
					if (!isTouch) {
						// we need start request loop
						isTouch = true;
						requestAnimationFrame(render);
					}
				}
				// clean
				touches = null;
				touch = null;
			}

			/**
			 * Handler for touchend event
			 */
			function touchEnd() {
				var diffTime = Date.now() - lastTime;

				// calculate speed of touch move
				if (abs(lastScrollPosition / diffTime) > 1) {
					// if it was fast move, we start animation of scrolling after touch end
					moveToPosition = round(scrollPosition + 1000 * lastScrollPosition / diffTime);
					requestAnimationFrame(moveTo);
				} else {
					// touch move was slow, just finish render loop
					isTouch = false;
				}
				// update state of scrolling
				scrollPosition += lastScrollPosition;
				// normalize value to be in bound [0, maxScroll]
				if (scrollPosition < -maxScrollPosition) {
					scrollPosition = -maxScrollPosition;
				}
				if (scrollPosition > 0) {
					scrollPosition = 0;
				}
				lastScrollPosition = 0;
				// trigger event scroll
				eventUtil.trigger(scrollingElement, "scroll", {scrollTop: -(scrollPosition)});
				// we stop scrolling
				isScroll = false;
			}

			/**
			 * Loop function to calculate state in animation after touchend
			 */
			function moveTo() {
				// calculate difference between current position and expected scroll end
				var diffPosition = moveToPosition - scrollPosition,
					// get absolute value
					absDiffPosition = abs(diffPosition);
				// if difference is big
				if (absDiffPosition > 10) {
					// we move 10% of difference
					scrollPosition = round(scrollPosition + diffPosition / 10);
					requestAnimationFrame(moveTo);
				} else if (absDiffPosition > 2) {
					// else if is difference < 10 then we move 50%
					scrollPosition = round(scrollPosition + diffPosition / 2);
					requestAnimationFrame(moveTo);
				} else {
					// if difference is <=2 then we move to end value and finish loop
					scrollPosition = moveToPosition;
					isTouch = false;
				}

				// normalize scroll value
				if (scrollPosition < -maxScrollPosition) {
					scrollPosition = -maxScrollPosition;
				}
				if (scrollPosition > 0) {
					scrollPosition = 0;
				}
				// trigger event scroll
				eventUtil.trigger(scrollingElement, "scroll", {scrollTop: -(scrollPosition)});
			}

			/**
			 * Render loop on request animation frame
			 */
			function render() {
				// calculate ne position of scrolling as sum of last scrolling state + move
				var newRenderedPosition = scrollPosition + lastScrollPosition;
				// is position was changed
				if (newRenderedPosition !== lastRenderedPosition) {
					// we update styles
					lastRenderedPosition = newRenderedPosition;
					elementStyle.transform = direction ?
						"translate3D(" + lastRenderedPosition + "px,0,0)" :
						"translate3D(0, " + lastRenderedPosition + "px,0)";
				}
				// if is still touched then we continue loop
				if (elementStyle && isTouch) {
					requestAnimationFrame(render);
				}
			}

			/**
			 * Enable JS scrolling on element
			 * @method enable
			 * @param {HTMLElement} element element for scrolling
			 * @param {"x"|"y"} [setDirection="y"] direction of scrolling
			 * @member ns.util.scrolling
			 */
			function enable(element, setDirection) {
				var parentRectangle = null,
					childElement = element.firstElementChild,
					rectangle = null,
					i = 0,
					childrenLength = element.children.length;

				if (scrollingElement) {
					console.warn("Scrolling exist on another element, first call disable method");
				} else {
					// detect direction
					if (setDirection === "x") {
						direction = 1;
					} else {
						direction = 0;
					}

					// If element has more than one child we creating
					// container to position transform
					if (childrenLength > 1) {
						childElement = document.createElement("div");
						for (; i < childrenLength; ++i) {
							childElement.appendChild(element.firstElementChild);
						}
						element.appendChild(childElement);
					}

					// setting scrolling element
					scrollingElement = element;
					// calculate maxScroll
					parentRectangle = element.getBoundingClientRect();
					rectangle = childElement.getBoundingClientRect();
					if (direction) {
						maxScrollPosition = round(rectangle.width - parentRectangle.width);
					} else {
						maxScrollPosition = round(rectangle.height - parentRectangle.height);
					}
					// cache style element
					elementStyle = childElement.style;

					// init internal variables
					startPosition = 0;
					scrollPosition = 0;
					lastScrollPosition = 0;
					moveToPosition = 0;
					lastRenderedPosition = 0;
					lastTime = Date.now();
					// cache current overflow value to restore in disable
					previousOverflow = window.getComputedStyle(element).getPropertyValue("overflow");
					// set overflow hidden
					element.style.overflow = "hidden";

					// add event listeners
					document.addEventListener("touchstart", touchStart, false);
					document.addEventListener("touchmove", touchMove, false);
					document.addEventListener("touchend", touchEnd, false);

					// clean
					childElement = null;
					parentRectangle = null;
					rectangle = null;
				}
			}

			/**
			 * @method disable
			 * @member ns.util.scrolling
			 */
			function disable() {
				// clear event listeners
				document.removeEventListener("touchstart", touchStart, false);
				document.removeEventListener("touchmove", touchMove, false);
				document.removeEventListener("touchend", touchEnd, false);

				scrollingElement.style.overflow = previousOverflow;

				elementStyle = null;
				scrollingElement = null;
			}

			/**
			 * Scroll to give position
			 * @method scrollTo
			 * @param {number} value
			 * @member ns.util.scrolling
			 */
			function scrollTo(value) {
				scrollPosition = value;
				lastScrollPosition = 0;
				render();
			}

			ns.util.scrolling = {
				enable: enable,
				disable: disable,
				scrollTo: scrollTo,
				/**
				 * Return true is given element is current scrolling element
				 * @method isElement
				 * @param {HTMLElement} element element to check
				 * @returns {boolean}
				 * @member ns.util.scrolling
				 */
				isElement: function(element) {
					return scrollingElement === element;
				},
				/**
				 * Update max scrolling position
				 * @method setMaxScroll
				 * @param maxValue
				 * @member ns.util.scrolling
				 */
				setMaxScroll: function(maxValue) {
					maxScrollPosition = maxValue;
				}
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
