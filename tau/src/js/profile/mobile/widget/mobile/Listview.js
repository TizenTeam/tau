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
/*jslint nomen: true, plusplus: true */
/**
 * # Listview Widget
 * The list widget is used to display, for example, navigation data, results,
 * and data entries.
 **
 * @class ns.widget.mobile.Listview
 * @extends ns.widget.core.Listview
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
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
				isNumber = utils.isNumber,
				colorTmp = [0, 0, 0, 0],
				MAX_IDLE_TIME = 3 * 1000, //3s
				Listview = function () {
					var self = this;

					CoreListview.apply(self, arguments);

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
					self._topOffset = 20;
					/**
					 * @property {HTMLElement} _lastVisibleElement
					 * @protected
					 */
					self._lastVisibleElement = null;
					/**
					 * @property {Number} _width
					 * @protected
					 */
					self._width = 0;
					/**
					 * @property {Number} _height
					 * @protected
					 */
					self._height = 0;
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
			* @param {mixed} value
			* @return {Number}
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
			* @member ns.widget.mobile.Listview
			* @return {HTMLElement}
			* @protected
			*/
			prototype._build = function () {
				var element = CoreListviewProto._build.apply(this, arguments),
					canvas = document.createElement("canvas"),
					context = canvas.getContext("2d");

				canvas.classList.add(classes.BACKGROUND_LAYER);

				element.insertBefore(canvas, element.firstElementChild);

				this._context = context;

				return element;
			};

			/**
			* Refreshes widget, critical to call after changes (ex. in background color)
			* @method _refresh
			* @member ns.widget.mobile.Listview
			* @protected
			*/
			prototype._refresh = function () {
				var canvas = this._context.canvas,
					canvasStyle = canvas.style,
					rect = this.element.getBoundingClientRect(),
					computedAfter = window.getComputedStyle(canvas, ":before"),
					colorCSSDefinition = computedAfter.getPropertyValue("content"),
					baseColor = [255, 255, 255, 0],
					modifierColor = [0, 0, 0, 0],
					colors = ["", ""],
					element = this.element,
					pageContainer = selectorUtils.getClosestByClass(element, Page.classes.uiPage),
					popupContianer = selectorUtils.getClosestByClass(element, Popup.classes.popup),
					scrollableContainer = selectorUtils.getClosestByClass(element, Scrollview.classes.clip);

				if (CoreListviewProto._refresh) {
					CoreListviewProto._refresh.apply(this, arguments);
				}

				if (this.element.classList.contains(classes.GRADIENT_BACKGROUND_DISABLED) === false) {
					this._redraw = true;
					this._lastChange = now();

					if (colorCSSDefinition.length > 0) {
						colorCSSDefinition = colorCSSDefinition.replace(colorDefinitionRegex, "");
						colors = colorCSSDefinition.split("::");
						if (colors.length === 2) {
							baseColor = colors[0].split(",").filter(isNumber).map(toNumber);
							modifierColor = colors[1].split(",").filter(isNumber).map(toNumber);
							if (baseColor.length > 0) {
								copyColor(baseColor, this._colorBase);
							}
							if (modifierColor.length > 0) {
								copyColor(modifierColor, this._colorStep);
							}
						}
					}

					this._width = rect.width;
					this._height = rect.height + this._topOffset;

					canvas.setAttribute("width", this._width);
					canvas.setAttribute("height", this._height);
					canvasStyle.width = this._width + "px";
					canvasStyle.height = this._height + "px";

					this._pageContainer = pageContainer;
					this._popupContainer = popupContianer;
					this._scrollableContainer = scrollableContainer;

					this._frameCallback();
				}
			};

			/**
			* Initalizes widget and async timers
			* @method _init
			* @member ns.widget.mobile.Listview
			* @protected
			*/
			prototype._init = function (element) {
				var context = this._context,
					canvas = null;

				if (CoreListview._init) {
					CoreListviewProto._init.apply(this, arguments);
				}

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
			* Handles frame computations and drawing (if necessary)
			* @method _handleFrame
			* @member ns.widget.mobile.Listview
			* @protected
			*/
			prototype._handleFrame = function () {
				var next = this.element.firstElementChild,
					scrollableContainer = this._scrollableContainer,
					top = scrollableContainer && scrollableContainer.scrollTop || 0,
					lastVisibleEl = this._lastVisibleElement,
					topOffset = this._topOffset;

				while (next) {
					if (next && next.tagName.toLowerCase() === "canvas") {
						next = next.nextElementSibling;
						continue;
					}
					if (next.offsetTop + next.offsetHeight >= top) {
						if (next !== lastVisibleEl) {
							this._lastVisibleEl = next;
							this._canvasStyle.transform = "translateY(" + (next.offsetTop - topOffset) + "px)";
							this._redraw = true;
						}
						break;
					}

					next = next.nextElementSibling;
				}

				if (this._redraw) {
					this._handleDraw();
				}

				if (this._running && this._context) {
					this._async(this._frameCallback);
				}

				if (now() - this._lastChange >= MAX_IDLE_TIME) {
					this._running = false;
				}
			};

			/**
			* Handles drawing of step-gradient background
			* @method _handleDraw
			* @member ns.widget.mobile.Listview
			* @protected
			*/
			prototype._handleDraw = function () {
				var next = this.element.firstElementChild,
					context = this._context,
					step = this._colorStep,
					top = 0,
					elementHeight = 0,
					scrollableContainer = this._scrollableContainer,
					scrollTop = scrollableContainer && scrollableContainer.scrollTop || 0,
					topOffset = this._topOffset;

				if (context) {
					copyColor(this._colorBase, colorTmp);
					context.clearRect(0, 0, this._width, this._height);

					while (next) {
						if (next.tagName.toLowerCase() === "canvas") {
							next = next.nextElementSibling;
							elementHeight = topOffset;
							continue;
						}

						if (next.offsetTop + next.offsetHeight >= scrollTop) {
							elementHeight += next.offsetHeight;
							context.fillStyle = "rgba(" + colorTmp[0] + "," + colorTmp[1] + "," + colorTmp[2] + "," + colorTmp[3] + ")";
							context.fillRect(0, top, next.offsetWidth, elementHeight);

							modifyColor(colorTmp, step);
							top += elementHeight;
							elementHeight = 0;
						}

						next = next.nextElementSibling;
					}
				}

				this._redraw = false;
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
					CoreListviewProto._bindEvents.apply(this, arguments);
				}

				if (scrollableContainer) {
					this._scrollableContainer = scrollableContainer;
					this._scrollCallback = this._handleScroll.bind(this);
					eventUtils.on(scrollableContainer, "touchstart", this._scrollCallback);
					eventUtils.on(scrollableContainer, "touchmove", this._scrollCallback);
					eventUtils.on(scrollableContainer, "scroll", this._scrollCallback);
				}

				this._backgroundRenderCallback = this._backgroundRender.bind(this);

				this.on("resize expand collapse", this._backgroundRenderCallback, false);

				if (pageContainer) {
					eventUtils.on(pageContainer, Page.events.BEFORE_SHOW, this._backgroundRenderCallback);
				}

				if (popupContainer) {
					eventUtils.on(popupContainer, Popup.events.before_show, this._backgroundRenderCallback);
				}
			};

			/**
			* Destroys widget
			* @method _destroy
			* @param {HTMLelement} element
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
					this.off("resize expand collapse", this._backgroundRenderCallback, false);
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
