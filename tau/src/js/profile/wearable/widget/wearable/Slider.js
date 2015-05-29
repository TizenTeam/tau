/*global window, define */
/*jslint nomen: true */
/**
 * # Slider Widget
 * Wearable Slider component has two types, first is normal slider type another is circle slider type.
 * Circle slider type has provided to rotary event handling in component side.
 * Normal slider type is default type.
 *
 * ## Default selectors
 *
 * To add a slider component to the application, use the following code:
 *
 *      @example
 *      // Normal type
 *      <input id="circle" data-type="normal" name="circleSlider" type="range" value="20" min="0" max="100" />
 *
 *      // OR Circle type
 *      <input id="circle" data-type="circle" name="circleSlider" type="range" value="20" min="0" max="100" />
 *
 * ## JavaScript API
 *
 * Slider widget hasn't JavaScript API.
 * @class ns.widget.wearable.Slider
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/widget/core/Slider",
			"./CircleProgressBar",
			"../../../../core/engine",
			"../../../../core/util/object",
			"../../../../core/event"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreSlider = ns.widget.core.Slider,
				CoreSliderPrototype = CoreSlider.prototype,
				engine = ns.engine,
				events = ns.event,
				CirclePB = ns.widget.wearable.CircleProgressBar,
				CirclePBPrototype = new CirclePB(),
				Slider = function () {
					var self = this;
					CoreSlider.call(self);
				},
				prototype = new CoreSlider();

			Slider.prototype = prototype;

			function bindCircleEvents(self) {
				events.on(document, "rotarydetent", self, false);
			}

			function unbindCircleEvents(self) {
				events.off(document, "rotarydetent", self, false);
			}

			/**
			 * Configure Slider widget
			 * @method _configure
			 * @protected
			 * @member ns.widget.wearable.Slider
			 */
			prototype._configure = function() {
				var self = this,
					options = self.options;

				options.size = "full";
			};

			/**
			 * Build Slider widget
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Slider
			 */
			prototype._build = function(element) {
				var self = this,
					options = self.options;

				if (options.type === "circle") {
					element.style.display = "none";
					CirclePBPrototype._build.call(self, element);
				} else {
					CoreSliderPrototype._build.call(self, element);
				}
				return element;
			};

			/**
			 * Init Slider widget
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Slider
			 */
			prototype._init = function(element) {
				var self = this,
					options = self.options;

				if (options.type === "circle") {
					CirclePBPrototype._init.call(self, element);
				} else {
					CoreSliderPrototype._init.call(self, element);
				}
				return element;
			};

			/**
			 * Bind events Slider widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.wearable.Slider
			 */
			prototype._bindEvents = function() {
				var self = this,
					options = self.options;

				if (options.type === "circle") {
					bindCircleEvents(self);
				} else {
					CoreSliderPrototype._bindEvents.call(self);
				}
			};

			/**
			 * Bind event handlers
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype.handleEvent = function(event) {
				var self = this,
					options = self.options;

				if (options.type === "circle") {
					switch (event.type) {
						case "rotarydetent":
							self._onRotary(event);
							break;
					}
				} else {
					CoreSliderPrototype.handleEvent.call(self, event);
				}
			};

			/**
			 * Rotarydetent event handler
			 * @method _onRotary
			 * @param {Event} event
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype._onRotary = function(event) {
				var self = this,
					direction = event.detail.direction,
					value = CirclePBPrototype._getValue.call(self);

				if (direction === "CW") {
					if (value < self._maxValue) {
						value++;
					} else {
						value = self._maxValue;
					}
				} else if (direction === "CCW") {
					if (value > 0) {
						value--;
					} else {
						value = 0;
					}
				}
				CirclePBPrototype._setValue.call(self, value);
			};

			/**
			 * Get/set slider value
			 * @method value
			 * @param {Number} value
			 * @member ns.widget.wearable.Slider
			 * @public
			 */
			prototype.value = function(value) {
				var self = this,
					options = self.options,
					result;

				if (options.type === "circle") {
					if (value) {
						CirclePBPrototype._setValue.call(self, value);
					} else {
						result = CirclePBPrototype._getValue.call(self);
					}
				} else {
					result = CoreSliderPrototype.value.call(self, value);
				}
				if (result) {
					return result;
				}
			};

			/**
			 * Destroy Slider component
			 * @method _destroy
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					options = self.options;

				if (options.type === "circle") {
					unbindCircleEvents(self);
					self._ui = null;
					self._options = null;
				} else {
					CoreSliderPrototype._destroy.call(self);
				}
			};

			ns.widget.wearable.Slider = Slider;
			engine.defineWidget(
				"Slider",
				"input[data-role='slider'], input[type='range'], input[data-type='range']",
				[
					"value"
				],
				Slider,
				"wearable",
				true
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.Slider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
