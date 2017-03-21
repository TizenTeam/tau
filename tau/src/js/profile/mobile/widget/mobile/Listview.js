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
/*global window, define, ns */
/**
 * # List View
 * List view component is used to display, for example, navigation data, results, and data entries, in a list format.
 *
 * @class ns.widget.mobile.Listview
 * @extends ns.widget.core.Listview
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @since 2.0
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/util",
			"../../../../core/util/selectors",
			"../../../../core/util/object",
			"../../../../core/event",
			"../../../../core/engine",
			"../../../../core/widget/core/Page",
			"../../../../core/widget/core/Popup",
			"../../../../core/widget/core/Scrollview",
			"../../../../core/widget/core/Listview",
			"../mobile",
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Page = ns.widget.core.Page,
				Popup = ns.widget.core.Popup,
				Scrollview = ns.widget.core.Scrollview,
				CoreListview = ns.widget.core.Listview,
				CoreListviewProto = CoreListview.prototype,
				utils = ns.util,
				objectUtils = utils.object,
				selectorUtils = utils.selectors,
				eventUtils = ns.event,
				now = Date.now,
				colorDefinitionRegex = new RegExp("[^0-9\-\.:,]+", "gi"),
				min = Math.min,
				max = Math.max,
				round = Math.round,
				ceil = Math.ceil,
				slice = [].slice,
				isNumber = utils.isNumber,
				colorTmp = [0, 0, 0, 0],
				MAX_IDLE_TIME = 3 * 1000, //3s
				Listview = function () {
					var self = this;

					CoreListview.call(self);

					/**
					 * @property {Function} _async async function (requestAnimationFrame)
					 * @protected Kept here for easy test injection
					 */
					self._async = utils.requestAnimationFrame;
					/**
					 * @property {CanvasRenderingContext2D} _context rendering context
					 * @protected
					 */
					self._context = null;
					/**
					 * @property {CSSStyleDeclaration} _canvasStyle canvas elements style
					 * @protected
					 */
					self._canvasStyle = null;
					/**
					 * @property {HTMLElement} _scrollableContainer detected parent scrollable element
					 * @protected
					 */
					self._scrollableContainer = null;
					/**
					 * @property {HTMLElement} _pageContainer detected parent page element
					 * @protected
					 */
					self._pageContainer = null;
					/**
					 * @property {HTMLElement} _popupContainer detected parent popup element
					 * @protected
					 */
					self._popupContainer = null;
					/**
					 * @property {Function} _drawCallback
					 * @protected
					 */
					self._drawCallback = null;
					/**
					 *
					 * @property {Function} _scrollCallback
					 * @protected
					 */
					self._scrollCallback = null;
					/**
					 * @property {Function} _backgroundRenderCallback
					 * @protected
					 */
					self._backgroundRenderCallback = null;
					/**
					 * @property {boolean} _running flag for async timers
					 * @protected
					 */
					self._running = false;
					/**
					 * @property {boolean} _redraw flag for drawing
					 * @protected
					 */
					self._redraw = false;
					/**
					 * @property {Array} _colorBase starting default color for gradient background
					 * @protected
					 */
					self._colorBase = [128, 255, 192, 0];
					/**
					 * @property {Array} _colorStep color modifier for each background gradient step
					 * @protected
					 */
					self._colorStep = [0, 0, 0, 0.04];
					/**
					 * @property {Number} _lastChange
					 * @protected
					 */
					self._lastChange = 0;
					/**
					 * @property {Number}
					 * @protected
					 */
					self._topOffset = window.innerHeight;
					/**
					 * @property {HTMLElement} _previousVisibleElement
					 * @protected
					 */
					self._previousVisibleElement = null;
					/**
					 * @property {Number} _canvasWidth
					 * @protected
					 */
					self._canvasWidth = 0;
					/**
					 * @property {Number} _canvasHeight
					 * @protected
					 */
					self._canvasHeight = 0;
				},
				/**
				 * @property {Object} classes
				 * @property {string} classes.BACKGROUND_LAYER
				 * @property {string} classes.GRADIENT_BACKGROUND_DISABLED
				 * @member ns.widget.mobile.Listview
				 * @static
				 * @readonly
				 */
				classes = {
					/**
					 */
					"BACKGROUND_LAYER": "ui-listview-background",
					"GRADIENT_BACKGROUND_DISABLED": "ui-listview-background-disabled"
				},
				/**
				 * @property {Object} events
				 * @property {string} events.BACKGROUND_RENDER
				 * @member ns.widget.mobile.Listview
				 * @static
				 * @readonly
				 */
				events = {
					"BACKGROUND_RENDER": "event-listview-background-render"
				},
				engine = ns.engine,
				prototype = new CoreListview();

			/**
			 * Modifies input color array (rgba) by a specified
			 * modifier color array (rgba)
			 * @method modifyColor
			 * @param {Array} color input array of color values (rgba)
			 * @param {Array} modifier array of color values (rgba)
			 * @member ns.widget.mobile.Listview
			 * @return {number} Return opacity of color
			 * @private
			 */
			function modifyColor(color, modifier) {
				color[0] += modifier[0];
				color[1] += modifier[1];
				color[2] += modifier[2];
				color[3] += modifier[3];

				color[0] = min(max(0, color[0]), 255);
				color[1] = min(max(0, color[1]), 255);
				color[2] = min(max(0, color[2]), 255);
				color[3] = min(max(0, color[3]), 1);

				return color[3];
			}

			/**
			 * Copies values from one color array (rgba) to other
			 * @method copyColor
			 * @param {Array} inc color array (rgba)
			 * @param {Array} out color array (rgba)
			 * @member ns.widget.mobile.Listview
			 * @private
			 */
			function copyColor(inc, out) {
				out[0] = inc[0];
				out[1] = inc[1];
				out[2] = inc[2];
				out[3] = inc[3];
			}

			/**
			 * Returns number from specified value (mixed) or
			 * 0 if no param is not a number
			 * @method toNumber
			 * @param {mixed} val
			 * @return {number}
			 * @member ns.widget.mobile.Listview
			 * @private
			 */
			function toNumber(val) {
				var res = parseFloat(val);

				// fast NaN check
				if (res === res) {
					return res;
				}

				return 0;
			}

			Listview.classes = objectUtils.fastMerge(classes, CoreListview.classes || {});
			Listview.events = objectUtils.fastMerge(events, CoreListview.events || {});

			/**
			 * Builds widget
			 * @method _build
			 * @param {HTMLElement} element Main element of widget
			 * @member ns.widget.mobile.Listview
			 * @return {HTMLElement}
			 * @protected
			 */
			prototype._build = function (element) {
				var newElement = CoreListviewProto._build.call(this, element),
					isChildListview = !!selectorUtils.getClosestByClass(element && element.parentElement, "ui-listview"),
					canvas = null,
					context = null;

				this._isChildListview = isChildListview;

				if (!isChildListview) {
					canvas = document.createElement("canvas");
					context = canvas.getContext("2d");
					canvas.classList.add(classes.BACKGROUND_LAYER);
					newElement.insertBefore(canvas, newElement.firstElementChild);
					this._context = context;
				}

				return newElement;
			};

			/**
			 * Init colors used to draw colored bars
			 * @method _prepareColors
			 * @member ns.widget.mobile.Listview
			 * @protected
			 * */
			prototype._prepareColors = function () {
				var self = this,
					canvas = self._context.canvas,
					computedAfter = window.getComputedStyle(canvas, ":before"),
					colorCSSDefinition = computedAfter.getPropertyValue("content"),
					baseColor = [255, 255, 255, 0],
					modifierColor = [0, 0, 0, 0],
					colors = ["", ""];

				if (colorCSSDefinition.length > 0) {
					colorCSSDefinition = colorCSSDefinition.replace(colorDefinitionRegex, "");
					colors = colorCSSDefinition.split("::");
					if (colors.length === 2) {
						baseColor = colors[0].split(",").filter(isNumber).map(toNumber);
						modifierColor = colors[1].split(",").filter(isNumber).map(toNumber);
						if (baseColor.length > 0) {
							copyColor(baseColor, self._colorBase);
						}
						if (modifierColor.length > 0) {
							copyColor(modifierColor, self._colorStep);
						}
					}
				}
			};

			/**
			 * Refreshes widget, critical to call after changes (ex. in background color)
			 * @method _refresh
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._refresh = function () {
				var self = this,
					canvas = self._context.canvas,
					canvasStyle = canvas.style,
					element = self.element,
					rect = element.getBoundingClientRect(),
					pageContainer = selectorUtils.getClosestByClass(element, Page.classes.uiPage),
					popupContainer = selectorUtils.getClosestByClass(element, Popup.classes.popup),
					scrollableContainer = selectorUtils.getClosestByClass(element, Scrollview.classes.clip),
					// canvasHeight of canvas element
					canvasHeight = 0,
					// canvasWidth of canvas element
					canvasWidth = 0;

				if (CoreListviewProto._refresh) {
					CoreListviewProto._refresh.call(self);
				}

				if (self.element.classList.contains(classes.GRADIENT_BACKGROUND_DISABLED) === false) {
					self._redraw = true;
					self._lastChange = now();

					self._prepareColors();

					canvasWidth = rect.width;
					// calculate canvasHeight of canvas
					canvasHeight = rect.height + self._topOffset;
					// limit canvas for better performance
					canvasHeight = min(canvasHeight, 3 * window.innerHeight);

					self._canvasHeight = canvasHeight;
					self._canvasWidth = canvasWidth;

					// init canvas
					canvas.setAttribute("width", canvasWidth);
					canvas.setAttribute("height", canvasHeight);
					canvasStyle.width = canvasWidth + "px";
					canvasStyle.height = canvasHeight + "px";

					self._pageContainer = pageContainer;
					self._popupContainer = popupContainer;
					self._scrollableContainer = scrollableContainer;

					self._frameCallback();
				}
			};

			/**
			 * Initalizes widget and async timers
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._init = function (element) {
				var context = this._context,
					canvas = null;

				if (CoreListview._init) {
					CoreListviewProto._init.call(this, element);
				}

				if (!this._isChildListview) {
					if (!context) {
						canvas = element.querySelector("." + classes.BACKGROUND_LAYER);
						if (canvas) {
							context = canvas.getContext("2d");
						}
					} else {
						canvas = context.canvas;
					}

					if (context) {
						this._canvasStyle = canvas.style;
						this._frameCallback = this._handleFrame.bind(this);

						this.refresh();
					}
				}
			};

			/**
			 * Handles scroll event data
			 * @method _init
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._handleScroll = function () {
				this._lastChange = now();

				if (!this._running) {
					this._running = true;
					this._async(this._frameCallback);
				}
			};

			/**
			 * Refresh event wrapper
			 * @method _backgroundRender
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			prototype._backgroundRender = function () {
				this.refresh();
			};

			/**
			 * Calculate element height as difference between top of current element and top of next element
			 * @param {HTMLElement} nextVisibleLiElement
			 * @param {DOMRect} rectangle
			 * @return {number}
			 */
			function calculateElementHeight(nextVisibleLiElement, rectangle) {
				// we need round to eliminate empty spaces between bars
				if (nextVisibleLiElement) {
					return round(nextVisibleLiElement.getBoundingClientRect().top - rectangle.top);
				}
				return round(rectangle.height);
			}

			/**
			 * Handles frame computations and drawing (if necessary)
			 * @method _handleFrame
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._handleFrame = function () {
				var self = this,
					element = self.element,
					// get all li liElements
					liElements = slice.call(element.querySelectorAll("li")),
					nextVisibleLiElement = null,
					// scrollable container, connected with scrollview
					scrollableContainer = self._scrollableContainer,
					scrollTop = scrollableContainer && scrollableContainer.scrollTop || 0,
					// top of element to calculate offset top
					top = element.getBoundingClientRect().top,
					previousVisibleElement = self._previousVisibleElement,
					topOffset = self._topOffset,
					rectangle = null,
					currentVisibleLiElement = getNextVisible(liElements),
					liOffsetTop = 0,
					height;

				while (currentVisibleLiElement) {
					// store size of current element
					rectangle = getElementRectangle(currentVisibleLiElement);
					liOffsetTop = rectangle.top - top;
					// get next element to calculate difference
					nextVisibleLiElement = getNextVisible(liElements);
					height = calculateElementHeight(nextVisibleLiElement, rectangle);
					if (liOffsetTop + height >= scrollTop) {
						if (currentVisibleLiElement !== previousVisibleElement) {
							self._previousVisibleElement = currentVisibleLiElement;
							self._canvasStyle.transform = "translateY(" + (liOffsetTop - topOffset) + "px)";
							self._redraw = true;
						}
						currentVisibleLiElement = null;
					} else {
						// go to next element
						currentVisibleLiElement = nextVisibleLiElement;
					}
				}

				if (self._redraw) {
					self._handleDraw();
				}

				if (self._running && self._context) {
					self._async(self._frameCallback);
				}

				if (now() - self._lastChange >= MAX_IDLE_TIME) {
					self._running = false;
				}
			};

			/**
			 * Get next visible element from list
			 * @param {HTMLElement} liElements
			 * @return {HTMLElement}
			 */
			function getNextVisible(liElements) {
				var next = liElements.shift();

				while (next) {
					if (next.offsetHeight) {
						return next;
					}
					next = liElements.shift();
				}

				return null;
			}

			/**
			 * Calculate rectangle and create new object which is not read-only
			 * @param {HTMLElement} element
			 * @return {{top: (number|*), height: (number|*), left, width}}
			 */
			function getElementRectangle(element) {
				var rectangle = element.getBoundingClientRect();

				return {
					top: rectangle.top,
					height: rectangle.height,
					left: rectangle.left,
					width: rectangle.width
				};
			}

			/**
			 * Draw bar on canvas
			 * @param {CanvasRenderingContext2D} context
			 * @param {DOMRect} rectangle
			 */
			function drawRectangle(context, rectangle) {
				// set color
				context.fillStyle = "rgba(" + colorTmp[0] + "," + colorTmp[1] + "," + colorTmp[2] + "," + colorTmp[3] + ")";
				// first element is bigger by offset, to show color on scroll in up direction
				context.fillRect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
			}

			/**
			 * Init color variable and clear canvas
			 * @method _prepareCanvas
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._prepareCanvas = function () {
				var self = this;

				// prepare first color
				copyColor(self._colorBase, colorTmp);
				// clear canvas
				self._context.clearRect(0, 0, self._canvasWidth, self._canvasHeight);
			};

			/**
			 * Handles drawing of step-gradient background
			 * @method _handleDraw
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._handleDraw = function () {
				var self = this,
					element = self.element,
					// all li elements
					elements = slice.call(element.querySelectorAll("li")),
					// find only elements which are visible
					liElement = getNextVisible(elements),
					// get draw context
					context = self._context,
					// color step to modify colors
					step = self._colorStep,
					// top on screen of listview
					top = element.getBoundingClientRect().top,
					// get scroll top
					scrollableContainer = self._scrollableContainer,
					scrollTop = scrollableContainer ? scrollableContainer.scrollTop : 0,
					// store dimensions of li
					rectangle = null,
					// top on each last element
					previousTop = 0,
					topOffset = self._topOffset;

				if (context) {
					self._prepareCanvas();

					while (liElement) {
						// calculate size of li element
						rectangle = getElementRectangle(liElement);
						// get liElement element
						liElement = getNextVisible(elements);
						rectangle.height = calculateElementHeight(liElement, rectangle);
						// check that element is visible (can be partialy visible)
						if (ceil(rectangle.top - top + rectangle.height) >= scrollTop) {
							// adjust height for first element
							rectangle.height += topOffset;
							topOffset = 0;

							rectangle.top = previousTop;
							drawRectangle(context, rectangle);
							previousTop += rectangle.height;

							// calculate liElement step, stop when all done
							if (!modifyColor(colorTmp, step)) {
								liElement = null;
							}
						}
					}
				}
				self._redraw = false;
			};

			/**
			 * Bounds to events
			 * @method _bindEvents
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._bindEvents = function () {
				var scrollableContainer = this._scrollableContainer,
					pageContainer = this._pageContainer,
					popupContainer = this._popupContainer;

				if (CoreListviewProto._bindEvents) {
					CoreListviewProto._bindEvents.call(this);
				}

				if (!this._isChildListview) {
					if (scrollableContainer) {
						this._scrollableContainer = scrollableContainer;
						this._scrollCallback = this._handleScroll.bind(this);
						eventUtils.on(scrollableContainer, "touchstart", this._scrollCallback);
						eventUtils.on(scrollableContainer, "touchmove", this._scrollCallback);
						eventUtils.on(scrollableContainer, "scroll", this._scrollCallback);
					}

					this._backgroundRenderCallback = this._backgroundRender.bind(this);

					this.on("expand collapse", this._backgroundRenderCallback, false);

					// support rotation
					eventUtils.on(window, "resize", this._backgroundRenderCallback, false);

					if (pageContainer) {
						eventUtils.on(pageContainer, Page.events.BEFORE_SHOW, this._backgroundRenderCallback);
					}

					if (popupContainer) {
						eventUtils.on(popupContainer, Popup.events.before_show, this._backgroundRenderCallback);
					}
				}
			};

			/**
			 * Destroys widget
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._destroy = function (element) {
				var self = this;

				if (self._context) {
					if (self._context.canvas.parentElement) {
						self._context.canvas.parentElement.removeChild(self._context.canvas);
					}
					self._context = null;
				}

				if (self._scrollCallback) {
					if (self._scrollableContainer) {
						eventUtils.off(self._scrollableContainer, "touchstart", self._scrollCallback);
						eventUtils.off(self._scrollableContainer, "touchmove", self._scrollCallback);
						eventUtils.off(self._scrollableContainer, "scroll", self._scrollCallback);
						self._scrollableContainer = null;
					}
					self._scrollCallback = null;
				}

				if (self._backgroundRenderCallback) {
					this.off("expand collapse", this._backgroundRenderCallback, false);
					eventUtils.off(window, "resize", this._backgroundRenderCallback, false);
					if (element) {
						eventUtils.off(element, events.BACKGROUND_RENDER, self._backgroundRenderCallback);
					}
					if (this._pageContainer) {
						eventUtils.off(this._pageContainer, Page.events.BEFORE_SHOW, this._backgroundRenderCallback);
						this._pageContainer = null;
					}

					if (this._popupContainer) {
						eventUtils.off(this._popupContainer, Popup.events.before_show, this._backgroundRenderCallback);
						this._popupContainer = null;
					}
					self._backgroundRenderCallback = null;
				}
			};

			Listview.prototype = prototype;
			ns.widget.mobile.Listview = Listview;
			engine.defineWidget(
				"Listview",
				"[data-role='listview'], .ui-listview",
				[],
				Listview,
				"mobile",
				true
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Listview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
