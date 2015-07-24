/*global window, define, ns */
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
/*jslint nomen: true, plusplus: true */
/**
 * #Time Input Widget
 * Decorator for inputs type number elements.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - INPUT with type "number"
 *
 * ###HTML Examples
 *
 * ####Create simple spin control on INPUT element
 *
 *		@example
 *		<form>
 *			<label for="spin-1">Time Input</label>
 *			<input type="date" name="date-1" id="date-1" value="">
 *		</form>
 *
 * ## Manual constructor
 * For manual creation of DateInput widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<form>
 *			<label for="date-2">Time Input:</label>
 *			<input type="date" name="date-2" id="date-2" value="">
 *		</form>
 *		<script>
 *			var inputElement = document.getElementById("date-2"),
 *				dateInput = tau.widget.DateInput(inputElement);
 *		</script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*.
 *
 * @class ns.widget.tv.DateInput
 * @extends ns.widget.core.BaseWidget
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/util/object",
			"../../../core/util/DOM/attributes",
			"../../../core/event",
			"../../../core/widget/BaseWidget",
			"../../../profile/tv/widget/SpinControl",
			"./BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var widget = ns.widget,
				BaseWidget = widget.BaseWidget,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				SpinControl = ns.widget.tv.SpinControl,
				engine = ns.engine,
				events = ns.event,
				utilDOM = ns.util.DOM,
				DateInput = function () {
					var self = this;
					BaseWidget.call(self);
					BaseKeyboardSupport.call(self);
					self._callbacks = {
						onBlur: null
					};
					self._ui = {
						wrapper: null,
						day: null,
						month: null,
						year: null,
						overlay: null,
						placeholder: null
					};
					self.options = {
						showInLightBox: true,
						minYear: 1900,
						maxYear: 2100,
						active: false,
						usePlaceholder: true
					};
					self._day = null;
					self._month = null;
					self._year = null;
				},
				/**
				 * Dictionary for textinput related css class names
				 * @property {Object} classes
				 * @member ns.widget.tv.DateInput
				 * @static
				 */
				classes = {
					dateInput: "ui-date-input",
					focus: "ui-date-input-focus",
					active: "ui-date-input-active",
					day: "ui-date-input-day",
					month: "ui-date-input-month",
					year: "ui-date-input-year",
					disabled: "ui-disabled",
					placeholder: "ui-date-input-placeholder"
				},
				KEY_CODES = BaseKeyboardSupport.KEY_CODES,
				prototype = new BaseWidget(),
				selector = "input[type='date']",
				DATE_REGEXP = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;

			DateInput.classes = classes;
			DateInput.prototype = prototype;
			DateInput.selector = selector;

			/**
			 * Method adds span to input.
			 * @method wrap
			 * @param {DateInput} self
			 * @param {EventTarget|HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.tv.DateInput
			 */
			function wrap(self, element) {
				var wrapper = document.createElement("div"),
					parent = element.parentNode,
					day = document.createElement("input"),
					month,
					placeholder = document.createElement("div"),
					year,
					currentDate = new Date(),
					ui = self._ui;

				utilDOM.setAttributes(day, {
					"placeholder": "00",
					"type": "number",
					"min": 1,
					"max": 31,
					"step": 1,
					"data-loop": true,
					"value": currentDate.getDate()
				});
				month = day.cloneNode();
				utilDOM.setAttributes(month, {
					"max": 12,
					"value": currentDate.getMonth() + 1
				});
				year = month.cloneNode();
				utilDOM.setAttributes(year, {
					"min": self.options.minYear,
					"max": self.options.maxYear,
					"value": currentDate.getFullYear()
				});

				day.classList.add(classes.day);
				month.classList.add(classes.month);
				year.classList.add(classes.year);

				wrapper.classList.add(classes.dateInput);
				placeholder.classList.add(classes.placeholder);

				wrapper.setAttribute("tabindex", 0);
				if (self.options.usePlaceholder) {
					placeholder.appendChild(wrapper);
					parent.replaceChild(placeholder, element);
				} else {
					parent.replaceChild(wrapper, element);
				}

				wrapper.appendChild(day);
				wrapper.appendChild(month);
				wrapper.appendChild(year);

				wrapper.appendChild(element);

				self._day = ns.engine.instanceWidget(
						day, "SpinControl", {
							deactivateOnExit: false,
							showInLightBox: false,
							usePlaceholder: false
						});
				self._month = ns.engine.instanceWidget(
						month, "SpinControl", {
							deactivateOnExit: false,
							showInLightBox: false,
							usePlaceholder: false
						});
				self._year = ns.engine.instanceWidget(
						year, "SpinControl", {
							deactivateOnExit: false,
							showInLightBox: false,
							usePlaceholder: false
						});

				ui.wrapper = wrapper;
				ui.day = day;
				ui.month = month;
				ui.year = year;
				ui.placeholder = placeholder;
			}

			function checkDisable(element) {
				if (element.hasAttribute("disabled")) {
					element.setAttribute("aria-disabled", true);
					element.classList.add(classes.disabled);
				} else {
					element.setAttribute("aria-disabled", false);
				}
			}

			/**
			 * Method removes span from input.
			 * @method unwrap
			 * @param {ns.widget.tv.DateInput} self
			 * @private
			 * @static
			 * @member ns.widget.tv.DateInput
			 */
			function unwrap(self) {
				var ui = self._ui;

				ui.wrapper.parentNode.replaceChild(self.element, ui.wrapper);
				ui.wrapper.innerHTML = "";
			}

			function onFocus(self) {
				if (!self.options.active) {
					if (!self._ui.wrapper.classList.contains(classes.focus)) {
						self._ui.wrapper.classList.add(classes.focus);
					}
				}
			}

			function removeFocus(self) {
				if (self._ui.wrapper) {
					self._ui.wrapper.classList.remove(classes.focus);
				}
			}

			function onBlur(self) {
				if (!self.options.active) {
					removeFocus(self);
				}
			}

			prototype._exit = function () {
				var self = this;

				if (self.options.active) {
					self.setActive(false);
				} else {
					removeFocus(self);
				}
			};

			prototype._showOverlay = function () {
				var self = this,
					ui = self._ui,
					overlay = ui.overlay,
					parent;

				if (self.options.showInLightBox && overlay === null) {
					overlay = SpinControl.prototype._createOverlay.call(this);
					parent = self.options.usePlaceholder ? ui.placeholder : ui.wrapper;
					parent.parentNode.appendChild(overlay);
					self._ui.overlay = overlay;
				}
			};

			prototype._onClickOverlay = function () {
				this._exit();
			};

			prototype._hideOverlay = function () {
				SpinControl.prototype._hideOverlay.call(this);
			};

			prototype.enablePlaceholder = function () {
				SpinControl.prototype.enablePlaceholder.call(this);
			};

			prototype.disablePlaceholder = function () {
				SpinControl.prototype.disablePlaceholder.call(this);
			};

			function enable(self) {
				var wrapper = self._ui.wrapper;

				wrapper.classList.add(classes.active);
				self.saveKeyboardSupport();
				self.disableKeyboardSupport();
				wrapper.removeAttribute("tabindex", 0);
				self._showOverlay();
				self._day.enableFocus();
			}

			function disable(self) {
				var wrapper = self._ui.wrapper;

				self._hideOverlay();
				wrapper.classList.remove(classes.active);
				self.enableKeyboardSupport();
				self.restoreKeyboardSupport();
				self._day.disableFocus();
				self._month.disableFocus();
				self._year.disableFocus();
				wrapper.setAttribute("tabindex", 0);
			}

			prototype.setActive = function (active) {
				var self = this,
					options = self.options;

				if (options.active !== active) {

					if (options.usePlaceholder) {
						if (options.active) {
							self.disablePlaceholder();
						} else {
							self.enablePlaceholder();
						}
					}

					self._year.setActive(active);
					self._month.setActive(active);
					self._day.setActive(active);

					if (active) {
						enable(self);
					} else {
						disable(self);
					}
					options.active = active;
				}
			};

			function onActive(self, ev) {
				if (!self.options.active) {
					if (event._originalEvent && event._originalEvent.keyCode === KEY_CODES.enter) {
						events.stopImmediatePropagation(event);
					}
					self.setActive(true);
				}
			}

			function updateVisibleValue(self, value) {
				var parsedDate;

				if (typeof value === "string") {
					parsedDate = value.match(DATE_REGEXP);
					if (parsedDate.length) {
						self._day.value(parsedDate[3]);
						self._month.value(parsedDate[2]);
						self._year.value(parsedDate[1]);
					}
				}
			}

			function onKeyDown(self, event) {
				switch (event.keyCode) {
					case KEY_CODES.tab:
						switch (event.target) {
							case self._first._ui.wrapper:
									if (event.shiftKey) {
										self._exit();
									}
								break;
							case self._last._ui.wrapper:
									if (!event.shiftKey) {
										self._exit();
									}
								break;
						}
						break;
				}
			}

			/**
			 * Method on keyup event.
			 * @method onKeyup
			 * @param {TextInput} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.DateInput
			 */
			function onKeyUp(self, event) {
				switch (event.keyCode) {
					case KEY_CODES.left:
						switch (event.target) {
							case self._month._ui.wrapper:
								self._day.enableFocus();
								break;
							case self._year._ui.wrapper:
								self._month.enableFocus();
								break;
						}
						events.stopImmediatePropagation(event);
						break;
					case KEY_CODES.right:
						switch (event.target) {
							case self._day._ui.wrapper:
								self._month.enableFocus();
								break;
							case self._month._ui.wrapper:
								self._year.enableFocus();
								break;
						}
						events.stopImmediatePropagation(event);
						break;

					case KEY_CODES.enter:
						if (self.options.active) {
							if (!self._day._insertNumberMode &&
								!self._month._insertNumberMode &&
								!self._year._insertNumberMode) {
								self._exit();
							}
						}
						break;
				}
			}

			function onMonthChange(self) {
				var numberOfDays = new Date();

				numberOfDays.setFullYear(self._year.value());
				numberOfDays.setMonth(self._month.value()); // setMonth accept number from 0 (january) to 11
				numberOfDays.setDate(1);
				numberOfDays.setHours(12);
				numberOfDays.setTime(numberOfDays.getTime() - 16 * 60 * 60 * 1000); // previous day

				self._day.option("max", numberOfDays.getDate());
			}

			prototype._getValue = function () {
				return this.element.value;
			};

			prototype._setValue = function (value) {
				var element = this.element;

				element.value = value;
				updateVisibleValue(this, element.value);
				events.trigger(element, "input");
			};

			/**
			 * Bind events
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.DateInput
			 */
			prototype._bindEvents = function() {
				var element = this.element,
					self = this,
					callbacks = this._callbacks,
					ui = self._ui,
					wrapper = ui.wrapper;

				callbacks.onBlur = onBlur.bind(null, self);
				callbacks.onActive = onActive.bind(null, self);
				callbacks.onFocus = onFocus.bind(null, self);
				callbacks.onKeyUp = onKeyUp.bind(null, self);
				callbacks.onKeyDown = onKeyDown.bind(null, self);
				callbacks.onMonthChange = onMonthChange.bind(null, self);

				wrapper.addEventListener("blur", callbacks.onBlur, true);
				wrapper.addEventListener("vclick", callbacks.onActive, true);
				wrapper.addEventListener("focus", callbacks.onFocus, true);
				wrapper.addEventListener("keyup", callbacks.onKeyUp, true);
				wrapper.addEventListener("keydown", callbacks.onKeyDown, true);

				ui.month.addEventListener("input", callbacks.onMonthChange, true);
				ui.year.addEventListener("input", callbacks.onMonthChange, true);
			};

			/**
			 * Unbind events
			 * @method _unbindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.DateInput
			 */
			prototype._unbindEvents = function(element) {
				var element = this.element,
					self = this,
					callbacks = this._callbacks,
					ui = self._ui,
					wrapper = ui.wrapper;

				wrapper.removeEventListener("focus", callbacks.onFocus);
				wrapper.removeEventListener("blur", callbacks.onBlur);
				wrapper.removeEventListener("keyup", callbacks.onKeyUp, true);
				wrapper.removeEventListener("vclick", callbacks.onActive);
				wrapper.removeEventListener("keydown", callbacks.onKeyDown, true);

				ui.month.removeEventListener("input", callbacks.onMonthChange, true);
				ui.year.removeEventListener("input", callbacks.onMonthChange, true);
			};

			prototype._build = function (element) {
				checkDisable(element);
				wrap(this, element);
				return element;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.DateInput
			 */
			prototype._init = function(element) {
				var self = this,
					ui = self._ui,
					wrapper;

				element.value = element.getAttribute("placeholder") ||
							new Date().toISOString().match(DATE_REGEXP)[0];

				if (ui.wrapper === null) {
					ui = self._ui;
					// find widget components: html elements
					wrapper = self.element.parentElement;
					ui.wrapper = wrapper;
					ui.day = wrapper.querySelector(classes.day);
					ui.month = wrapper.querySelector(classes.month);
					ui.year = wrapper.querySelector(classes.year);
					// widgets
					self._day = ns.engine.instanceWidget(
						ui.day, "SpinControl");
					self._month = ns.engine.instanceWidget(
						ui.month, "SpinControl");
					self._year = ns.engine.instanceWidget(
						ui.year, "SpinControl");
				}

				self._first = self._day;
				self._last = self._year;
			};

			/**
			 * Destroys additional elements created by the widget,
			 * removes classes and event listeners
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.DateInput
			 */
			prototype._destroy = function(element) {
				var self = this;

				self._hideOverlay();
				self._unbindEvents();

				self._day.destroy();
				self._month.destroy();
				self._year.destroy();

				self._day = null;
				self._month = null;
				self._year = null;
				self._first = null;
				self._last = null;

				unwrap(self);
			};

			widget.tv.DateInput = DateInput;

			engine.defineWidget(
				"DateInput",
				selector,
				[],
				DateInput,
				"tv"
			);

			BaseKeyboardSupport.registerActiveSelector("." + classes.dateInput);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.DateInput;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
