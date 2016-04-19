/* global requestAnimationFrame, define, ns, Math */
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
			"../support/tizen",
			"../util",
			"../util/polar",
			"../event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var eventUtil = ns.event,
				polarUtil = ns.util.polar,
				classes = {
					circular: "scrolling-circular",
					direction: "scrolling-direction",
					scrollbar: "scrolling-scrollbar",
					path: "scrolling-path",
					thumb: "scrolling-scrollthumb",
					fadeIn: "fade-in"
				},
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
				childElement = null,
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
				round = Math.round,
				// cache max function
				max = Math.max,

				// Scrollbar config
				CIRCULAR_SCROLL_BAR_SIZE = 60, // degrees
				MIN_CIRCULAR_SCROLL_THUMB_SIZE = 6,

				// ScrollBar variables
				scrollBar = null,
				scrollThumb = null,
				scrollBarPosition = 0,
				maxScrollBarPosition = 0,
				circularScrollBar = ns.support.shape.circle,
				circularScrollThumbSize = MIN_CIRCULAR_SCROLL_THUMB_SIZE,
				svgScrollBar = null,
				scrollBarTimeout = null;

			/**
			 * Shows scrollbar using fadeIn class and sets timeout to hide it when not used
			 */
			function fadeInScrollBar() {
				if (scrollBar) {
					clearTimeout(scrollBarTimeout);
					scrollBar.classList.add(classes.fadeIn);

					scrollBarTimeout = setTimeout(function () {
						scrollBar.classList.remove(classes.fadeIn);
					}, 2000);
				}
			}

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
						fadeInScrollBar();
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
				fadeInScrollBar();
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
				fadeInScrollBar();
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
					scrollBarPosition = abs(newRenderedPosition) / maxScrollPosition * maxScrollBarPosition;

					elementStyle.transform = direction ?
						"translate3d(" + lastRenderedPosition + "px,0,0)" :
						"translate3d(0, " + lastRenderedPosition + "px,0)";

					if (circularScrollBar) {
						scrollBarPosition = abs(newRenderedPosition) / maxScrollPosition * maxScrollBarPosition;

						polarUtil.updatePosition(svgScrollBar, "." + classes.thumb, {
							arcStart: scrollBarPosition,
							arcEnd: scrollBarPosition + circularScrollThumbSize,
							r: 174 // 1px line space from screen edge
						});
					} else {
						scrollBarPosition = abs(newRenderedPosition) / maxScrollPosition * maxScrollBarPosition;

						if (direction) {
							scrollThumb.style.transform = "translate3d(" + scrollBarPosition + "px,0,0)";
						} else {
							scrollThumb.style.transform = "translate3d(0," + scrollBarPosition + "px,0)";
						}
					}
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
					contentRectangle = null;

				if (scrollingElement) {
					console.warn("Scrolling exist on another element, first call disable method");
				} else {
					// detect direction
					direction = (setDirection === "x") ? 1 : 0;

					// we are creating a container to position transform
					childElement = document.createElement("div");
					// ... and appending all children to it
					while(element.firstElementChild) {
						childElement.appendChild(element.firstElementChild);
					}

					element.appendChild(childElement);

					// setting scrolling element
					scrollingElement = element;
					// calculate maxScroll
					parentRectangle = element.getBoundingClientRect();
					contentRectangle = childElement.getBoundingClientRect();

					// Max scroll position is determined by size of the content - clip window size
					if (direction) {
						maxScrollPosition = round(contentRectangle.width - parentRectangle.width);
					} else {
						maxScrollPosition = round(contentRectangle.height - parentRectangle.height);
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
					parentRectangle = null;
					contentRectangle = null;
				}
			}

			/**
			 * @method disable
			 * @member ns.util.scrolling
			 */
			function disable() {
				disableScrollBar();

				// clear event listeners
				document.removeEventListener("touchstart", touchStart, false);
				document.removeEventListener("touchmove", touchMove, false);
				document.removeEventListener("touchend", touchEnd, false);

				scrollingElement.style.overflow = previousOverflow;

				elementStyle = null;
				scrollingElement = null;
				childElement = null;
				svgScrollBar = null;
			}

			function enableScrollBar() {
				var boundingRect = null,
					childElementRect = null,
					scrollBarStyle = null,
					scrollThumbStyle = null;

				scrollBar = document.createElement("div");
				scrollBarStyle = scrollBar.style;
				scrollBar.classList.add(classes.scrollbar);

				if (circularScrollBar) {
					scrollBar.classList.add(classes.circular);
					svgScrollBar = polarUtil.createSVG();

					// create background
					polarUtil.addArc(svgScrollBar, {
						arcStart: 90 - (CIRCULAR_SCROLL_BAR_SIZE / 2),
						arcEnd: 90 + (CIRCULAR_SCROLL_BAR_SIZE / 2),
						classes: classes.path,
						width: 10,
						r: 174, // 1px line space from screen edge
						linecap: "round"
					});
					// create thumb
					polarUtil.addArc(svgScrollBar, {
						referenceDegree: 90 - (CIRCULAR_SCROLL_BAR_SIZE / 2),
						arcStart: 0,
						arcEnd: circularScrollThumbSize,
						classes: classes.thumb,
						width: 10,
						r: 174, // 1px line space from screen edge
						linecap: "round"
					});

					scrollBar.appendChild(svgScrollBar);
					scrollingElement.parentElement.insertBefore(scrollBar, scrollingElement.nextSibling);

				} else {

					scrollBar.classList.add(classes.direction + "-" + (direction ? "x" : "y"));

					scrollThumb = document.createElement("div");
					scrollThumbStyle = scrollThumb.style;
					scrollThumb.classList.add(classes.thumb);

					boundingRect = scrollingElement.getBoundingClientRect();
					childElementRect = childElement.getBoundingClientRect();

					if (direction) {
						scrollBarStyle.width = boundingRect.width + "px";
						scrollBarStyle.left = boundingRect.left + "px";
						scrollThumbStyle.transform = "translate3d(" + scrollBarPosition + "px,0,0)";
						// Calculate size of the thumb (only useful when enabling after content has size > 0)
						scrollThumbStyle.width = (boundingRect.width / childElementRect.width * boundingRect.width) + "px";
					} else {
						scrollBarStyle.height = boundingRect.height + "px";
						scrollBarStyle.top = boundingRect.top + "px";
						scrollThumbStyle.transform = "translate3d(0," + scrollBarPosition + "px,0)";
						// Calculate size of the thumb (only useful when enabling after content has size > 0)
						scrollThumbStyle.height = (boundingRect.height / childElementRect.height * boundingRect.height) + "px";
					}

					scrollBar.appendChild(scrollThumb);
					scrollingElement.parentElement.insertBefore(scrollBar, scrollingElement.nextSibling);

					// Get max scrollbar position after appending
					if (direction) {
						maxScrollBarPosition = boundingRect.width - scrollThumb.getBoundingClientRect().width;
					} else {
						maxScrollBarPosition = boundingRect.height - scrollThumb.getBoundingClientRect().height;
					}
				}
			}

			function disableScrollBar() {
				if(scrollBar) {
					scrollBar.parentElement.removeChild(scrollBar);
					scrollBar = null;
					scrollThumb = null;
				}
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
				scrollBarPosition = value / maxScrollPosition * maxScrollBarPosition;
				render();
			}

			ns.util.scrolling = {
				enable: enable,
				disable: disable,
				enableScrollBar: enableScrollBar,
				disableScrollBar: disableScrollBar,
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
					var // @TODO can be cached somehow to save operations (should be only refreshed on scrollingElement dimensions change)
						boundingRect = scrollingElement.getBoundingClientRect(),
						directionDimension = direction ? "width" : "height",
						directionSize = boundingRect[directionDimension],
						tempMaxPosition = max(maxValue - directionSize, 0);

					// Change size of thumb only when necessary
					if (tempMaxPosition !== maxScrollPosition && scrollBar) {
						maxScrollPosition = tempMaxPosition;

						if (circularScrollBar) {
							// Calculate new thumb size based on max scrollbar size
							circularScrollThumbSize = max((directionSize / (maxScrollPosition + directionSize)) * CIRCULAR_SCROLL_BAR_SIZE, MIN_CIRCULAR_SCROLL_THUMB_SIZE);
							maxScrollBarPosition = CIRCULAR_SCROLL_BAR_SIZE - circularScrollThumbSize;

							polarUtil.updatePosition(svgScrollBar, "." + classes.thumb, {
								arcStart: scrollBarPosition,
								arcEnd: scrollBarPosition + circularScrollThumbSize,
								r: 174 // 1px line space from screen edge
							});
						} else {
							scrollThumb.style[directionDimension] = (directionSize / (maxScrollPosition + directionSize) * directionSize) + "px";
							// Cannot use direct value from style here because CSS may override the minimum size of thumb here
							maxScrollBarPosition = directionSize - scrollThumb.getBoundingClientRect()[directionDimension];
						}
					}
				}
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
