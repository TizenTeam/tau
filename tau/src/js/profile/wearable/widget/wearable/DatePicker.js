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
				NumberPicker = ns.widget.wearable.NumberPicker,
				prototype = new BaseWidget(),

				WIDGET_CLASS = "ui-date-picker",
				classes = {
					MONTH_CONTAINER: WIDGET_CLASS + "-container-month",
					DAY_CONTAINER: WIDGET_CLASS + "-container-day",
					YEAR_CONTAINER: WIDGET_CLASS + "-container-year",
					DAYNAME_CONTAINER: WIDGET_CLASS + "-containter-dayname"
				},

				WIDGET_SELECTOR = "." + WIDGET_CLASS;

			function DatePicker() {
			}

			prototype._build = function (element) {
				var self = this,
					footer = document.createElement("footer"),
					buttonSet = document.createElement("button"),
					monthContainer = self._createContainter("month"),
					dayContainer = self._createContainter("day"),
					yearContainer = self._createContainter("year"),
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

				dayNameContainer.innerHTML = "Wednesday";

				// build DOM structure
				element.appendChild(monthContainer);
				element.appendChild(dayContainer);
				element.appendChild(yearContainer);
				element.appendChild(dayNameContainer);
				element.appendChild(footer);

				footer.appendChild(buttonSet);

				return element;
			};

			prototype._createContainter = function (name) {
				var number = document.createElement("span"),
					numberPickerInput = document.createElement("input"),
					numberPickerLabel = document.createElement("label"),
					numberPickerContainer = document.createElement("div");

				number.classList.add(NumberPicker.classes.NUMBER);
				numberPickerLabel.classList.add(NumberPicker.classes.LABEL);

				switch (name) {
					case "month":
						numberPickerLabel.innerText = "Month";
						numberPickerInput.max = 12;
						number.innerHTML = "Dec";
						break;
					case "day":
						numberPickerLabel.innerText = "Day";
						numberPickerInput.max = 31;
						number.innerHTML = "20";
						break;
					case "year":
						numberPickerLabel.innerText = "Year";
						numberPickerInput.max = 2999;
						number.innerHTML = "2015";
						break;
				}

				numberPickerInput.min = "1";
				numberPickerInput.step = "1";
				numberPickerContainer.appendChild(numberPickerLabel);
				numberPickerContainer.appendChild(number);
				numberPickerContainer.appendChild(numberPickerInput);

				return numberPickerContainer;
			};

			prototype._daysInMonth = function (year, month) {
				return new Date(year, month - 1, 0);
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
