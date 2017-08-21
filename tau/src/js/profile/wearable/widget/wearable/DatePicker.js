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
			"./CircleIndicator",
			"../wearable"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
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
					dayDisplay: null,
					dayNameContainer: null,
					yearDisplay: null,
					footer: null
				};

				self.options = {
					min: 0,
					max: 12,
					step: 1,
					disabled: false
				};

				self._circleIndicatorSupporter = null;
				self._activeSelector = null;
				self._rotation = 0;
			}

			prototype._init = function () {
				var self = this,
					initialDate = new Date();

				self._setValue(initialDate);
				self._showMonthIndicator();
				self._setIndicatorValue(initialDate.getMonth());
			};

			prototype._bindEvents = function () {
				var self = this,
					ui = self._ui;

				utilsEvents.on(ui.monthDisplay, "click", self, true);
				utilsEvents.on(ui.dayDisplay, "click", self, true);
				utilsEvents.on(ui.yearDisplay, "click", self, true);
				utilsEvents.on(document, "rotarydetent", self, true);
				utilsEvents.on(document, "mousewheel", self, true);
				utilsEvents.on(ui.buttonSet, "click", self, true);
			};

			prototype._unbindEvents = function () {
				var self = this,
					ui = self._ui;

				utilsEvents.off(ui.monthDisplay, "click", self, true);
				utilsEvents.off(ui.dayDisplay, "click", self, true);
				utilsEvents.off(ui.yearDisplay, "click", self, true);
				utilsEvents.off(document, "rotarydetent", self, true);
				utilsEvents.off(ui.buttonSet, "click", self, true);
			};

			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					footer = document.createElement("footer"),
					buttonSet = document.createElement("button"),
					monthContainer = self._createContainter("month", 12),
					dayContainer = self._createContainter("day", 31),
					yearContainer = self._createContainter("year", 2999),
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

				ui.buttonSet = buttonSet;
				ui.dayNameContainer = dayNameContainer;
				ui.footer = footer;

				self._buildIndicator(element);
				return element;
			};

			prototype._buildIndicator = function (element) {
				var circleIndicator = this._circleIndicator,
					indicator = document.createElement("div");

				if (circleIndicator) {
					circleIndicator.destroy();
					circleIndicator.element.parentElement.removeChild(circleIndicator.element);
				}

				element.appendChild(indicator);

				circleIndicator = engine.instanceWidget(indicator, "CircleIndicator", {
					text: "none",
					circleR: 0,
					from: 0,
					to: 12,
					indicatorType: "line",
					indicatorHeight: 21,
					indicatorColor: "rgba(249,123,47,1)",
					indicatorWidth: 6,
					indicatorR: 180,

					bigTick: 1,
					bigTickColor: "#848484",
					bigTickR: 180,
					bigTickHeight: 20,
					bigTickWidth: 1,

					smallTickColor: "#848484",
					smallTick: 0,
					smallTickR: 180,
					smallTickHeight: 10,
					smallTickWidth: 1
				});

				this._circleIndicator = circleIndicator;
			};

			prototype._showMonthIndicator = function () {
				this._circleIndicator.option({
					to: 12,
					bigTick: 1,
					bigTickHeight: 20,
					smallTick: 0
				});
			};

			prototype._showDayIndicator = function (number) {
				this._circleIndicator.option({
					to: number,
					bigTickHeight: 13,
					bigTick: 2,
					smallTick: 1
				});
			};

			prototype._showYearIndicator = function () {
				this._circleIndicator.option({
					to: 50,
					bigTickHeight: 13,
					bigTick: 5,
					smallTick: 1
				});
			};

			prototype._setIndicatorValue = function (value) {
				this._circleIndicator.value(value);
			};

			prototype._createContainter = function (name) {
				var self = this,
					ui = self._ui,
					number = document.createElement("span"),
					numberPickerLabel = document.createElement("label"),
					numberPickerContainer = document.createElement("div");

				number.classList.add(NumberPicker.classes.NUMBER);
				numberPickerLabel.classList.add(NumberPicker.classes.LABEL);

				numberPickerLabel.innerText = name;

				numberPickerContainer.appendChild(numberPickerLabel);
				numberPickerContainer.appendChild(number);

				ui[name + "Display"] = number;

				return numberPickerContainer;
			};

			prototype._setValue = function (value) {
				var self = this,
					ui = self._ui,
					monthElement = ui.monthDisplay,
					dayElement = ui.dayDisplay,
					yearElement = ui.yearDisplay,
					dayNameElement = ui.dayNameContainer,
					day = value.getDate(),
					year = value.getFullYear(),
					dayName = DAY_NAMES[value.getDay()];

				monthElement.innerHTML = MONTH_NAMES[value.getMonth()];
				self._monthValue = value.getMonth() + 1;

				dayElement.innerHTML = day;
				self._dayValue = day;
				dayNameElement.innerHTML = dayName;

				yearElement.innerHTML = year;
				self._yearValue = year;
			};

			prototype._getValue = function () {
				var self = this;

				return new Date(self._yearValue, self._monthValue - 1, self._dayValue);
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
					case "mousewheel":
						event.preventDefault();
						self._onRotary(event);
						break;
				}
			};

			prototype._onClick = function (event) {
				var self = this,
					value = self.value(),
					animationClass = classes.ACTIVE_LABEL_ANIMATION,
					ui = self._ui,
					target = event.target,
					indicatorValue,
					rotation = self._rotation,
					daysInMonth,
					parentClassList = target.parentElement.classList,
					monthClassList = ui.monthDisplay.classList,
					dayClassList = ui.dayDisplay.classList,
					yearClassList = ui.yearDisplay.classList;

				if (parentClassList.contains(classes.MONTH_CONTAINER)) {
					self._activeSelector = "month";
					monthClassList.add(animationClass);
					dayClassList.remove(animationClass);
					yearClassList.remove(animationClass);
					self._showMonthIndicator();
					indicatorValue = value.getMonth() + 1;
					indicatorValue += rotation * 12;
					self._setIndicatorValue(indicatorValue);
				} else if (parentClassList.contains(classes.DAY_CONTAINER)) {
					self._activeSelector = "day";
					dayClassList.add(animationClass);
					monthClassList.remove(animationClass);
					yearClassList.remove(animationClass);
					daysInMonth = self._daysInMonth(value.getFullYear(), value.getMonth());
					self._showDayIndicator(daysInMonth);
					indicatorValue = value.getDate();
					indicatorValue += rotation * daysInMonth;
					self._setIndicatorValue(indicatorValue);
				} else if (parentClassList.contains(classes.YEAR_CONTAINER)) {
					self._activeSelector = "year";
					yearClassList.add(animationClass);
					dayClassList.remove(animationClass);
					monthClassList.remove(animationClass);
					self._showYearIndicator();
					indicatorValue = value.getFullYear() % 50;
					indicatorValue += rotation * 50;
					self._setIndicatorValue(indicatorValue);
				} else if (target.classList.contains("ui-number-picker-set")) {
					self.trigger("change", {
						value: self.value()
					});
					history.back();
				}
			};

			prototype._destroy = function () {
				this._unbindEvents();
				this.element.innerHTML = "";
			};

			prototype._onRotary = function (event) {
				var self = this,
					value = self.value(),
					month = value.getMonth(),
					newValue,
					indicatorValue,
					day = value.getDate(),
					year = value.getFullYear(),
					rotation = self._rotation,
					circleValue,
					direction = event.detail.direction;

				if (event.deltaY > 0) {
					direction = "CW";
				}

				switch (self._activeSelector) {
					case "month":
						if (direction === "CW") {
							newValue = month + 1;
						} else {
							newValue = month - 1;
						}
						value.setMonth(newValue);
						if (year !== value.getFullYear()) {
							value.setFullYear(year);
						}
						if (day > self._daysInMonth(year, newValue) &&
							(self._daysInMonth(year, month) > self._daysInMonth(year, newValue))) {
							value = new Date(year, newValue, self._daysInMonth(year, newValue));
						}
						indicatorValue = value.getMonth() + 1;
						newValue += 1;
						circleValue = 12;
						break;
					case "day":
						if (direction === "CW") {
							newValue = day + 1;
							value.setDate(day + 1);
							if (month !== value.getMonth()) {
								value.setMonth(month);
							}
							if (year !== value.getFullYear()) {
								value.setFullYear(year);
							}
						} else {
							newValue = day - 1;
							if (day === 1) {
								value.setDate(self._daysInMonth(year, month));
							} else {
								value.setDate(day - 1);
							}
						}
						indicatorValue = value.getDate();
						circleValue = self._daysInMonth(year, month);
						break;
					case "year":
						if (direction === "CW") {
							newValue = year % 50 + 1;
							value.setFullYear(year + 1);
						} else {
							newValue = year % 50 - 1;
							value.setFullYear(year - 1);
						}
						if ((month === 1) && (self._daysInMonth(year, 1) > self._daysInMonth(value.getFullYear(), 1))) {
							value.setMonth(1);
							value.setDate(self._daysInMonth(value.getFullYear(), 1));
						}
						indicatorValue = value.getFullYear() % 50;
						circleValue = 50;
						break;
				}
				self._setValue(value);
				if (indicatorValue !== newValue) {
					if (direction === "CW") {
						rotation++;
					} else {
						rotation--;
					}
				}
				indicatorValue += rotation * circleValue;
				self._setIndicatorValue(indicatorValue);
				self._rotation = rotation;
			};

			DatePicker.prototype = prototype;
			DatePicker.prototype.constructor = DatePicker;

			ns.widget.wearable.DatePicker = DatePicker;

			engine.defineWidget(
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
