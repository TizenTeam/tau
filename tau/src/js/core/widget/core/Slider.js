/*global window, define, ns */
/*jslint nomen: true */
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
 * #Slider
 * The slider component changes the range-type browser input to sliders.
 *
 * ##Default selectors
 * In default all **INPUT** tags with type equals _range_  and _data-role=slider_ are changed to TAU sliders.
 *
 * ###HTML Examples
 *
 *         @example
 *              <input type="range" name="slider-1" id="slider" value="60" min="0" max="100">
 *
 * ###Manual constructor
 * For manual creation of slider widget you can use constructor of widget
 *
 *         @example
 *              <input id="slider">
 *              <script>
 *                  var sliderElement = document.getElementById("slider"),
 *                      slider;
 *
 *                  slider = tau.widget.Slider(sliderElement);
 *
 *                  // You can make slider component for TizenSlider component name,
 *                  // for example, tau.widget.TizenSlider(sliderElement).
 *                  // But, TizenSlider component name will be deprecated since tizen 2.4
 *                  // because we don't recommend this method.
 *              </script>
 *
 * @class ns.widget.core.Slider
 * @extends ns.widget.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../theme",
			"../../util/selectors",
			"../../util/DOM/css",
			"../../event",
			"../../event/gesture",
			"../../router/history",
			"../core", // fetch namespace
			"./Page",
			"../BaseWidget"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				selectors = ns.util.selectors,
				utilDOM = ns.util.DOM,
				events = ns.event,
				Gesture = ns.event.gesture,
				Page = ns.widget.core.Page,
				DEFAULT = {
					HORIZONTAL: "horizontal"
				},
				Slider = function () {
					var self = this;
					/**
					 * Widget options
					 * @property {boolean} [options.type="normal"] Slider type. 'normal', 'center' or 'circle'
					 * @property {string} [options.orientation="horizontal"] Slider orientation. horizontal or vertical
					 * @property {boolean} [options.expand=false] Slider expand mode. true or false
					 **/
					self.options = {
						type: "normal",
						orientation: DEFAULT.HORIZONTAL,
						expand: false
					};
					self._ui = {};
					self._callbacks = {};
				},
				classes = {
					SLIDER: "ui-slider",
					SLIDER_HORIZONTAL: "ui-slider-horizontal",
					SLIDER_VERTICAL: "ui-slider-vertical",
					SLIDER_VALUE: "ui-slider-value",
					SLIDER_HANDLER: "ui-slider-handler",
					SLIDER_HANDLER_EXPAND: "ui-slider-handler-expand",
					SLIDER_CENTER: "ui-slider-center",
					SLIDER_HANDLER_ACTIVE: "ui-slider-handler-active"
				},
				prototype = new BaseWidget();

			Slider.prototype = prototype;
			Slider.classes = classes;


			/**
			 * Callback on event pagebeforeshow
			 * @method onPageBeforeShow
			 * @param self
			 * @private
			 * @member ns.widget.core.Slider
			 */
			function pageBeforeShow(self) {
				self.refresh();
			}

			/**
			 * Bind events
			 * @method bindEvents
			 * @param {Object} self
			 * @member ns.widget.core.Slider
			 * @private
			 * @static
			 */
			function bindEvents(self) {
				var element = self._ui.barElement,
					page = selectors.getClosestByClass(element, Page.classes.uiPage);

				events.enableGesture(
					element,

					new Gesture.Drag({
						orientation: self.options.orientation,
						threshold: 0
					})
				);
				events.on(element, "dragstart drag dragend dragcancel", self, false);

				self._callbacks.onPageBeforeShow = pageBeforeShow.bind(null, self);
				page.addEventListener(Page.events.BEFORE_SHOW, self._callbacks.onPageBeforeShow, true);
			}

			/**
			 * unBind events
			 * @method unbindEvents
			 * @param {Object} self
			 * @member ns.widget.core.Slider
			 * @private
			 * @static
			 */
			function unbindEvents(self) {
				var element = self._ui.barElement,
					page = selectors.getClosestByClass(element, Page.classes.uiPage);

				events.disableGesture(element);
				events.off(element, "dragstart drag dragend dragcancel", self, false);

				if (self._callbacks.onPageBeforeShow) {
					page.removeEventListener(Page.events.BEFORE_SHOW, self._callbacks.onPageBeforeShow);
				}
			}

			/**
			 * Build structure of Slider component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._build = function(element) {
				var self = this,
					ui = self._ui,
					barElement = document.createElement("div"),
					valueElement = document.createElement("div"),
					handlerElement = document.createElement("div");

				element.style.display = "none";
				barElement.classList.add(classes.SLIDER);

				valueElement.classList.add(classes.SLIDER_VALUE);
				barElement.appendChild(valueElement);
				handlerElement.classList.add(classes.SLIDER_HANDLER);

				barElement.appendChild(handlerElement);
				element.parentNode.appendChild(barElement);
				ui.valueElement = valueElement;
				ui.handlerElement = handlerElement;
				ui.barElement = barElement;
				return element;
			};

			/**
			 * init Slider component
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._init = function(element) {
				var self = this,
					attrMin = parseInt(element.getAttribute("min"), 10),
					attrMax = parseInt(element.getAttribute("max"), 10),
					attrValue = parseInt(element.getAttribute("value"), 10);

				self._min = attrMin ? attrMin : 0;
				self._max = attrMax ? attrMax : 100;
				self._value = attrValue ? attrValue : self.element.value;
				self._interval = self._max - self._min;
				self._previousValue = self._value;

				self._initLayout();
				return element;
			};

			/**
			 * init layout of Slider component
			 * @method _initLayout
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._initLayout = function() {
				var self = this,
					options = self.options,
					ui = self._ui,
					barElement = ui.barElement,
					handlerElement = ui.handlerElement;

				if (options.orientation === DEFAULT.HORIZONTAL) {
					barElement.classList.remove(classes.SLIDER_VERTICAL);
					barElement.classList.add(classes.SLIDER_HORIZONTAL);
				} else {
					barElement.classList.remove(classes.SLIDER_HORIZONTAL);
					barElement.classList.add(classes.SLIDER_VERTICAL);
				}

				options.type === "center" ? barElement.classList.add(classes.SLIDER_CENTER) : barElement.classList.remove(classes.SLIDER_CENTER);

				options.expand ? handlerElement.classList.add(classes.SLIDER_HANDLER_EXPAND) : handlerElement.classList.remove(classes.SLIDER_HANDLER_EXPAND);


				self._barElementWidth = ui.barElement.offsetWidth;
				if (self.options.orientation !== DEFAULT.HORIZONTAL) {
					self._barElementHeight = ui.barElement.offsetHeight;
				}
				self._setValue(self._value);
			};

			/**
			 * Set value of Slider center mode
			 * @method _setCenterValue
			 * @param {number} value
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._setCenterValue = function(value) {
				var self = this,
					ui = self._ui,
					validValue,
					valueElementValidStyle,
					handlerElementValidStyle,
					center, validStyle, inValidStyle;

				if (self.options.orientation === DEFAULT.HORIZONTAL) {
					center = self._barElementWidth / 2;
					validValue =  self._barElementWidth * (value - self._min) / self._interval;
					validStyle = validValue < center ? "right" : "left";
					inValidStyle = validValue < center ? "left" : "right";
					valueElementValidStyle = "width";
					handlerElementValidStyle = "left";
				} else {
					center = self._barElementHeight / 2;
					validValue =  self._barElementHeight * (value - self._min) / self._interval;
					validStyle = validValue < center ? "bottom" : "top";
					inValidStyle = validValue < center ? "top" : "bottom";
					valueElementValidStyle = "height";
					handlerElementValidStyle = "top";
				}

				ui.valueElement.style[validStyle] = "50%";
				ui.valueElement.style[inValidStyle] = "initial";

				ui.valueElement.style[valueElementValidStyle] = Math.abs(center - validValue) + "px";
				ui.handlerElement.style[handlerElementValidStyle] = validValue + "px";
			};

			/**
			 * Set value of Slider normal mode
			 * @method _setNormalValue
			 * @param {number} value
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._setNormalValue = function(value) {
				var self = this,
					ui = self._ui,
					options = self.options,
					barElementLength,
					valueElementValidStyle,
					handlerElementValidStyle,
					validValue;

				if (options.orientation === DEFAULT.HORIZONTAL) {
					barElementLength = self._barElementWidth;
					valueElementValidStyle = "width";
					handlerElementValidStyle = "left";
				} else {
					barElementLength = self._barElementHeight;
					valueElementValidStyle = "height";
					handlerElementValidStyle = "top";
				}

				validValue = barElementLength * (value - self._min) / self._interval;
				ui.valueElement.style[valueElementValidStyle] = validValue + "px";
				ui.handlerElement.style[handlerElementValidStyle] = validValue + "px";
			};

			/**
			 * Set value of Slider
			 * @method _setValue
			 * @param {number} value
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._setValue = function(value) {
				var self = this,
					ui = self._ui,
					options = self.options,
					element = self.element,
					intValue;

				if (value < self._min) {
					value = self._min;
				} else if (value > self._max) {
					value = self._max;
				}

				intValue = parseInt(value, 10);

				if (options.type === "center") {
					self._setCenterValue(value);
				} else if (options.type === "normal") {
					self._setNormalValue(value);
				}

				if (element.value - 0 !== intValue) {
					element.setAttribute("value", intValue);
					element.value = intValue;
					self._value = intValue;
					if (self.options.expand) {
						ui.handlerElement.innerText = intValue;
					}
					events.trigger(element, "input");
				}
			};

			/**
			 * If custom elements are used then we prevent looping.
			 * Method check if to use setValue or just change attribute
			 * and then customElement change callback will be called
			 * @method _setDraggedValue
			 * @param {number} value
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._setDraggedValue = function(value) {
				var self = this,
					element = self.element,
					isCustom = element.hasAttribute("is") ? true : false;

				if (isCustom) {
					element.setAttribute("value", value);
				} else {
					self._setValue(value);
				}
			};

			/**
			 * Bind events to Slider
			 * @method _bindEvents
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._bindEvents = function() {
				bindEvents(this);
			};

			/**
			 * Bind event handlers
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype.handleEvent = function(event) {
				var self = this;
				switch (event.type) {
					case "dragstart":
						self._onDragstart(event);
						break;
					case "dragend":
					case "dragcancel":
						self._onDragend(event);
						break;
					case "drag":
						self._onDrag(event);
						break;
				}
			};

			/**
			 * Drag event handler
			 * @method _onDrag
			 * @param {Event} event
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._onDrag = function(event) {
				var self = this,
					ui = self._ui,
					validPosition,
					value;
				if (self._active) {
					validPosition = self.options.orientation === DEFAULT.HORIZONTAL ?
						event.detail.estimatedX - ui.barElement.offsetLeft :
						event.detail.estimatedY - utilDOM.getElementOffset(ui.barElement).top + selectors.getScrollableParent(self.element).scrollTop;

					value = self.options.orientation === DEFAULT.HORIZONTAL ?
						self._interval * validPosition / self._barElementWidth :
						self._interval * validPosition / self._barElementHeight;

					value += self._min;
					self._setDraggedValue(value);
				}
			};

			/**
			 * DragStart event handler
			 * @method _onDragstart
			 * @param {Event} event
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._onDragstart = function(event) {
				var self = this,
					ui = self._ui,
					validPosition = self.options.orientation === DEFAULT.HORIZONTAL ?
						event.detail.estimatedX - ui.barElement.offsetLeft :
						event.detail.estimatedY - utilDOM.getElementOffset(ui.barElement).top + selectors.getScrollableParent(self.element).scrollTop,
					value = self.options.orientation === DEFAULT.HORIZONTAL ?
						self._interval * validPosition / self._barElementWidth :
						self._interval * validPosition / self._barElementHeight;

				ui.handlerElement.classList.add(classes.SLIDER_HANDLER_ACTIVE);
				value += self._min;
				self._setDraggedValue(value);
				self._active = true;
			};

			/**
			 * DragEnd event handler
			 * @method _onDragend
			 * @param {Event} event
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._onDragend = function() {
				var self = this,
					ui = self._ui;
				ui.handlerElement.classList.remove(classes.SLIDER_HANDLER_ACTIVE);
				self._active = false;
				if (self._previousValue !== self.element.value) {
					events.trigger(self.element, "change");
				}
				self._previousValue = self.element.value;
			};

			/**
			 * Get or Set value of Slider
			 * @method value
			 * @param {Number} value
			 * @return {Number} value
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype.value = function(value) {
				if (value) {
					this._setValue(value);
				}
				return this.element.getAttribute("value");
			};

			/**
			 * Refresh to Slider component
			 * @method refresh
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype.refresh = function() {
				this._initLayout();
			};

			/**
			 * Destroy Slider component
			 * @method _destroy
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._destroy = function() {
				var self = this,
					barElement = self._ui.barElement;
				unbindEvents(self);
				barElement.parentNode.removeChild(barElement);
				self._ui = null;
				self._options = null;
			};
			ns.widget.core.Slider = Slider;
			engine.defineWidget(
				"Slider",
				"input[data-role='slider'], input[type='range'], input[data-type='range']",
				[
					"value"
				],
				Slider,
				"core",
				false,
				false,
				HTMLInputElement
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Slider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
