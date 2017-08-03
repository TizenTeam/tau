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
 *      <div class="ui-time-picker" data-display24="false">
 *
 * #### 24 hours format
 * To add a timepicker widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-time-picker" data-display24="true">
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
					HIDE_PM_ANIMATION: WIDGET_CLASS + "-hide-pm"
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
				utilsEvents.on(ui.amOrPmContainer, "click", self, true);
				utilsEvents.on(document, "rotarydetent", self, true);
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
					amPmInnerContainer = null,
					amSpan = null,
					pmSpan = null,
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
					element.appendChild(amPmBlock);
					numberPickerHoursContainer.classList.add(classes.AMPM);

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
					self._ui.amOrPmContainer = amPmBlock;


				} else {
					numberPickerHoursContainer.classList.add(classes.NO_AMPM);

				}
				element.appendChild(indicatorMinutes);
				element.appendChild(indicator);
				footer.appendChild(buttonSet);

				// main indicator used for both hours, minutes inputs
				ui.indicator = indicator;
				ui.indicatorMinutes = indicatorMinutes;
				// footer elements
				ui.buttonSet = buttonSet;
				ui.footer = footer;

				//add circular background with minutes on the scale
				self._createBackgroundScaleForMinutes();
				// Create circle widget, defined by Number Picker,
				// main indicator will work on this widget
				self._createWidgets();

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
					currentValue = 0,
					activeInput = null,
					activeNumberType = null,
					activeNumber = document.querySelector("." + classes.ACTIVE_LABEL);


				if (activeNumber) {
					activeNumber.classList.remove(classes.ACTIVE_LABEL_ANIMATION);
					activeInput = activeNumber.parentElement.children[2];
					activeNumberType = activeInput.parentElement.classList.contains(classes.HOURS_CONTAINER) ? "hours" : "minutes"

					if (event.detail.direction === "CW") {
						currentValue = parseInt(activeInput.value, 10);
						if (activeNumberType === "hours") {
							if (currentValue === 12) {
								currentValue = 0;
								activeInput.value = 0;
							}
						}
						if (activeNumberType === "minutes") {
							if (currentValue === 60) {
								activeInput.value = 0;
								currentValue = 0;
							}
						}
						self.value(currentValue + self.options.step);
					} else {
						currentValue = parseInt(activeInput.value, 10);
						if (activeNumberType === "hours") {
							if (currentValue === 0) {
								currentValue = 12;
								activeInput.value = 12;
							}
						}
						if (activeNumberType === "minutes") {
							if (currentValue === 0) {
								activeInput.value = 60;
								currentValue = 60;
							}
						}
						self.value(currentValue - self.options.step);
					}
				}
			};

			/**
			 * Method for click event
			 *
			 * @method _click
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.TimePicker
			 */
			prototype._click = function (event) {
				var self = this,
					ui = self._ui,
					eventTargetElement = event.target,
					uiNumberHours = ui.numberHours,
					uiNumberMinutes = ui.numberMinutes,
					uiInputHours = ui.numberPickerHoursInput,
					uiAmPmContainer = ui.amOrPmContainer,
					currentValue = parseInt(eventTargetElement.textContent, 10);

				//hours
				if (eventTargetElement.parentElement.classList.contains(classes.HOURS_CONTAINER)) {
					uiNumberHours.classList.add(classes.ACTIVE_LABEL);
					uiNumberMinutes.classList.remove(classes.ACTIVE_LABEL);
					uiNumberHours.classList.add(classes.ACTIVE_LABEL_ANIMATION);
					uiNumberMinutes.classList.remove(classes.ACTIVE_LABEL_ANIMATION);
					self._actualMax = parseInt(uiInputHours.max, 10);
					// move indicator to the selected hours value
					self._updateValue(currentValue);
				//minutes
				} else if (eventTargetElement.parentElement.classList.contains(classes.MINUTES_CONTAINER)) {
					uiNumberHours.classList.remove(classes.ACTIVE_LABEL);
					uiNumberMinutes.classList.add(classes.ACTIVE_LABEL);
					uiNumberHours.classList.remove(classes.ACTIVE_LABEL_ANIMATION);
					uiNumberMinutes.classList.add(classes.ACTIVE_LABEL_ANIMATION);
					self._actualMax = 60;
					// move indicator to the selected minutes value
					self._updateValue(currentValue);
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
						self._click(event);
						break;
					case "rotarydetent":
						event.preventDefault();
						self._onRotary(event);
						break;
				}
			};

			/**
			 * Add instance of CircleIndicator class which will represent minutes scale
			 *
			 * @method _createBackgroundScaleForMinutes
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
					getHoursValue = 0,
					activeInput = null,
					getMinutesValue = 0,
					activeNumber = null,
					activeNumberType;

				if (value instanceof Date) {
					getHoursValue = value.getHours();
					getMinutesValue = value.getMinutes();
					if (!self.options.display24) {
						if (getHoursValue > 12) {
							getHoursValue -= 12;
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
					///value = Math.max(Math.min(value, self._actualMax), options.min);
					activeNumber = document.querySelector("." + classes.ACTIVE_LABEL);
					if (activeNumber) {
						activeInput = activeNumber.parentElement.children[2];
						activeNumberType = activeInput.parentElement.classList.contains(classes.HOURS_CONTAINER) ? "hours" : "minutes"
						// fix for minutes, we don't display 60 but 0
						if (activeNumberType === "minutes" && value === 60) {
							value = 0;
						}
						// fix for hours, we don't display 0 but 12
						if (activeNumberType === "hours" && value === 0) {
							value = 12;
						}
						activeInput.setAttribute("value", value);
						activeInput.value = value;
						activeNumber.innerHTML = activeInput.value;
						self._updateValue(activeInput.value);
					}

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
					delta = parseInt(self._actualMax, 10) - self.options.min;

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

				// destroy widgets
				self._circleIndicator.destroy();
				self._circleIndicatorSupporter.destroy();

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
			};

			/**
			 * Unbind widget event handlers override NumberPicker to not call
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
