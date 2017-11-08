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
				bounceBack = false,
				EVENTS = {
					SCROLL_BEFORE_START: "beforeScrollStart",
					SCROLL_START: "scrollStart",
					SCROLL_END: "scrollEnd",
					SCROLL_FLICK: "flick",
					SCROLL: "scroll"
				},
				// 1px line space from screen edge
				RADIUS = 174,
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
				isScrollableTarget = false,
				// direction of scrolling, 0 - mean Y, 1 - mean X
				direction = 0,
				// cache of round function
				round = Math.round,
				// cache max function
				max = Math.max,
				min = Math.min,

				// Circular scrollbar config
				CIRCULAR_SCROLL_BAR_SIZE = 60, // degrees
				CIRCULAR_SCROLL_MIN_THUMB_SIZE = 6,

				// Scrollbar is placed after scrolled element
				// that's why normal css values cannot be applied
				// margin needs to be substracted from position
				SCROLL_MARGIN = 11,

				// ScrollBar variables
				scrollBar = null,
				scrollThumb = null,
				scrollBarPosition = 0,
				maxScrollBarPosition = 0,
				circularScrollBar = ns.support.shape.circle,
				circularScrollThumbSize = CIRCULAR_SCROLL_MIN_THUMB_SIZE,
				svgScrollBar = null,
				scrollBarTimeout = null,
				fromAPI = false,
				virtualMode = false,
				snapSize = null,
				requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

			/**
			 * Shows scrollbar using fadeIn class and sets timeout to hide it when not used
			 */
			function fadeInScrollBar() {
				if (scrollBar) {
					clearTimeout(scrollBarTimeout);
					scrollBar.classList.add(classes.fadeIn);

					scrollBarTimeout = setTimeout(function () {
						if (scrollBar) {
							scrollBar.classList.remove(classes.fadeIn);
						}
					}, 2000);
				}
			}

			/**
			 * Check that current target is inside scrolling element
			 * @param {HTMLElement} target
			 * @return {boolean}
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

				isScrollableTarget = detectTarget(event.target);
				// is is only one touch
				if (isScrollableTarget && touches.length === 1) {
					// save current touch point
					startPosition = direction ? touch.clientX : touch.clientY;
					// save current time for calculate acceleration on touchend
					lastTime = Date.now();
					// reset acceleration state
					moveToPosition = scrollPosition;
					eventUtil.trigger(scrollingElement, EVENTS.SCROLL_BEFORE_START, {
						scrollLeft: direction ? -scrollPosition : 0,
						scrollTop: direction ? 0 : -scrollPosition,
						fromAPI: fromAPI
					});
				}
			}

			/**
			 * Handler for touchmove event
			 * @param {Event} event
			 */
			function touchMove(event) {
				var touches = event.touches,
					touch = touches[0],
					// get current position in correct direction
					clientPosition = direction ? touch.clientX : touch.clientY;

				// if touch start was on scrolled element
				if (isScrollableTarget) {
					// if is only one touch
					if (touches.length === 1) {
						fromAPI = false;
						// calculate difference between touch start and current position
						lastScrollPosition = clientPosition - startPosition;
						if (!bounceBack) {
							// normalize value to be in bound [0, maxScroll]
							if (scrollPosition + lastScrollPosition > 0) {
								lastScrollPosition = -scrollPosition;
							}
							if (scrollPosition + lastScrollPosition < -maxScrollPosition) {
								lastScrollPosition = -maxScrollPosition - scrollPosition;
							}
						}
						// trigger event scroll start if it is the first touch move
						if (!isTouch) {
							eventUtil.trigger(scrollingElement, EVENTS.SCROLL_START, {
								scrollLeft: direction ? -(scrollPosition + lastScrollPosition) : 0,
								scrollTop: direction ? 0 : -(scrollPosition + lastScrollPosition),
								fromAPI: fromAPI
							});
						}

						// trigger event scroll
						eventUtil.trigger(scrollingElement, EVENTS.SCROLL, {
							scrollLeft: direction ? -(scrollPosition + lastScrollPosition) : 0,
							scrollTop: direction ? 0 : -(scrollPosition + lastScrollPosition),
							inBounds: (scrollPosition + lastScrollPosition >= -maxScrollPosition) &&
							(scrollPosition + lastScrollPosition <= 0),
							fromAPI: fromAPI
						});
						fadeInScrollBar();
					}
					// if this is first touch move
					if (!isTouch) {
						// we need start request loop
						isTouch = true;
						requestAnimationFrame(render);
					}
				}
			}

			/**
			 * Handler for touchend event
			 */
			function touchEnd() {
				var diffTime = Date.now() - lastTime,
					inBounds;
				// only if the event touchmove was noticed before

				if (isTouch) {
					// update state of scrolling
					scrollPosition += lastScrollPosition;
					inBounds = (scrollPosition >= -maxScrollPosition) && (scrollPosition <= 0);

					// calculate speed of touch move
					if (inBounds && abs(lastScrollPosition / diffTime) > 1) {
						// if it was fast move, we start animation of scrolling after touch end
						moveToPosition = max(min(round(scrollPosition + 1000 * lastScrollPosition / diffTime),
							0), -maxScrollPosition);
						if (snapSize) {
							moveToPosition = snapSize * round(moveToPosition / snapSize);
						}
						if (abs(lastScrollPosition / diffTime) > 1) {
							eventUtil.trigger(scrollingElement, EVENTS.SCROLL_FLICK, {
								scrollLeft: direction ? -moveToPosition : 0,
								scrollTop: direction ? 0 : -moveToPosition,
								fromAPI: fromAPI
							});
						}
						requestAnimationFrame(moveTo);
					} else {
						if (snapSize) {
							moveToPosition = snapSize * round((scrollPosition + lastScrollPosition) / snapSize);
							requestAnimationFrame(moveTo);
						}
						// touch move was slow, just finish render loop
						isTouch = false;
					}

					if (bounceBack) {
						if (!inBounds) {
							// if it was fast move, we start animation of scrolling after touch end
							if (scrollPosition > 0) {
								moveToPosition = 0;
							} else {
								moveToPosition = -maxScrollPosition;
							}
							requestAnimationFrame(moveTo);
						}
					} else {
						// normalize value to be in bound [0, maxScroll]
						if (scrollPosition < -maxScrollPosition) {
							scrollPosition = -maxScrollPosition;
						}
						if (scrollPosition > 0) {
							scrollPosition = 0;
						}
					}

					lastScrollPosition = 0;
					// trigger event scroll
					eventUtil.trigger(scrollingElement, EVENTS.SCROLL, {
						scrollLeft: direction ? -(scrollPosition) : 0,
						scrollTop: direction ? 0 : -(scrollPosition),
						inBounds: inBounds,
						fromAPI: fromAPI
					});
					eventUtil.trigger(scrollingElement, EVENTS.SCROLL_END, {
						scrollLeft: direction ? -(scrollPosition) : 0,
						scrollTop: direction ? 0 : -(scrollPosition),
						inBounds: inBounds,
						fromAPI: fromAPI
					});
					fadeInScrollBar();
					// we stop scrolling
					isScrollableTarget = false;
				} else {
					if (snapSize) {
						moveToPosition = snapSize * round((scrollPosition + lastScrollPosition) / snapSize);
						requestAnimationFrame(moveTo);
					}
				}
			}

			/**
			 * Handler for rotary event
			 * @param event
			 */
			function rotary(event) {
				var direction = event.detail && event.detail.direction;

				// update position by snapSize
				if (direction === "CW") {
					moveToPosition = scrollPosition - (snapSize || 50);
				} else {
					moveToPosition = scrollPosition + (snapSize || 50);
				}
				if (snapSize) {
					moveToPosition = snapSize * round(moveToPosition / snapSize);
				}
				if (moveToPosition < -maxScrollPosition) {
					moveToPosition = -maxScrollPosition;
				}
				if (moveToPosition > 0) {
					moveToPosition = 0;
				}
				requestAnimationFrame(moveTo);
				requestAnimationFrame(render);
				eventUtil.trigger(scrollingElement, EVENTS.SCROLL_START, {
					scrollLeft: direction ? -(moveToPosition) : 0,
					scrollTop: direction ? 0 : -(moveToPosition),
					fromAPI: false
				});
				event.stopImmediatePropagation();
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
				if (scrollingElement) {
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
					if (!bounceBack) {
						// normalize scroll value
						if (scrollPosition < -maxScrollPosition) {
							scrollPosition = -maxScrollPosition;
						}
						if (scrollPosition > 0) {
							scrollPosition = 0;
						}
					}
					// trigger event scroll
					eventUtil.trigger(scrollingElement, EVENTS.SCROLL, {
						scrollLeft: direction ? -(scrollPosition) : 0,
						scrollTop: direction ? 0 : -(scrollPosition),
						inBounds: (scrollPosition >= -maxScrollPosition) && (scrollPosition <= 0),
						fromAPI: fromAPI
					});
					if (!isTouch) {
						eventUtil.trigger(scrollingElement, EVENTS.SCROLL_END, {
							scrollLeft: direction ? -(scrollPosition) : 0,
							scrollTop: direction ? 0 : -(scrollPosition),
							fromAPI: fromAPI
						});
					}

					fadeInScrollBar();
				}
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
					if (-newRenderedPosition < maxScrollPosition) {
						scrollBarPosition = -newRenderedPosition / maxScrollPosition * maxScrollBarPosition;
					} else {
						scrollBarPosition = maxScrollBarPosition;
					}
					if (scrollBarPosition < 0) {
						scrollBarPosition = 0;
					}

					if (!virtualMode && elementStyle) {
						elementStyle.transform = direction ?
							"translate(" + lastRenderedPosition + "px, 0)" :
							"translate(0, " + lastRenderedPosition + "px)";
					}

					if (circularScrollBar) {
						polarUtil.updatePosition(svgScrollBar, "." + classes.thumb, {
							arcStart: scrollBarPosition,
							arcEnd: scrollBarPosition + circularScrollThumbSize,
							r: RADIUS
						});
					} else {
						if (scrollThumb) {
							if (direction) {
								scrollThumb.style.transform = "translate(" + scrollBarPosition + "px, 0)";
							} else {
								scrollThumb.style.transform = "translate(0, " + scrollBarPosition + "px)";
							}
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
			 * @param {boolean} setVirtualMode if is set to true then send event without scroll element
			 * @member ns.util.scrolling
			 */
			function enable(element, setDirection, setVirtualMode) {
				var parentRectangle,
					contentRectangle;

				virtualMode = setVirtualMode;
				bounceBack = false;
				snapSize = false;

				if (scrollingElement) {
					ns.warn("Scrolling exist on another element, first call disable method");
				} else {
					// detect direction
					direction = (setDirection === "x") ? 1 : 0;

					// we are creating a container to position transform
					childElement = document.createElement("div");
					// ... and appending all children to it
					while (element.firstElementChild) {
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
					scrollBarPosition = 0;
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
					window.addEventListener("rotarydetent", rotary, true);
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
				window.removeEventListener("rotarydetent", rotary, true);

				// after changed page and removed it this element can not exists
				if (scrollingElement) {
					scrollingElement.style.overflow = previousOverflow;
				}

				elementStyle = null;
				scrollingElement = null;
				childElement = null;
				svgScrollBar = null;
			}

			function enableScrollBar() {
				var boundingRect,
					childElementRect,
					scrollBarStyle,
					scrollThumbStyle,
					arcStartPoint = direction ? 0 : 90,
					scrollBarWidth = 0,
					scrollBarHeight = 0;

				scrollBar = document.createElement("div");
				scrollBarStyle = scrollBar.style;
				scrollBar.classList.add(classes.scrollbar);

				if (circularScrollBar) {
					scrollBar.classList.add(classes.circular);
					svgScrollBar = polarUtil.createSVG();

					// create background
					polarUtil.addArc(svgScrollBar, {
						arcStart: arcStartPoint - (CIRCULAR_SCROLL_BAR_SIZE / 2),
						arcEnd: arcStartPoint + (CIRCULAR_SCROLL_BAR_SIZE / 2),
						classes: classes.path,
						width: 10,
						r: RADIUS,
						linecap: "round"
					});
					// create thumb
					polarUtil.addArc(svgScrollBar, {
						referenceDegree: arcStartPoint - (CIRCULAR_SCROLL_BAR_SIZE / 2),
						arcStart: 0,
						arcEnd: circularScrollThumbSize,
						classes: classes.thumb,
						width: 10,
						r: RADIUS,
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
						scrollBarWidth = (boundingRect.width - (2 * SCROLL_MARGIN));

						scrollBarStyle.width = scrollBarWidth + "px";
						scrollBarStyle.left = (boundingRect.left + SCROLL_MARGIN) + "px";
						scrollThumbStyle.transform = "translate3d(" + scrollBarPosition + "px,0,0)";
						// Calculate size of the thumb (only useful when enabling after content has size > 0)
						scrollThumbStyle.width = (scrollBarWidth / childElementRect.width * scrollBarWidth) + "px";
					} else {
						scrollBarHeight = (boundingRect.height - (2 * SCROLL_MARGIN));

						scrollBarStyle.height = scrollBarHeight + "px";
						scrollBarStyle.top = (boundingRect.top + SCROLL_MARGIN) + "px";
						scrollThumbStyle.transform = "translate3d(0," + scrollBarPosition + "px,0)";
						// Calculate size of the thumb (only useful when enabling after content has size > 0)
						scrollThumbStyle.height = (scrollBarHeight / childElementRect.height * scrollBarHeight) + "px";
					}

					scrollBar.appendChild(scrollThumb);
					scrollingElement.parentElement.insertBefore(scrollBar, scrollingElement.nextSibling);

					// Get max scrollbar position after appending
					if (direction) {
						maxScrollBarPosition = scrollBarWidth - scrollThumb.getBoundingClientRect().width;
					} else {
						maxScrollBarPosition = scrollBarHeight - scrollThumb.getBoundingClientRect().height;
					}
				}
			}

			function disableScrollBar() {
				if (scrollBar) {
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
				moveToPosition = value;
				fromAPI = true;
				eventUtil.trigger(scrollingElement, EVENTS.SCROLL_BEFORE_START, {
					scrollLeft: direction ? -scrollPosition : 0,
					scrollTop: direction ? 0 : -scrollPosition,
					fromAPI: fromAPI
				});
				requestAnimationFrame(moveTo);
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
				 * @return {boolean}
				 * @member ns.util.scrolling
				 */
				isElement: function (element) {
					return scrollingElement === element;
				},

				/**
				 * Update max scrolling position
				 * @method setMaxScroll
				 * @param {number} maxValue
				 * @member ns.util.scrolling
				 */
				setMaxScroll: function (maxValue) {
					var boundingRect = scrollingElement.getBoundingClientRect(),
						directionDimension = direction ? "width" : "height",
						directionSize = boundingRect[directionDimension],
						tempMaxPosition = max(maxValue - directionSize, 0);

					// Change size of thumb only when necessary
					if (tempMaxPosition !== maxScrollPosition) {
						maxScrollPosition = tempMaxPosition || Number.POSITIVE_INFINITY;
						if (scrollBar) {
							if (circularScrollBar) {
								// Calculate new thumb size based on max scrollbar size
								circularScrollThumbSize = max((directionSize / (maxScrollPosition + directionSize)) * CIRCULAR_SCROLL_BAR_SIZE, CIRCULAR_SCROLL_MIN_THUMB_SIZE);
								maxScrollBarPosition = CIRCULAR_SCROLL_BAR_SIZE - circularScrollThumbSize;
								polarUtil.updatePosition(svgScrollBar, "." + classes.thumb, {
									arcStart: scrollBarPosition,
									arcEnd: scrollBarPosition + circularScrollThumbSize,
									r: RADIUS
								});
							} else {
								directionSize -= 2 * SCROLL_MARGIN;
								scrollThumb.style[directionDimension] = (directionSize / (maxScrollPosition + directionSize) * directionSize) + "px";
								// Cannot use direct value from style here because CSS may override the minimum size of thumb here
								maxScrollBarPosition = directionSize - scrollThumb.getBoundingClientRect()[directionDimension];
							}
						}
					}
				},
				setSnapSize: function (setSnapSize) {
					snapSize = setSnapSize;
					if (snapSize) {
						maxScrollPosition = snapSize * round(maxScrollPosition / snapSize);
					}
				},
				setBounceBack: function (setBounceBack) {
					bounceBack = setBounceBack;
				}
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
