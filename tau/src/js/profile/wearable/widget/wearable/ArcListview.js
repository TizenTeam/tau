/*global window, define, ns, Math*/
/*jslint nomen: true, plusplus: true */
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
 *
 */
/**
 * #ArcListview Widget
 *
 * @class ns.widget.wearable.ArcListview
 * @since 3.0
 * @extends ns.widget.wearable.Listview
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/array",
			"./Listview",
			"../../../../core/widget/core/Page",
			"../wearable" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var nsWidget = ns.widget,
				Listview = nsWidget.wearable.Listview,
				Page = nsWidget.core.Page,

				// consts
				ELLIPSIS_A = 180,
				ELLIPSIS_B = 180, // VI: 333
				SCREEN_HEIGHT = 360,
				SCROLL_DURATION = 400, // VI: 400
				MAX_SCROLL_DURATION = 2000,
				MOMENTUM_VALUE = 50,
				MOMENTUM_MAX_VALUE = 5000,
				TOUCH_MOVE_TIME_THRESHOLD = 140, //ms
				TOUCH_MOVE_Y_THRESHOLD = 10, //px

				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias for class {@link ns.util}
				 * @property {Object} util
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				util = ns.util,
				/**
				 * Alias for class {@link ns.util.selectors}
				 * @property {Object} selectorsUtil
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				selectorsUtil = util.selectors,
				/**
				 * Alias for class {@link ns.util.easing.easeOutQuad}
				 * @property {Object} timingFunction
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				timingFunction = util.easing.easeOutQuad,
				/**
				 * Alias for class {@link ns.util.requestAnimationFrame}
				 * @property {Object} requestAnimationFrame
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				requestAnimationFrame = util.requestAnimationFrame,
				/**
				 * Alias for class {@link ns.util.cancelAnimationFrame}
				 * @property {Object} cancelAnimationFrame
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				cancelAnimationFrame = util.cancelAnimationFrame,
				/**
				 * Alias for method {@link Math.round}
				 * @property {Function} round
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				round = Math.round,
				/**
				 * Alias for method {@link Math.min}
				 * @property {Function} min
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				min = Math.min,
				/**
				 * Alias for method {@link Math.max}
				 * @property {Function} max
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				max = Math.max,
				/**
				 * Alias for method {@link Math.sqrt}
				 * @property {Function} sqrt
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				sqrt = Math.sqrt,
				/**
				 * Alias for method {@link Math.abs}
				 * @property {Function} sqrt
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				abs = Math.abs,
				/**
				 * Alias for method {@link ns.util.array}
				 * @property {Object} arrayUtil
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				arrayUtil = ns.util.array,
				/**
				 * Alias for class ArcListview
				 * @method ArcListview
				 * @memberof ns.widget.wearable.ArcListview
				 * @private
				 * @static
				 */
				ArcListview = function () {
					var self = this;

					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {number} [options.ellipsisA] a parameter of ellipsis equation
					 * @property {number} [options.ellipsisB] b parameter of ellipsis equation
					 * @property {number} [options.selectedIndex=0] index current selected item begins from 0
					 * @memberof ns.widget.wearable.ArcListview
					 */
					self.options = {
						// selected index
						selectedIndex: 0,
						ellipsisA: ELLIPSIS_A,
						ellipsisB: ELLIPSIS_B
					};
					// items table on start is empty
					self._items = [];
					// the end of scroll animation
					self._scrollAnimationEnd = true;
					// carousel of five elements
					self._carousel = {
						items: []
					};
					/**
					 * Object with state of scroll animation
					 * @property {Object} _state
					 * @property {number} _state.startTime time of scroll animation start
					 * @property {number} _state.duration duration time of scroll animation
					 * @property {number} _state.progress current progress of scroll animation
					 * @property {Object} _state.scroll scroll state and animation objectives
					 * @property {number} _state.currentIndex current index of selected item
					 * @property {number} _state.toIndex item index as target for scroll end
					 * @property {Array} _state.items array of animated items
					 * @memberof ns.widget.wearable.ArcListview
					 * @protected
					 */
					self._state = {
						startTime: Date.now(),
						duration: 0,
						progress: 0,
						scroll: {
							current: 0,
							from: null,
							to: null
						},
						currentIndex: 0,
						toIndex: 0,
						items: []
					};
					/**
					 * Cache for widget UI HTMLElements
					 * @property {Object} _ui
					 * @property {HTMLElement} _ui.selection element for indication of current selected item
					 * @memberof ns.widget.wearable.ArcListview
					 * @protected
					 */
					self._ui = {
						selection: null,
						scroller: null
					};
				},

				WIDGET_CLASS = "ui-arc-listview",
				/**
				 * CSS Classes using in widget
				 */
				classes = {
					WIDGET: WIDGET_CLASS,
					SELECTION: WIDGET_CLASS + "-selection",
					SELECTION_SHOW: WIDGET_CLASS + "-selection-show",
					CAROUSEL: WIDGET_CLASS + "-carousel",
					CAROUSEL_ITEM: WIDGET_CLASS + "-carousel-item",
					GROUP_INDEX: "ui-li-group-index",
					FORCE_RELATIVE: "ui-force-relative-li-children"
				},
				events = {
					CHANGE: "change"
				},
				selectors = {
					PAGE: "." + Page.classes.uiPage,
					SCROLLER: ".ui-scroller",
					ITEMS: "." + WIDGET_CLASS + " > li",
					SELECTION: "." + WIDGET_CLASS + "-selection"
				},

				prototype = new Listview(),

				didScroll = false,
				averageVelocity = 0,
				momentum = 0,
				startTouchTime = 0,
				lastTouchTime = 0,
				factorsX = [],
				factorsY = [],

				animationHandle = null,

				lastTouchY = 0,
				deltaTouchY = 0,
				deltaSumTouchY = 0;

			function createItem() {
				return {
					element: null,
					id: 0,
					y: 0,
					rect: null,
					current: {
						scale: 1
					},
					from: null,
					to: null,
					repaint: false
				};
			}

			/**
			 * Pre calculation of factors for Y axis
			 * @param {number} a factor X axis for ellipsis (see VI guide)
			 * @param {number} b factor Y axis for ellipsis (see VI guide)
			 * @memberof ns.widget.wearable.ArcListview
			 * @private
			 */
			function calcFactors(a, b) {
				var i = 0;

				for (; i <= a; i++) {
					factorsY[i] = sqrt(b * b * (1 - i * i / a / a)) / b;
				}
				for (i = 0; i <= b; i++) {
					factorsX[i] = sqrt(a * a * (1 - i * i / b / b)) / a;
				}
			}

			prototype._setAnimatedItems = function () {
				var self = this,
					items = self._items,
					from = 0,
					to = items.length,
					i = 0,
					id = 0,
					element = items[0],
					item = null,
					rect = null,
					parentRect = null,
					diffY = null,
					scroller = self._ui.scroller,
					state = self._state,
					parentElement = element.parentElement,
					parentClassList = parentElement.classList,
					style = null,
					parentStyle = null;


				// set parent size
				parentRect = parentElement.getBoundingClientRect();
				parentStyle = parentElement.style;
				parentStyle.height = parentRect.height + "px";
				parentStyle.position = "relative";

				parentClassList.add(classes.FORCE_RELATIVE);

				// add items to state
				for (i = from; i < to; i++) {
					if (i >= 0) {
						if (!state.items[i]) {
							element = items[i];
							if (element !== undefined) {
								rect = element.getBoundingClientRect();
								style = element.style;
								if (element.classList.contains(classes.GROUP_INDEX)) {
									style.top = round(rect.top - parentRect.top + scroller.scrollTop) + "px";
									style.width = rect.width + "px";
								} else {
									item = createItem();
									item.element = element;
									item.y = round(rect.top + rect.height / 2 + scroller.scrollTop);
									item.height = rect.height;
									item.rect = rect;
									item.id = id++;

									if (diffY === null) {
										diffY = rect.top - parentRect.top;
									}

									style.top = (diffY + item.y - SCREEN_HEIGHT / 2) + "px";
									style.width = item.rect.width + "px";

									state.items.push(item);
								}
								style.position = "absolute";
							}
						}
					}
				}

				parentClassList.remove(classes.FORCE_RELATIVE);
			};


			prototype._updateScale = function (currentScroll) {
				var self = this,
					i = 0,
					state = self._state,
					items = state.items,
					len = items.length,
					item = null,
					toScale = 0;

				for (i = 0; i < len; i++) {
					item = items[i];
					if (item !== null) {
						toScale = self._getScaleByY(item.y - SCREEN_HEIGHT / 2 - currentScroll);
						if (item.current.scale !== toScale) {
							if (item.from === null) {
								item.from = {};
							}
							item.from.scale = item.current.scale;

							if (item.to === null) {
								item.to = {};
							}
							item.to.scale = toScale;
						} else {
							item.to = null;
						}
					}
				}
			};

			function calcItem(item) {
				if (item !== null) {
					if (item.to !== null) {
						item.current.scale = item.to.scale;
						item.repaint = true;
					}
				}
			}

			prototype._calc = function () {
				var self = this,
					state = self._state,
					currentTime = Date.now(),
					startTime = state.startTime,
					deltaTime = currentTime - startTime,
					scroll = state.scroll;

				if (deltaTime >= state.duration) {
					self._scrollAnimationEnd = true;
					deltaTime = state.duration;
				}

				state.progress = (state.duration !== 0) ? deltaTime / state.duration : 1;

				// scroll
				if (scroll.to !== null) {
					scroll.current = timingFunction(
						state.progress,
						scroll.from,
						scroll.to - scroll.from,
						1
					);
					if (self._scrollAnimationEnd) {
						self.trigger(events.CHANGE, {
							"selected": state.currentIndex
						});
						state.toIndex = state.currentIndex;

						scroll.to = null;
						scroll.from = null;
					}
				}
				self._updateScale(-1 * scroll.current);

				// calculate items
				arrayUtil.forEach(state.items, calcItem);
			};

			prototype._drawItem = function (item, index) {
				var self = this,
					state = self._state,
					carousel = self._carousel,
					itemElement = null,
					itemStyle = null;

				if (item !== null) {
					itemElement = item.element;
					if (item.repaint) {
						itemStyle = itemElement.style;
						itemStyle.top = 0;
						if (index - state.currentIndex < 3 && index - state.currentIndex > -3) {
							carousel.items[index - state.currentIndex + 2].carouselElement.appendChild(item.element);
						}

						itemStyle.webkitTransform = "scale(" + item.current.scale + ")";
						itemStyle.opacity = item.current.scale;
						item.repaint = false;
					} else {
						if (itemElement.parentNode !== null && item.current.scale === 0) {
							itemElement.parentNode.removeChild(itemElement);
						}
					}
				}
			};

			prototype._draw = function () {
				var self = this,
					state = self._state,
					items = state.items,
					length = items.length,
					i = 0;

				// draw items
				for (i = 0; i < length; i++) {
					self._drawItem(items[i], i);
				}
				self._carouselUpdate(state.currentIndex);

				// scroller update
				self._ui.scroller.scrollTop = -1 * state.scroll.current;
			};

			prototype._carouselUpdate = function (currentIndex) {
				var self = this,
					carousel = self._carousel,
					state = self._state,
					item = null,
					len = 0,
					i = 0;

				for (i = -2, len = 2; i <= len; i++) {
					item = state.items[currentIndex + i];
					if (item !== undefined) {
						carousel.items[i + 2].carouselElement.style.top = (state.scroll.current + item.y - item.height / 2) + "px";
					} else {
						carousel.items[i + 2].carouselElement.style.top = 0;
					}
				}
			};

			prototype._render = function () {
				var self = this,
					state = self._state;

				self._calc();
				self._draw();

				if (!self._scrollAnimationEnd) {
					state.currentIndex = self._findItemIndexByY(-1 * (state.scroll.current - SCREEN_HEIGHT / 2 + 1));
					cancelAnimationFrame(animationHandle);
					animationHandle = requestAnimationFrame(self._render.bind(self));
				}
			};

			// find closer item for given "y" position
			prototype._findItemIndexByY = function (y) {
				var items = this._state.items,
					len = items.length,
					minY = items[0].y,
					maxY = items[len - 1].y,
					prev = 0,
					current = 0,
					next = 0,
					loop = true,
					tempIndex = round((y - minY) / (maxY - minY) * len);

				tempIndex = min(len - 1, max(0, tempIndex));

				while (loop) {
					prev = abs((items[tempIndex - 1]) ? y - items[tempIndex - 1].y : Infinity);
					current = abs(y - items[tempIndex].y);
					next = abs((items[tempIndex + 1]) ? y - items[tempIndex + 1].y : -Infinity);

					if (prev < current) {
						tempIndex--;
					} else if (next < current) {
						tempIndex++;
					} else {
						loop = false;
					}
				}

				return tempIndex;
			};

			prototype._refresh = function () {
				var self = this,
					state = self._state,
					currentTime = Date.now(),
					deltaTime = currentTime - lastTouchTime,
					currentVelocity = 0,
					items = state.items,
					currentItem = -1,
					toY = 0,
					scroll = state.scroll;

				if (lastTouchTime !== 0) {
					currentVelocity = (deltaTime > 0) ? (-1 * deltaTouchY) / deltaTime : 0;
					averageVelocity += currentVelocity;
					averageVelocity /= 2;
				} else {
					averageVelocity = 0;
				}

				if (momentum !== 0) {
					momentum = momentum * averageVelocity;
					// momentum value has to be limited to defined max value
					momentum = max(min(momentum, MOMENTUM_MAX_VALUE), -MOMENTUM_MAX_VALUE);

					toY = -1 * (scroll.current - momentum - SCREEN_HEIGHT / 2 + 1);
					// snap to closer item
					currentItem = self._findItemIndexByY(toY);
					toY = items[currentItem].y;

					state.currentIndex = currentItem;
					scroll.from = scroll.current;
					scroll.to = -1 * (toY - SCREEN_HEIGHT / 2 + 1);

					state.duration = min(SCROLL_DURATION * max(averageVelocity, 1), MAX_SCROLL_DURATION);
				}


				if (self._scrollAnimationEnd) {
					state.startTime = Date.now();
					self._scrollAnimationEnd = false;
					animationHandle = requestAnimationFrame(self._render.bind(self));
				}
			};

			prototype._scroll = function () {
				var self = this;

				momentum = (momentum === undefined) ? 0 : momentum;

				self._refresh();
				cancelAnimationFrame(animationHandle);
				animationHandle = requestAnimationFrame(self._render.bind(self));
			};

			prototype._getScaleByY = function (y) {
				var self = this;

				y = round(y);
				if (y > self.options.ellipsisB || y < -self.options.ellipsisB) {
					return 0;
				} else {
					return factorsX[abs(y)];
				}
			};

			prototype._roll = function () {
				var self = this,
					state = self._state,
					scroll = state.scroll;

				// increase scroll duration according to length of items
				// one item more increase duration +25%
				state.duration = SCROLL_DURATION * (1 + (abs(state.currentIndex - state.toIndex) - 1) / 4);

				// start scroll animation from current scroll position
				scroll.from = scroll.current;
				scroll.to = -1 * (state.items[state.toIndex].y - SCREEN_HEIGHT / 2 + 1);

				// if scroll animation is ended then aniamtion start
				if (self._scrollAnimationEnd) {
					state.startTime = Date.now();
					self._scrollAnimationEnd = false;
					animationHandle = requestAnimationFrame(self._render.bind(self));
				}
			};

			/**
			 * Change to next item
			 * @method _rollDown
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._rollDown = function () {
				var self = this,
					state = self._state;

				self.trigger(events.CHANGE, {
					"unselected": state.currentIndex
				});

				if (state.toIndex < state.items.length - 1) {
					state.toIndex++;
				}

				self._roll();
			};

			/**
			 * Change to prev item
			 * @method _rollUp
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._rollUp = function () {
				var self = this,
					state = self._state;

				self.trigger(events.CHANGE, {
					"unselected": state.currentIndex
				});


				if (state.toIndex > 0) {
					state.toIndex--;
				}

				self._roll();
			};

			prototype._onRotary = function (event) {
				var self = this;

				self._scrollAnimationEnd = true;
				if (event.detail.direction === "CW") {
					self._rollDown();
				} else {
					self._rollUp();
				}
			};

			prototype._onTouchStart = function (event) {
				var touch = event.changedTouches[0];

				deltaTouchY = 0;
				lastTouchY = touch.clientY;
				startTouchTime = Date.now();
				deltaSumTouchY = 0;
				lastTouchTime = startTouchTime;
				averageVelocity = 0;
				momentum = 0;
				self._scrollAnimationEnd = true;
				didScroll = false;
			};

			prototype._onTouchMove = function (event) {
				var self = this,
					state = self._state,
					touch = event.changedTouches[0],
					deltaTouchTime = 0,
					scroll = state.scroll;

				// time
				lastTouchTime = Date.now();
				deltaTouchTime = lastTouchTime - startTouchTime;

				// move
				deltaTouchY = touch.clientY - lastTouchY;
				scroll.current += deltaTouchY;
				deltaSumTouchY += deltaTouchY;

				if (didScroll === false) {
					if (deltaTouchTime > TOUCH_MOVE_TIME_THRESHOLD || abs(deltaSumTouchY) > TOUCH_MOVE_Y_THRESHOLD) {
						didScroll = true;
						self.trigger(events.CHANGE, {
							"unselected": state.currentIndex
						});
					}
				}

				if (didScroll) {
					lastTouchY = touch.clientY;
					if (scroll.current > 0) {
						scroll.current = 0;
					}

					state.currentIndex = self._findItemIndexByY(-1 * (scroll.current - SCREEN_HEIGHT / 2 + 1));
					self._carouselUpdate(state.currentIndex);

					momentum = 0;
					self._scroll();
					lastTouchTime = Date.now();

					event.stopImmediatePropagation();
					event.preventDefault();
				}
			};

			prototype._onTouchEnd = function (event) {
				var touch = event.changedTouches[0],
					self = this,
					state = self._state,
					scroll = state.scroll;

				if (didScroll) {
					deltaTouchY = touch.clientY - lastTouchY;
					lastTouchY = touch.clientY;
					scroll.current += deltaTouchY;
					if (scroll.current > 0) {
						scroll.current = 0;
					}

					state.currentIndex = self._findItemIndexByY(-1 * (scroll.current - SCREEN_HEIGHT / 2 + 1));
					self._carouselUpdate(state.currentIndex);

					momentum = MOMENTUM_VALUE;
					self._scrollAnimationEnd = true;
					self._scroll();
					lastTouchTime = 0;

					event.stopImmediatePropagation();
					event.preventDefault();
				}
			};

			prototype._onChange = function (event) {
				var classList = this._ui.arcListviewSelection.classList;

				if (!event.defaultPrevented) {
					if (event.detail.selected !== undefined) {
						classList.add(classes.SELECTION_SHOW);
					} else {
						classList.remove(classes.SELECTION_SHOW);
					}
				}
			};

			prototype._build = function (element) {
				var carouselElement = null,
					self = this,
					arcListviewCarousel = null,
					arcListviewSelection = null,
					page = null,
					scroller = null,
					ui = self._ui,
					carousel = self._carousel,
					fragment = document.createDocumentFragment(),
					i = 0;

				// find outer parent elements
				page = selectorsUtil.getClosestBySelector(element, selectors.PAGE);
				scroller = selectorsUtil.getClosestBySelector(element, selectors.SCROLLER);

				// find list elements with including group indexes
				self._items = page.querySelectorAll(selectors.ITEMS);

				// find or add selection for current list element
				arcListviewSelection = page.querySelector(selectors.SELECTION);
				if (arcListviewSelection) {
					arcListviewSelection = document.createElement("div");
					arcListviewSelection.classList.add(classes.SELECTION);
					page.appendChild(arcListviewSelection);
				}

				// create carousel
				arcListviewCarousel = document.createElement("div");
				arcListviewCarousel.classList.add(classes.CAROUSEL);
				for (i = 0; i < 5; i++) {
					carouselElement = document.createElement("ul");
					carouselElement.classList.add(classes.CAROUSEL_ITEM);
					carousel.items[i] = {
						carouselElement: carouselElement
					};
					fragment.appendChild(carouselElement);
				}
				arcListviewCarousel.appendChild(fragment);

				// append carousel outside scroller element
				scroller.parentElement.appendChild(arcListviewCarousel);

				// cache HTML elements
				ui.page = page;
				ui.arcListviewSelection = arcListviewSelection;
				ui.arcListviewCarousel = arcListviewCarousel;
				ui.scroller = scroller;

				return element;
			};

			/**
			 * Widget init method
			 * @method _init
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._init = function () {
				var self = this,
					options = self.options;

				calcFactors(options.ellipsisA, options.ellipsisB);

				// init items;
				self._setAnimatedItems();
				self._refresh();
				self._carouselUpdate(0);
				self._scroll();
			};

			/**
			 * Event handeler for widget
			 * @param {Event} ev
			 * @method handleEvent
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype.handleEvent = function (ev) {
				var self = this;

				switch (ev.type) {
					case "touchmove" :
						self._onTouchMove(ev);
						break;
					case "rotarydetent" :
						self._onRotary(ev);
						break;
					case "touchstart" :
						self._onTouchStart(ev);
						break;
					case "touchend" :
						self._onTouchEnd(ev);
						break;
					case "change" :
						self._onChange(ev);
						break;
				}
			};

			/**
			 * Bind event listeners to widget instance
			 * @protected
			 * @method _bindEvents
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._bindEvents = function () {
				var self = this,
					element = self.element,
					page = self._ui.page;

				page.addEventListener("touchstart", self, true);
				page.addEventListener("touchmove", self, true);
				page.addEventListener("touchend", self, true);
				document.addEventListener("rotarydetent", self, true);
				element.addEventListener("change", self, true);
			};

			/**
			 * Remove event listeners from widget instance
			 * @method _unbindEvents
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._unbindEvents = function () {
				var self = this,
					element = self.element,
					page = self._ui.page;

				page.removeEventListener("touchstart", self, true);
				page.removeEventListener("touchmove", self, true);
				page.removeEventListener("touchend", self, true);
				document.removeEventListener("rotarydetent", self, true);
				element.removeEventListener("change", self, true);
			};

			/**
			 * Destroy widget instance
			 * @method _destroy
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self._ui;

				self._unbindEvents();

				//@todo append item elements back to UL element
				self._items = [];

				// remove added elements
				ui.page.removeChild(ui.arcListviewSelection);
				ui.scroller.parentElement.removeChild(ui.arcListviewCarousel);
			};

			ArcListview.prototype = prototype;
			ns.widget.wearable.ArcListview = ArcListview;
			ArcListview.classes = classes;

			engine.defineWidget(
				"ArcListview",
				"." + WIDGET_CLASS,
				[],
				ArcListview,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ArcListview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));