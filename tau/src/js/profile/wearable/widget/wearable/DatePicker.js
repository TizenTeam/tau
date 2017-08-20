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
					CONTAINER_PREFIX: WIDGET_CLASS + "-container-",
					DAYNAME_CONTAINER: WIDGET_CLASS + "-containter-dayname",
					ACTIVE_LABEL_ANIMATION: WIDGET_CLASS + "-active-label-animation"
				},

				DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				WIDGET_SELECTOR = "." + WIDGET_CLASS,
				INDICATOR_OPTIONS = {
					month: {
						to: 12,
						bigTick: 1,
						bigTickHeight: 20,
						smallTick: 0
					},
					year: {
						to: 50,
						bigTickHeight: 13,
						bigTick: 5,
						smallTick: 1
					},
					day: {
						to: 30,
						bigTickHeight: 13,
						bigTick: 2,
						smallTick: 1
					}
				},
				CONTAINERS = ["month", "day", "year"];

			function DatePicker() {
				var self = this;

				self._ui = {
					display: {},
					dayNameContainer: null,
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
				this._setValue(new Date());
				this._setActiveSelector("month");
			};

			prototype._bindEvents = function () {
				var self = this,
					ui = self._ui;

				Object.keys(ui.display).forEach(function (name) {
					utilsEvents.on(ui.display[name], "click", self, true);
				});
				utilsEvents.on(document, "rotarydetent", self, true);
				utilsEvents.on(ui.buttonSet, "click", self, true);
			};

			prototype._unbindEvents = function () {
				var self = this,
					ui = self._ui;

				Object.keys(ui.display).forEach(function (name) {
					utilsEvents.off(ui.display[name], "click", self, true);
				});
				utilsEvents.off(document, "rotarydetent", self, true);
				utilsEvents.off(ui.buttonSet, "click", self, true);
			};

			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					footer = document.createElement("footer"),
					buttonSet = document.createElement("button"),
					dayNameContainer = document.createElement("div");

				// create button set
				buttonSet.innerHTML = "SET";
				// add classes
				element.classList.add(NumberPicker.classes.CONTAINER);
				buttonSet.classList.add("ui-btn", NumberPicker.classes.BUTTON_SET);
				footer.classList.add("ui-footer", "ui-bottom-button", "ui-fixed");

				dayNameContainer.classList.add(classes.DAYNAME_CONTAINER);

				// build DOM structure
				CONTAINERS.forEach(function (name) {
					element.appendChild(self._createContainter(name));
				});

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

			prototype._showIndicator = function (type, number) {
				var options = INDICATOR_OPTIONS[type];

				if (number) {
					options.to = number;
				}
				this._circleIndicator.option(options);
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

				numberPickerLabel.innerText = name[0].toUpperCase() + name.substr(1);

				numberPickerContainer.appendChild(numberPickerLabel);
				numberPickerContainer.appendChild(number);
				numberPickerContainer.classList.add(classes.CONTAINER_PREFIX + name);

				ui.display[name] = number;

				return numberPickerContainer;
			};

			prototype._setValue = function (value) {
				var self = this,
					ui = self._ui,
					dayName = DAY_NAMES[value.getDay()];

				self._value = value;

				Object.keys(ui.display).forEach(function (name) {
					ui.display[name].innerHTML = self._getTextValue(name);
				});

				ui.dayNameContainer.innerHTML = dayName;
			};

			prototype._getValue = function (type) {
				var value = this._value;

				switch (type) {
					case "month":
						return value.getMonth() + 1;
					case "day":
						return value.getDate();
					case "year":
						return value.getFullYear();
					default:
						return value;
				}
			};

			prototype._getTextValue = function (type) {
				var value = this._value;

				switch (type) {
					case "month":
						return MONTH_NAMES[value.getMonth()];
					case "day":
						return value.getDate();
					case "year":
						return value.getFullYear();
					default:
						return value;
				}
			};

			prototype._getIndicatorValue = function (type) {
				var value = this._value;

				switch (type) {
					case "month":
						return value.getMonth() + 1;
					case "day":
						return value.getDate();
					case "year":
						return value.getFullYear() % 50;
					default:
						return value;
				}
			};


			prototype._daysInMonth = function (year, month) {
				if (year === undefined) {
					year = this._getValue("year");
				}
				if (month === undefined) {
					month = this._getValue("month") - 1;
				}
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

			prototype._getCircleValue = function (activeName) {
				switch (activeName) {
					case "month":
						return 12;
					case "day":
						return this._daysInMonth();
					case "year":
						return 50;
				}
			};

			prototype._setActiveSelector = function (activeName) {
				var self = this,
					animationClass = classes.ACTIVE_LABEL_ANIMATION,
					ui = self._ui,
					rotation = self._rotation,
					indicatorValue = self._getIndicatorValue(activeName),
					circleValue = self._getCircleValue(activeName);

				self._showIndicator(activeName, circleValue);
				self._activeSelector = activeName;
				Object.keys(ui.display).forEach(function (name) {
					ui.display[name].classList.remove(animationClass);
				});
				ui.display[activeName].classList.add(animationClass);
				indicatorValue += rotation * circleValue;
				self._setIndicatorValue(indicatorValue);
			};

			prototype._onClick = function (event) {
				var self = this,
					target = event.target,
					parentClassName = target.parentElement.className,
					activeName = parentClassName.replace(classes.CONTAINER_PREFIX, "");

				if (CONTAINERS.indexOf(activeName) > -1) {
					self._setActiveSelector(activeName);
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

			prototype._changeMonth = function (changeValue) {
				var self = this,
					value = self.value(),
					month = value.getMonth(),
					newValue,
					day = value.getDate(),
					year = value.getFullYear(),
					daysInMonth;

				newValue = month + changeValue;
				value.setMonth(newValue);
				value.setFullYear(year);
				daysInMonth = self._daysInMonth(year, newValue);
				if (day > daysInMonth && (self._daysInMonth(year, month) > daysInMonth)) {
					value = new Date(year, newValue, daysInMonth);
				}
				// months are in range 0-11] we need add 1 to get range [1-12]
				newValue += 1;
				self._changeValue(value, newValue, value.getMonth() + 1, changeValue, 12);
			};

			prototype._changeDay = function (changeValue) {
				var self = this,
					value = self.value(),
					month = value.getMonth(),
					newValue,
					day = value.getDate(),
					year = value.getFullYear(),
					daysInMonth = self._daysInMonth(year, month);

				newValue = day + changeValue;

				if (changeValue < 0 && day === 1) {
					value.setDate(daysInMonth);
				} else {
					value.setDate(newValue);
				}
				value.setMonth(month);
				value.setFullYear(year);
				self._changeValue(value, newValue, value.getDate(), changeValue, daysInMonth);
			};

			prototype._changeYear = function (changeValue) {
				var self = this,
					value = self.value(),
					month = value.getMonth(),
					newValue,
					indicatorValue,
					year = value.getFullYear(),
					daysInMonth = self._daysInMonth(year, month);

				newValue = year % 50 + changeValue;
				value.setFullYear(year + changeValue);
				// last day in Feb case, month = 1 => Feb
				daysInMonth = self._daysInMonth(value.getFullYear(), 1);
				if ((month === 1) && (self._daysInMonth(year, 1) > daysInMonth)) {
					value.setMonth(1);
					value.setDate(daysInMonth);
				}
				indicatorValue = value.getFullYear() % 50;
				self._changeValue(value, newValue, indicatorValue, changeValue, 50);
			};

			prototype._changeValue = function (value, newValue, indicatorValue, changeValue, circleValue) {
				var self = this,
					rotation = self._rotation;

				self._setValue(value);
				if (indicatorValue !== newValue) {
					rotation += changeValue;
				}
				indicatorValue += rotation * circleValue;
				self._setIndicatorValue(indicatorValue);
				self._rotation = rotation;
			};

			prototype._onRotary = function (event) {
				var self = this,
					direction = event.detail.direction,
					changeValue;

				if (direction === "CW") {
					changeValue = 1;
				} else {
					changeValue = -1;
				}

				switch (self._activeSelector) {
					case "month":
						self._changeMonth(changeValue);
						break;
					case "day":
						self._changeDay(changeValue);
						break;
					case "year":
						self._changeYear(changeValue);
						break;
				}
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
