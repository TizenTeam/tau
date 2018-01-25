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
				self._rotation = 0;

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
				options.to = 12;
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
					initDate = new Date(),
					ui = self._ui,
					uiNumberHours = ui.numberHours,
					uiInputHours = ui.numberPickerHoursInput;

				//set the initial hours value, based on time stamp
				self._setValue(initDate);

				if (self.options.format === "H") {
					self._maxHour = 24;
				} else {
					self._maxHour = 12;
				}
				uiNumberHours.classList.add(classes.ACTIVE_LABEL);
				uiNumberHours.classList.add(classes.ACTIVE_LABEL_ANIMATION);
				self._actualMax = parseInt(uiInputHours.max, 10);
				// move indicator to the selected hours value
				self._circleIndicator.option("to", 12);
				self._updateValue(uiInputHours.value);
				self._showIndicator();
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
						if (currentValue % self._circleIndicator.options.to === 0) {
							self._rotation++;
						}
					} else {
						currentValue--;
						if ((currentValue - self._circleIndicator.options.to) % self._circleIndicator.options.to === -1) {
							self._rotation--;
						}
					}
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
					self._circleIndicator.option("to", 12);
					self._updateValue(uiInputHours.value);
				//minutes
				} else if (eventTargetElement.parentElement.classList.contains(classes.MINUTES_CONTAINER)) {
					uiNumberHours.classList.remove(classes.ACTIVE_LABEL);
					uiNumberMinutes.classList.add(classes.ACTIVE_LABEL);
					uiNumberHours.classList.remove(classes.ACTIVE_LABEL_ANIMATION);
					uiNumberMinutes.classList.add(classes.ACTIVE_LABEL_ANIMATION);
					self._actualMax = 60;
					// move indicator to the selected minutes value
					self._circleIndicator.option("to", 60);
					self._updateValue(uiInputMinutes.value);
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

			prototype._setDateValue = function (value) {
				var self = this,
					ui = self._ui,
					hours,
					minutes;

				hours = value.getHours();
				minutes = value.getMinutes();
				if (self.options.format === "h") {
					if (hours > 12) {
						hours -= 12;
						self.options.amOrPm = "PM";
					} else {
						self.options.amOrPm = "AM";
					}
				}
				ui.numberPickerHoursInput.setAttribute("value", hours);
				ui.numberPickerHoursInput.value = hours;
				ui.numberPickerMinutesInput.setAttribute("value", minutes);
				ui.numberPickerMinutesInput.value = minutes;
				ui.numberHours.innerHTML = hours;
				ui.numberMinutes.innerHTML = (minutes < 10 ? "0" : "") + minutes;

				//by default set the indicator on hours value
				self._actualMax = parseInt(ui.numberPickerHoursInput.max, 10);
				self._updateValue(hours % 12);
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
					activeInput,
					activeNumber,
					visibleValue;

				if (value instanceof Date) {
					self._setDateValue(value);
				} else {
					value = parseInt(value, 10);
					activeNumber = document.querySelector("." + classes.ACTIVE_LABEL);
					if (activeNumber) {
						activeInput = activeNumber.parentElement.children[2];
						activeInput.setAttribute("value", value);
						if (self._circleIndicator.options.to === 12) {
							visibleValue = (self._maxHour + value) % self._maxHour;
						} else {
							visibleValue = (self._circleIndicator.options.to + value) % self._circleIndicator.options.to;
						}
						self._updateValue(visibleValue % self._circleIndicator.options.to);
						if (self.options.format === "h" && self._circleIndicator.options.to === 12 && visibleValue === 0) {
							visibleValue = 12;
						}
						activeInput.value = visibleValue;
						if (self._circleIndicator.options.to === 60) {
							activeNumber.innerHTML = (visibleValue < 10 ? "0" : "") + visibleValue;
						} else {
							activeNumber.innerHTML = visibleValue;
						}
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
				var self = this;

				value = parseInt(value, 10) % self._circleIndicator.options.to;
				/**
				 * Cirecle indicator showing radius value.
				 * Number Picker value has to be calculated as proportion of full angle
				 */

				self._circleIndicator.value(value + this._rotation * self._circleIndicator.options.to);
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
				this._ui.buttonSet.removeEventListener("click", this, true);
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
