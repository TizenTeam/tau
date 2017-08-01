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
/* global window, define */
/**
 * #TimePicker Widget
 *
 * @class ns.widget.wearable.TimePicker
 * @since 4.0
 * @extends ns.widget.wearable.NumberPicker
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"../../../../core/widget/BaseWidget",
			"../../../../core/event",
			"./NumberPicker",
			"./CircleIndicator"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var /**
				 * @property {Object} engine
				 * @member ns.widget.core.NumberPicker
				 * @private
				 * @static
				 */
				utilsEvents = ns.event,
				NumberPicker = ns.widget.wearable.NumberPicker,
				prototype = Object.create(NumberPicker.prototype),

				WIDGET_CLASS = "ui-time-picker",
				classes = {
					HOURS_CONTAINER: WIDGET_CLASS + "-container-hours",
					MINUTES_CONTAINER: WIDGET_CLASS + "-container-minutes",
					AMPM_CONTAINER: WIDGET_CLASS + "-container-ampm",
					COLON: WIDGET_CLASS + "-colon-container",
					AMPM: WIDGET_CLASS + "-am-pm",
					NO_AMPM: WIDGET_CLASS + "-no-am-pm"
				},
				WIDGET_SELECTOR = "." + WIDGET_CLASS;

			function TimePicker() {
				var self = this;

				// other widgets instances using by number picker
				self._circleIndicator = null;
				// widget will just draw minutes on the board
				self._circleIndicatorSupporter = null;

				NumberPicker.call(self);
			}

			/**
			 * Collect attributes of input element when widget is creating
			 * @protected
			 * @method _configure
			 * @member ns.widget.core.TimePicker
			 */
			prototype._configure = function () {
				var options = this.options;

				options.circleType = "none";
				options.circleR = 0;

				options.from = 0;
				options.to = 360;

				options.bigTick = 30;
				options.bigTickR = 180;
				options.bigTickHeight = 14;
				options.bigTickWidth = 3;

				options.smallTick = 1;
				options.smallTickR = 180;
				options.smallTickHeight = 7;

				options.display24 = options.display24 || true;
			};

			/**
			 * Init method
			 * @protected
			 * @method _init
			 * @member ns.widget.core.TimePicker
			 * @protected
			 */
			prototype._init = function () {
				var self = this,
					ui = self._ui,
					initDate = new Date();

				//set the initial hours value, based on time stamp
				self._setValue(initDate);

				utilsEvents.on(ui.numberHours, "click", self, true);
				utilsEvents.on(ui.numberMinutes, "click", self, true);
			};

			/**
			 * Build widget instance
			 * @param {HTMLElement} element
			 * @protected
			 * @method _build
			 * @member ns.widget.core.TimePicker
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					footer = null,
					amPmBlock = null,
					indicator = document.createElement("div"),
					indicatorMinutes = document.createElement("div"),
					buttonSet = document.createElement("button"),
					numberPickerColon = document.createElement("span"),
					numberPickerHoursContainer = self._addIndicator("Hours"),
					numberPickerColonContainer = document.createElement("div"),
					numberPickerMinutesContainer = self._addIndicator("Minutes");

				footer = self._findFooter(element);

				// create button set
				buttonSet.innerHTML = "SET";
				// add classes
				element.classList.add(NumberPicker.classes.CONTAINER);
				buttonSet.classList.add("ui-btn");
				buttonSet.classList.add(NumberPicker.classes.BUTTON_SET);

				numberPickerHoursContainer.classList.add(classes.HOURS_CONTAINER);

				numberPickerColonContainer.classList.add(classes.COLON) ;
				numberPickerMinutesContainer.classList.add(classes.MINUTES_CONTAINER);
				numberPickerColon.innerHTML = ":";
				// build DOM structure
				element.appendChild(numberPickerHoursContainer);
				element.appendChild(numberPickerColonContainer);
				element.appendChild(numberPickerMinutesContainer);
				numberPickerColonContainer.appendChild(numberPickerColon);
				if (!self.options.display24) {
					amPmBlock = document.createElement("div");
					amPmBlock.classList.add(classes.AMPM_CONTAINER);
					amPmBlock.innerText = "AM";
					element.appendChild(amPmBlock);
					numberPickerHoursContainer.classList.add(classes.AMPM);
				} else {
					numberPickerHoursContainer.classList.add(classes.NO_AMPM);
				}
				element.appendChild(indicatorMinutes);
				element.appendChild(indicator);
				// add "set" button to the footer
				footer.appendChild(buttonSet);

				// main indicator used for both hours, minutes inputs
				ui.indicator = indicator;
				ui.indicatorMinutes = indicatorMinutes;
				// footer elements
				ui.buttonSet = buttonSet;
				ui.footer = footer;

				//add circular background with minutes on the scale
				self._createBackgroundScaleForMinutes();
				// Create widget, defined by Number Picker
				self._createWidgets();

				return element;
			};

			/**
			 * Method for click event
			 *
			 * Becasue "prepare drag" is run every time when we press handler
			 * we need to use "click" to revert changes done by "prepare drag"
			 * Click is not called if we start drag
			 * @method _click
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.TimePicker
			 */
			prototype._click = function (event) {
				var self = this,
					labelTarget = event.target,
					currentValue = parseInt(labelTarget.textContent, 10);

				///if (labelTarget.classList.contains())
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @public
			 * @param {Event} event Event
			 * @member ns.widget.wearable.TimePicker
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "click":
						event.preventDefault();
						self._click(event);
						break;
				}
			};

			/**
			 * Create dependent widgetes
			 * @method _createWidgets
			 * @member ns.widget.core.NumberPicker
			 * @protected
			 */
			prototype._createBackgroundScaleForMinutes = function () {
				var self = this,
					ui = self._ui,
					options = self.options;

				self._circleIndicatorSupporter = ns.widget.CircleIndicator(ui.indicatorMinutes, {
					text: "none",
					circleR: 0,
					from: 0,
					to: 360,
					indicatorType: "line",
					indicatorHeight: 0,
					indicatorWidth: 0,
					indicatorR: 0,

					bigTick: 6,
					bigTickR: options.bigTickR,
					bigTickHeight: 14,
					bigTickWidth: 2
				});
			};

			/**
			 * Build DOM for Hours and Minutes number picker
			 * @param {string} name
			 * @protected
			 * @method _addIndicator
			 * @member ns.widget.core.TimePicker
			 */
			prototype._addIndicator = function (name) {
				var self = this,
					ui = self._ui,
					number = document.createElement("span"),
					numberPickerInput = document.createElement("input"),
					numberPickerLabel = document.createElement("label"),
					numberPickerContainer = document.createElement("div");

				number.classList.add(NumberPicker.classes.NUMBER);
				numberPickerLabel.classList.add(NumberPicker.classes.LABEL);

				//prepare dom for inputs
				if (name === "Hours") {
					numberPickerLabel.innerText = "Hrs";
					if (self.options.display24) {
						numberPickerInput.max = "24";
					} else {
						numberPickerInput.max = "12";
					}
				} else if (name === "Minutes") {
					numberPickerLabel.innerText = "Mins";
					numberPickerInput.max = "60";
				}
				numberPickerInput.type = "number";
				numberPickerInput.min = "0";
				numberPickerInput.step = "1";
				numberPickerInput.value = "0";
				numberPickerContainer.appendChild(numberPickerLabel);
				numberPickerContainer.appendChild(number);
				numberPickerContainer.appendChild(numberPickerInput);

				ui["number" + name] = number;
				ui["label" + name] = numberPickerLabel;
				ui["numberPicker" + name + "Input"] = numberPickerInput;
				ui["numberPicker" + name + "Container"] = numberPickerContainer;

				return numberPickerContainer;
			};

			/**
			 * Set value of number picker
			 * @param {number} value
			 * @protected
			 * @method _setValue
			 * @member ns.widget.core.TimePicker
			 */
			prototype._setValue = function (value) {
				var self = this,
					ui = self._ui,
					element = self.element,
					options = self.options;

				if (value instanceof Date) {
					ui.numberPickerHoursInput.setAttribute("value", value.getHours() > 12 ? value.getHours() - 12 : value.getHours());
					ui.numberPickerHoursInput.value = value.getHours() > 12 ? value.getHours() - 12 : value.getHours();
					ui.numberPickerMinutesInput.setAttribute("value", value.getMinutes());
					ui.numberPickerMinutesInput.value = value.getMinutes();
					ui.numberHours.innerHTML = value.getHours() > 12 ? value.getHours() - 12 : value.getHours();
					ui.numberMinutes.innerHTML = value.getMinutes();
					//by default set the indicator on hours value
					self._updateValue(ui.numberPickerHoursInput.value);
				} else {
					value = parseInt(value, 10);
					value = Math.max(Math.min(value, options.max), options.min);

					element.setAttribute("value", value);
					element.value = value;

					self._updateValue(element.value);
				}
			};

			/**
			 * Update visual representation of value of number picker
			 * @param {number} value
			 * @protected
			 * @method _updateValue
			 * @member ns.widget.core.TimePicker
			 */
			prototype._updateValue = function (value) {
				var self = this,
					delta = self.options.max - self.options.min;

				/**
				 * Cirecle indicator showing radius value.
				 * Number Picker value has to be calculated as proportion of full angle
				 */
				if (delta > 0) {
					self._circleIndicator.value(360 * value / delta);
				} else {
					self._circleIndicator.value(0);
				}
			};

			prototype._toggle = function () {
			};
			/**
			 * Destroy widget instance
			 * @protected
			 * @method _destroy
			 * @member ns.widget.core.TimePicker
			 */
			prototype._destroy = function () {
			};

			/**
			 * Bind widget event handlers
			 * @protected
			 * @method _bindEvents
			 * @member ns.widget.core.TimePicker
			 */
			prototype._bindEvents = function () {
			};

			/**
			 * Unbind widget event handlers
			 * @protected
			 * @method _unbindEvents
			 * @member ns.widget.core.TimePicker
			 */
			prototype._unbindEvents = function () {
			};

			TimePicker.prototype = prototype;
			TimePicker.prototype.constructor = TimePicker;

			// definition
			ns.widget.wearable.TimePicker = TimePicker;
			ns.engine.defineWidget(
				"TimePicker",
				WIDGET_SELECTOR,
				[],
				TimePicker,
				""
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return TimePicker;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, window.tau));
