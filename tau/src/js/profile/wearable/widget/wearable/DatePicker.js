/*global window, define*/
/*jslint nomen: true */

(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/widget/BaseWidget",
			"./NumberPicker",
			"../wearable"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				utilsEvents = ns.event,
				NumberPicker = ns.widget.wearable.NumberPicker,
				prototype = new BaseWidget(),

				WIDGET_CLASS = "ui-date-picker",
				classes = {
					MONTH_CONTAINER: WIDGET_CLASS + "-container-month",
					DAY_CONTAINER: WIDGET_CLASS + "-container-day",
					YEAR_CONTAINER: WIDGET_CLASS + "-container-year",
					DAYNAME_CONTAINER: WIDGET_CLASS + "-containter-dayname",
					ACTIVE_LABEL_ANIMATION: WIDGET_CLASS + "-active-label-animation"
				},

				DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

				WIDGET_SELECTOR = "." + WIDGET_CLASS;

			function DatePicker() {
				var self = this;

				self._ui = {
					monthDisplay: null,
					monthInput: null,

					dayDisplay: null,
					dayInput: null,
					dayNameContainer: null,

					yearDisplay: null,
					yearInput: null,

					footer: null
				};

				self._activeSelector = null;
			}

			prototype._init = function () {
				var self = this,
					initialDate = new Date();

				self._setValue(initialDate);
			};

			prototype._bindEvents = function () {
				var self = this,
					ui = self._ui;

				utilsEvents.on(ui.monthDisplay, "click", self, true);
				utilsEvents.on(ui.dayDisplay, "click", self, true);
				utilsEvents.on(ui.yearDisplay, "click", self, true);
				utilsEvents.on(document, "rotarydetent", self, true);
			};

			prototype._unbindEvents = function () {
				var self = this,
					ui = self._ui;

				utilsEvents.off(ui.monthDisplay, "click", self, true);
				utilsEvents.off(ui.dayDisplay, "click", self, true);
				utilsEvents.off(ui.yearDisplay, "click", self, true);
				utilsEvents.off(document, "rotarydetent", self, true);
			};

			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					footer = document.createElement("footer"),
					buttonSet = document.createElement("button"),
					monthContainer = self._createContainter("Month", 12),
					dayContainer = self._createContainter("Day", 31),
					yearContainer = self._createContainter("Year", 2999),
					dayNameContainer = document.createElement("div");

				// create button set
				buttonSet.innerHTML = "SET";
				// add classes
				element.classList.add(NumberPicker.classes.CONTAINER);
				buttonSet.classList.add("ui-btn", NumberPicker.classes.BUTTON_SET);
				footer.classList.add("ui-footer", "ui-bottom-button", "ui-fixed");

				monthContainer.classList.add(classes.MONTH_CONTAINER);
				dayContainer.classList.add(classes.DAY_CONTAINER);
				yearContainer.classList.add(classes.YEAR_CONTAINER);
				dayNameContainer.classList.add(classes.DAYNAME_CONTAINER);

				// build DOM structure
				element.appendChild(monthContainer);
				element.appendChild(dayContainer);
				element.appendChild(yearContainer);
				element.appendChild(dayNameContainer);
				element.appendChild(footer);

				footer.appendChild(buttonSet);

				ui.dayNameContainer = dayNameContainer;
				ui.footer = footer;

				return element;
			};

			prototype._createContainter = function (name, maxValue) {
				var self = this,
					ui = self._ui,
					number = document.createElement("span"),
					numberPickerInput = document.createElement("input"),
					numberPickerLabel = document.createElement("label"),
					numberPickerContainer = document.createElement("div");

				number.classList.add(NumberPicker.classes.NUMBER);
				numberPickerLabel.classList.add(NumberPicker.classes.LABEL);
				numberPickerInput.setAttribute("type", "number");

				numberPickerLabel.innerText = name;
				numberPickerInput.max = maxValue;

				numberPickerInput.min = "1";
				numberPickerInput.step = "1";

				numberPickerContainer.appendChild(numberPickerLabel);
				numberPickerContainer.appendChild(number);
				numberPickerContainer.appendChild(numberPickerInput);

				switch (name) {
					case "Month":
						ui.monthInput = numberPickerInput;
						ui.monthDisplay = number;
						break;
					case "Day":
						ui.dayInput = numberPickerInput;
						ui.dayDisplay = number;
						break;
					case "Year":
						ui.yearInput = numberPickerInput;
						ui.yearDisplay = number;
						break;
				}

				return numberPickerContainer;
			};

			prototype._setValue = function (value) {
				var self = this,
					ui = self._ui,
					monthElement = ui.monthDisplay,
					monthInput = ui.monthInput,
					dayElement = ui.dayDisplay,
					dayInput = ui.dayInput,
					yearElement = ui.yearDisplay,
					yearInput = ui.yearInput,
					dayNameElement = ui.dayNameContainer,
					day = value.getDate(),
					year = value.getFullYear(),
					dayName = DAY_NAMES[value.getDay()];

				monthElement.innerHTML = MONTH_NAMES[value.getMonth()];
				monthInput.value = value.getMonth() + 1;

				dayElement.innerHTML = day;
				dayInput.value = day;
				dayInput.max = self._daysInMonth(year, value.getMonth());
				dayNameElement.innerHTML = dayName;

				yearElement.innerHTML = year;
				yearInput.value = year;
			};

			prototype._getValue = function () {
				var self = this,
					ui = self._ui,
					monthInput = ui.monthInput,
					dayInput = ui.dayInput,
					yearInput = ui.yearInput;

				return new Date(yearInput.value, monthInput.value - 1, dayInput.value);
			};

			prototype._daysInMonth = function (year, month) {
				return new Date(year, month + 1, 0).getDate();
			};

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

			prototype._onClick = function (event) {
				var self = this,
					animationClass = classes.ACTIVE_LABEL_ANIMATION,
					ui = self._ui,
					target = event.target,
					parentClassList = target.parentElement.classList,
					monthClassList = ui.monthDisplay.classList,
					dayClassList = ui.dayDisplay.classList,
					yearClassList = ui.yearDisplay.classList;

				if (parentClassList.contains(classes.MONTH_CONTAINER)) {
					self._activeSelector = "month";
					monthClassList.add(animationClass);
					dayClassList.remove(animationClass);
					yearClassList.remove(animationClass);

				} else if (parentClassList.contains(classes.DAY_CONTAINER)) {
					self._activeSelector = "day";
					dayClassList.add(animationClass);
					monthClassList.remove(animationClass);
					yearClassList.remove(animationClass);

				} else if (parentClassList.contains(classes.YEAR_CONTAINER)) {
					self._activeSelector = "year";
					yearClassList.add(animationClass);
					dayClassList.remove(animationClass);
					monthClassList.remove(animationClass);
				}
			};

			prototype._destroy = function () {
				var self = this,
					element = self.element;

				self._unbindEvents();
				element.removeAllChildren();
			};

			prototype._onRotary = function (event) {
				var self = this,
					value = self.value(),
					month = value.getMonth(),
					newMonth,
					day = value.getDate(),
					year = value.getFullYear();

				switch (self._activeSelector) {
					case "month":
						if (event.detail.direction === "CW") {
							newMonth = month + 1;
						} else {
							newMonth = month - 1;
						}
						value.setMonth(newMonth);
						if (year !== value.getFullYear()) {
							value.setFullYear(year);
						}
						if (day > self._daysInMonth(year, newMonth) &&
							(self._daysInMonth(year, month) > self._daysInMonth(year, newMonth))) {
							value = new Date(year, newMonth, self._daysInMonth(year, newMonth));
						}
						self._setValue(value);
						break;

					case "day":
						if (event.detail.direction === "CW") {
							value.setDate(day + 1);
							if (month !== value.getMonth()) {
								value.setMonth(month);
							}
							if (year !== value.getFullYear()) {
								value.setFullYear(year);
							}
						} else {
							if (day === 1) {
								value.setDate(self._daysInMonth(year, month));
							} else {
								value.setDate(day - 1);
							}
						}
						self._setValue(value);
						break;

					case "year":
						if (event.detail.direction === "CW") {
							value.setFullYear(year + 1);
						} else {
							value.setFullYear(year - 1);
						}
						if ((month === 1) && (self._daysInMonth(year, 1) > self._daysInMonth(value.getFullYear(), 1))) {
							value.setMonth(1);
							value.setDate(self._daysInMonth(value.getFullYear(), 1));
						}
						self._setValue(value);
						break;
				}
			};

			DatePicker.prototype = prototype;
			DatePicker.prototype.constructor = DatePicker;

			ns.widget.wearable.DatePicker = DatePicker;

			ns.engine.defineWidget(
				"DatePicker",
				WIDGET_SELECTOR,
				[],
				DatePicker,
				""
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return DatePicker;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, window.tau));