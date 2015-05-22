/*global window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
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
				DEFAULT = {
					HORIZONTAL: "horizontal"
				},
				Slider = function () {
					var self = this;
					/**
					 * Widget options
					 * @property {boolean} [options.center=false] Slider center mode. true or false
					 * @property {string} [options.direction="horizontal"] Slider direction. horizontal or vertical
					 * @property {boolean} [options.expand=false] Slider expand mode. true or false
					 */
					self.options = {
						center: false,
						direction: DEFAULT.HORIZONTAL,
						expand: false
					};
					self._ui = {};
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
			 * Bind events
			 * @method bindEvents
			 * @param {Object} self
			 * @member ns.widget.core.Slider
			 * @private
			 * @static
			 */
			function bindEvents(self) {
				var element = self._ui.barElement;

				events.enableGesture(
					element,

					new Gesture.Drag({
						orientation: self.options.direction,
						threshold: 0
					})
				);
				events.on(element, "mousedown touchstart mouseup touchend drag dragend dragcancel", self, false);
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
				var element = self._ui.barElement;

				events.disableGesture(element);
				events.off(element, "mousedown touchstart mouseup touchend drag dragend dragcancel", self, false);
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
					options = self.options,
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
				self._value = attrValue ? attrValue : 0;
				self._interval = self._max - self._min;

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

				if (options.direction === DEFAULT.HORIZONTAL) {
					barElement.classList.remove(classes.SLIDER_VERTICAL);
					barElement.classList.add(classes.SLIDER_HORIZONTAL)
				} else {
					barElement.classList.remove(classes.SLIDER_HORIZONTAL);
					barElement.classList.add(classes.SLIDER_VERTICAL);
				}

				options.center ? barElement.classList.add(classes.SLIDER_CENTER) : barElement.classList.remove(classes.SLIDER_CENTER);

				options.expand ? handlerElement.classList.add(classes.SLIDER_HANDLER_EXPAND) : handlerElement.classList.remove(classes.SLIDER_HANDLER_EXPAND);


				self._barElementWidth = ui.barElement.offsetWidth;
				if (self.options.direction !== DEFAULT.HORIZONTAL) {
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

				if (self.options.direction === DEFAULT.HORIZONTAL) {
					center = self._barElementWidth / 2;
					validValue =  self._barElementWidth * value / self._interval;
					validStyle = validValue < center ? "right" : "left";
					inValidStyle = validValue < center ? "left" : "right";
					valueElementValidStyle = "width";
					handlerElementValidStyle = "left";
				} else {
					center = self._barElementHeight / 2;
					validValue =  self._barElementHeight * value / self._interval;
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

				if (options.direction === DEFAULT.HORIZONTAL) {
					barElementLength = self._barElementWidth;
					valueElementValidStyle = "width";
					handlerElementValidStyle = "left";
				} else {
					barElementLength = self._barElementHeight;
					valueElementValidStyle = "height";
					handlerElementValidStyle = "top";
				}

				validValue = barElementLength * value / self._interval;
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
					options = self.options;

				if (value < self._min || value > self._max) {
					value = value < 0 ? self._min : self._max;
				}
				if (options.center) {
					self._setCenterValue(value);
				} else {
					self._setNormalValue(value);
				}

				self.element.setAttribute("value", parseInt(value));
				if (self.options.expand) {
					ui.handlerElement.innerText =  parseInt(value);
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
					case "mousedown":
					case "touchstart":
						self._onDragstart(event);
						break;
					case "dragend":
					case "dragcancel":
					case "mouseup":
					case "touchend":
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
					validPosition = self.options.direction === DEFAULT.HORIZONTAL ?
						event.detail.estimatedX - ui.barElement.offsetLeft :
						event.detail.estimatedY - utilDOM.getElementOffset(ui.barElement).top + selectors.getScrollableParent(self.element).scrollTop;

					value = self.options.direction === DEFAULT.HORIZONTAL ?
						self._interval * validPosition / self._barElementWidth :
						self._interval * validPosition / self._barElementHeight;
					self._setValue(value);
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
					validPosition = self.options.direction === DEFAULT.HORIZONTAL ?
						event.pageX - ui.barElement.offsetLeft :
						event.pageY - utilDOM.getElementOffset(ui.barElement).top + selectors.getScrollableParent(self.element).scrollTop,
					value = self.options.direction === DEFAULT.HORIZONTAL ?
						self._interval * validPosition / self._barElementWidth :
						self._interval * validPosition / self._barElementHeight;

				ui.handlerElement.classList.add(classes.SLIDER_HANDLER_ACTIVE);
				self._setValue(value);
				self._active = true;
			};

			/**
			 * DragEnd event handler
			 * @method _onDragend
			 * @param {Event} event
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._onDragend = function(event) {
				var ui = this._ui;
				ui.handlerElement.classList.remove(classes.SLIDER_HANDLER_ACTIVE);
				this._active = false;
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
				var self = this;
				unbindEvents();
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
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Slider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
