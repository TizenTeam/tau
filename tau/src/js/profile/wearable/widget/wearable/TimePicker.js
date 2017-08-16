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
 * # TimePicker Widget
 * Shows a control that can be used to set hours and minutes.
 * It support 12/24 hours format. It contains two inputs which control the values
 *
 * ## Default selectors
 *
 * Default selector for timepicker is class *ui-time-picker*
 *
 * ### HTML Examples
 *
 * #### 12 hours format
 * To add a timepicker widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-time-picker" data-format="h">
 *
 * #### 24 hours format
 * To add a timepicker widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-time-picker" data-format="H">
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
					AMPM_INNER_CONTAINER: WIDGET_CLASS + "-am-pm-inner-container",
					NO_AMPM: WIDGET_CLASS + "-no-am-pm",
					ACTIVE_LABEL: WIDGET_CLASS + "-active-label",
					ACTIVE_LABEL_ANIMATION: WIDGET_CLASS + "-active-label-animation",
					SHOW_PM_ANIMATION: WIDGET_CLASS + "-show-pm",
					HIDE_PM_ANIMATION: WIDGET_CLASS + "-hide-pm",
					DISABLE_ANIMATION: WIDGET_CLASS + "-disable-animation",
					CIRCLE_INDICATOR_BACKGROUND: WIDGET_CLASS + "-background"
				},
				WIDGET_SELECTOR = "." + WIDGET_CLASS;

			function TimePicker() {
				var self = this;

				// other widgets instances using by number picker
				self._circleIndicator = null;
				// circle indicator widget will just draw minutes on the board
				self._circleIndicatorSupporter = null;
				// hours and minutes input have different max values, holds active input max value
				self._actualMax = 0;
				// store timer id
				self.rotaryControler = 0;

				NumberPicker.call(self);
			}

			/**
			 * Collect options from DOM
			 * curently only display 24 or 12 format can be picked up
			 * @protected
			 * @method _configure
			 * @member ns.widget.core.TimePicker
			 */
			prototype._configure = function () {
				/**
				 * All possible component options
				 * @property {Object} options
				 * @property {string|Array} [options.format=["h","H"] indices format for
				 * presetnation. h is for 12H format and H is for 24H format
				 * @member ns.widget.wearable.TimePicker
				 */
				var options = this.options;

				options.circleType = "none";
				options.circleR = 0;
				options.from = 0;
				options.to = 360;
				options.format = options.format || "H";
			};

			/**
			 * Init method
			 * @method _init
			 * @member ns.widget.core.TimePicker
			 * @protected
			 */
			prototype._init = function () {
				var self = this,
					initDate = new Date();

				//set the initial hours value, based on time stamp
				self._setValue(initDate);
			};

			prototype._buildAMPM = function (numberPickerHoursContainer, element) {
				var self = this,
					ui = self._ui,
					amPmBlock,
					amSpan,
					pmSpan,
					amPmInnerContainer;

				if (self.options.format === "h") {
					amPmBlock = document.createElement("div");
					amPmBlock.classList.add(classes.AMPM_CONTAINER);
					element.appendChild(amPmBlock);

					amPmInnerContainer = document.createElement("div");
					amPmInnerContainer.classList.add(classes.AMPM_INNER_CONTAINER);
					amPmBlock.appendChild(amPmInnerContainer);

					amSpan = document.createElement("span");
					pmSpan = document.createElement("span");

					amSpan.innerHTML = "AM";
					pmSpan.innerHTML = "PM";

					amPmInnerContainer.appendChild(amSpan);
					amPmInnerContainer.appendChild(pmSpan);

					//instance variable storing information whether it is am or pm, default value is pm
					self.options.amOrPm = "AM";
					ui.amOrPmContainer = amPmBlock;
					numberPickerHoursContainer.classList.add(classes.AMPM);
				} else {
					numberPickerHoursContainer.classList.add(classes.NO_AMPM);
				}
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
					footer,
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

				self._buildAMPM(numberPickerHoursContainer, element);

				element.appendChild(indicatorMinutes);
				element.appendChild(indicator);
				footer.appendChild(buttonSet);

				// main indicator used for both hours, minutes inputs
				ui.indicator = indicator;
				ui.indicatorMinutes = indicatorMinutes;
				// footer elements
				ui.buttonSet = buttonSet;
				ui.footer = footer;

				// Create circle widget, defined by Number Picker,
				// main indicator will work on this widget
				self._createWidgets();
				self._circleIndicator.element.classList.add(classes.CIRCLE_INDICATOR_BACKGROUND);

				return element;
			};

			/**
			 * Method for rotary detent event
			 *
			 * Method sets the new value after rotary event
			 * @method _onRotary
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.TimePicker
			 */
			prototype._onRotary = function (event) {
				var self = this,
					currentValue,
					activeInput,
					activeNumber = document.querySelector("." + classes.ACTIVE_LABEL);

				if (activeNumber) {
					activeInput = activeNumber.parentElement.children[2];

					currentValue = parseInt(activeInput.value, 10);
					if (event.detail.direction === "CW") {
						currentValue++;
					} else {
						currentValue--;
					}
					activeInput.value = currentValue;
					self.value(currentValue);
				}
			};

			/**
			 * Method for click event
			 *
			 * @method _onClick
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.TimePicker
			 */
			prototype._onClick = function (event) {
				var self = this,
					ui = self._ui,
					eventTargetElement = event.target,
					uiNumberHours = ui.numberHours,
					uiNumberMinutes = ui.numberMinutes,
					uiInputHours = ui.numberPickerHoursInput,
					uiInputMinutes = ui.numberPickerMinutesInput,
					uiAmPmContainer = ui.amOrPmContainer;

				//hours
				if (eventTargetElement.parentElement.classList.contains(classes.HOURS_CONTAINER)) {
					uiNumberHours.classList.add(classes.ACTIVE_LABEL);
					uiNumberMinutes.classList.remove(classes.ACTIVE_LABEL);
					uiNumberHours.classList.add(classes.ACTIVE_LABEL_ANIMATION);
					uiNumberMinutes.classList.remove(classes.ACTIVE_LABEL_ANIMATION);
					self._actualMax = parseInt(uiInputHours.max, 10);
					// move indicator to the selected hours value
					self._updateValue(uiInputHours.value);
					self._showIndicator();
				//minutes
				} else if (eventTargetElement.parentElement.classList.contains(classes.MINUTES_CONTAINER)) {
					uiNumberHours.classList.remove(classes.ACTIVE_LABEL);
					uiNumberMinutes.classList.add(classes.ACTIVE_LABEL);
					uiNumberHours.classList.remove(classes.ACTIVE_LABEL_ANIMATION);
					uiNumberMinutes.classList.add(classes.ACTIVE_LABEL_ANIMATION);
					self._actualMax = 60;
					// move indicator to the selected minutes value
					self._updateValue(uiInputMinutes.value);
					self._showIndicator();
				//AM PM
				} else if (eventTargetElement.parentElement.classList.contains(classes.AMPM_INNER_CONTAINER)) {
					if (self.options.amOrPm === "AM") {
						uiAmPmContainer.firstElementChild.classList.remove(classes.HIDE_PM_ANIMATION);
						uiAmPmContainer.firstElementChild.classList.add(classes.SHOW_PM_ANIMATION);
						self.options.amOrPm = "PM";
					} else {
						uiAmPmContainer.firstElementChild.classList.remove(classes.SHOW_PM_ANIMATION);
						uiAmPmContainer.firstElementChild.classList.add(classes.HIDE_PM_ANIMATION);
						self.options.amOrPm = "AM";
					}
					self._hideIndicator();
				} else if (eventTargetElement.classList.contains("ui-number-picker-set")) {
					self.trigger("change", {
						value: self.value()
					});
					history.back();
				}

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
						self._onClick(event);
						break;
					case "rotarydetent":
						event.preventDefault();
						self._onRotary(event);
						break;
				}
			};

			/**
			 *
			 * @protected
			 * @method _hideIndicator
			 * @member ns.widget.core.TimePicker
			 */
			prototype._hideIndicator = function () {
				this._circleIndicator.element.querySelector(".ui-polar").style.visibility = "hidden";
			};

			/**
			 *
			 * @protected
			 * @method _showIndicator
			 * @member ns.widget.core.TimePicker
			 */
			prototype._showIndicator = function () {
				this._circleIndicator.element.querySelector(".ui-polar").style.visibility = "visible";
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
					if (self.options.format === "H") {
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

			prototype._calculateActiveNumber = function (activeInput, value) {
				var self = this,
					ui = self._ui,
					activeNumber,
					activeNumberType = activeInput.parentElement.classList.contains(classes.HOURS_CONTAINER) ? "hours" : "minutes";

				if (activeNumberType === "hours" && value % ui.numberPickerHoursInput.max === 0) {
					activeNumber.innerHTML = ui.numberPickerHoursInput.max;
					// fix for minutes, we don't display 60 but 0
				} else if (activeNumberType === "minutes" && value % 60 === 0) {
					activeNumber.innerHTML = 0;
				} else {
					if (activeNumberType === "hours") {
						if (value >= 0) {
							activeNumber.innerHTML = Math.abs(value % ui.numberPickerHoursInput.max);
						} else {
							activeNumber.innerHTML = ui.numberPickerHoursInput.max - Math.abs(value % ui.numberPickerHoursInput.max);
						}
					} else {
						if (value >= 0) {
							activeNumber.innerHTML = Math.abs(value % 60);
						} else {
							activeNumber.innerHTML = 60 - Math.abs(value % 60);
						}
					}
				}
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
					getHoursValue,
					activeInput,
					getMinutesValue,
					activeNumber;

				if (value instanceof Date) {
					getHoursValue = value.getHours();
					getMinutesValue = value.getMinutes();
					if (self.options.format === "h") {
						if (getHoursValue > 12) {
							getHoursValue -= 12;
							self.options.amOrPm = "PM";
						} else {
							self.options.amOrPm = "AM";
						}
					}
					ui.numberPickerHoursInput.setAttribute("value", getHoursValue);
					ui.numberPickerHoursInput.value = getHoursValue;
					ui.numberPickerMinutesInput.setAttribute("value", getMinutesValue);
					ui.numberPickerMinutesInput.value = getMinutesValue;
					ui.numberHours.innerHTML = getHoursValue;
					ui.numberMinutes.innerHTML = getMinutesValue;

					//by default set the indicator on hours value
					self._actualMax = parseInt(ui.numberPickerHoursInput.max, 10);
					self._updateValue(ui.numberPickerHoursInput.value);
				} else {
					value = parseInt(value, 10);
					activeNumber = document.querySelector("." + classes.ACTIVE_LABEL);
					if (activeNumber) {
						activeInput = activeNumber.parentElement.children[2];
						activeInput.setAttribute("value", value);
						activeInput.value = value;
						// fix for hours, we don't display 0 but 12
						self._calculateActiveNumber(activeInput, value);
						self._updateValue(activeInput.value);
					}

				}
			};

			/**
			 * Update inputs and circleindicator values
			 * @param {HTMLElement} activeInput
			 * @param {string} activeNumberType
			 * @protected
			 * @method _scaleInputValue
			 * @member ns.widget.core.TimePicker
			 */
			prototype._scaleInputValue = function (activeInput, activeNumberType) {
				var self = this,
					value,
					ui = self._ui,
					pointer = document.querySelector(".ui-animated");

				///disable animation
				pointer.classList.add(classes.DISABLE_ANIMATION);
				if (activeNumberType === "hours") {
					value = parseInt(activeInput.value % ui.numberPickerHoursInput.max, 10);
					if (value < 0) {
						value = parseInt(ui.numberPickerHoursInput.max, 10) + value;
					}
				} else {
					value = parseInt(activeInput.value % 60, 10);
					if (value < 0) {
						value = 60 + value;
					}
				}
				activeInput.value = value;
				self._updateValue(value);
				///enable animation
				pointer.classList.remove(classes.DISABLE_ANIMATION);
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
					max = parseInt(self._actualMax, 10),
					min = self.options.min,
					delta = max - min;

				value = parseInt(value, 10);
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

			/**
			 * Destroy widget instance
			 * @protected
			 * @method _destroy
			 * @member ns.widget.core.TimePicker
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self._ui,
					element = self.element;

				utilsEvents.off(ui.numberHours, "click", self, true);
				utilsEvents.off(ui.numberMinutes, "click", self, true);
				utilsEvents.off(document, "rotarydetent", self, true);
				if (ui.amOrPmContainer) {
					utilsEvents.off(ui.amOrPmContainer, "click", self, true);
				}

				// destroy widgets
				self._circleIndicator.destroy();

				// recovery DOM structure
				while (element.firstChild) {
					element.removeChild(element.firstChild);
				}

				ui.footer.classList.remove("ui-bottom-button");
				ui.footer.removeChild(ui.buttonSet);
			};

			/**
			 * Bind widget event handlers override NumberPicker to not call
			 * @protected
			 * @method _bindEvents
			 * @member ns.widget.core.TimePicker
			 */
			prototype._bindEvents = function () {
				var self = this,
					ui = self._ui;

				utilsEvents.on(ui.numberHours, "click", self, true);
				utilsEvents.on(ui.numberMinutes, "click", self, true);
				if (ui.amOrPmContainer) {
					utilsEvents.on(ui.amOrPmContainer, "click", self, true);
				}
				utilsEvents.on(document, "rotarydetent", self, true);

				ui.buttonSet.addEventListener("click", self, true);
			};

			/**
			 * Unbind widget event handlers override NumberPicker to not call
			 * @protected
			 * @method _unbindEvents
			 * @member ns.widget.core.TimePicker
			 */
			prototype._unbindEvents = function () {
				this._ui.buttonSet.removeEventListener("click", self, true);
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
