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
 *			<input type="time" name="time-1" id="time-1" value="">
 *		</form>
 *
 * ## Manual constructor
 * For manual creation of TimeInput widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<form>
 *			<label for="time-2">Time Input:</label>
 *			<input type="time" name="time-2" id="time-2" value="">
 *		</form>
 *		<script>
 *			var inputElement = document.getElementById("time-2"),
 *				timeInput = tau.widget.TimeInput(inputElement);
 *		</script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*.
 *
 * @class ns.widget.tv.TimeInput
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
				TimeInput = function () {
					var self = this;
					BaseWidget.call(self);
					BaseKeyboardSupport.call(self);
					self._callbacks = {
						onBlur: null
					};
					self._ui = {
						wrapper: null,
						hours: null,
						minutes: null,
						seconds: null,
						overlay: null,
						placeholder: null
					};
					self.options = {
						showInLightBox: true,
						active: false,
						usePlaceholder: true
					};
					self._hours = null;
					self._minutes = null;
					self._seconds = null;
					self._first = null;
					self._last = null;
				},
				/**
				 * Dictionary for textinput related css class names
				 * @property {Object} classes
				 * @member ns.widget.tv.TimeInput
				 * @static
				 */
				classes = {
					timeInput: "ui-time-input",
					focus: "ui-time-input-focus",
					active: "ui-time-input-active",
					hours: "ui-time-input-hours",
					minutes: "ui-time-input-minutes",
					seconds: "ui-time-input-seconds",
					disabled: "ui-disabled",
					placeholder: "ui-time-input-placeholder"
				},
				KEY_CODES = BaseKeyboardSupport.KEY_CODES,
				prototype = new BaseWidget(),
				selector = "input[type='time']",
				TIME_REGEXP = /[0-9]{2}:[0-9]{2}:[0-9]{2}/;

			//TimeInput.events = MobileTextInput.events;
			TimeInput.classes = classes;
			TimeInput.prototype = prototype;
			TimeInput.selector = selector;

			/**
			 * Method adds span to input.
			 * @method wrap
			 * @param {TimeInput} self
			 * @param {EventTarget|HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.tv.TimeInput
			 */
			function wrap(self, element) {
				var wrapper = document.createElement("div"),
					parent = element.parentNode,
					hours = document.createElement("input"),
					minutes,
					placeholder = document.createElement("div"),
					ui = self._ui,
					currentTime = new Date(),
					seconds;

				utilDOM.setAttributes(hours, {
					"placeholder": "00",
					"type": "number",
					"min": 0,
					"max": 23,
					"step": 1,
					"data-loop": true,
					"value": element.getAttribute("placeholder") ||
						currentTime.getHours()
				});
				minutes = hours.cloneNode(false);
				utilDOM.setAttributes(minutes, {
					"max": 59,
					"value": element.getAttribute("placeholder") ||
						currentTime.getMinutes()
				});
				seconds = minutes.cloneNode(false);
				utilDOM.setAttributes(seconds, {
					"value": element.getAttribute("placeholder") ||
					currentTime.getSeconds()
				});

				hours.classList.add(classes.hours);
				minutes.classList.add(classes.minutes);
				seconds.classList.add(classes.seconds);

				wrapper.classList.add(classes.timeInput);
				placeholder.classList.add(classes.placeholder);

				wrapper.setAttribute("tabindex", 0);
				if (self.options.usePlaceholder) {
					placeholder.appendChild(wrapper);
					parent.replaceChild(placeholder, element);
				} else {
					parent.replaceChild(wrapper, element);
				}

				wrapper.appendChild(hours);
				wrapper.appendChild(minutes);
				wrapper.appendChild(seconds);

				wrapper.appendChild(element);

				self._hours = ns.engine.instanceWidget(
						hours, "SpinControl", {
							deactivateOnExit: false,
							showInLightBox: false,
							usePlaceholder: false
						});
				self._minutes = ns.engine.instanceWidget(
						minutes, "SpinControl", {
							deactivateOnExit: false,
							showInLightBox: false,
							usePlaceholder: false
						});
				self._seconds = ns.engine.instanceWidget(
						seconds, "SpinControl", {
							deactivateOnExit: false,
							showInLightBox: false,
							usePlaceholder: false
						});

				ui.wrapper = wrapper;
				ui.hours = hours;
				ui.minutes = minutes;
				ui.seconds = seconds;
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
			 * @param {ns.widget.tv.TimeInput} self
			 * @private
			 * @static
			 * @member ns.widget.tv.TimeInput
			 */
			function unwrap(self) {
				var ui = self._ui,
					wrapper = ui.wrapper;

				wrapper.parentNode.replaceChild(self.element, ui.wrapper);
				wrapper.innerHTML = "";
			}

			function onFocus(self, ev) {
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

				self.saveKeyboardSupport();
				self.disableKeyboardSupport();
				wrapper.classList.add(classes.active);
				wrapper.removeAttribute("tabindex");
				self._showOverlay();
				self._hours.enableFocus();
			}

			function disable(self) {
				var wrapper = self._ui.wrapper;

				self.enableKeyboardSupport();
				self.restoreKeyboardSupport();
				self._hideOverlay();
				wrapper.classList.remove(classes.active);
				self._hours.disableFocus();
				self._minutes.disableFocus();
				self._seconds.disableFocus();
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

					self._seconds.setActive(active);
					self._minutes.setActive(active);
					self._hours.setActive(active);

					if (active) {
						enable(self);
					} else {
						disable(self);
					}
					options.active = active;
				}
			};

			function onActive(self) {
				if (!self.options.active) {
					if (event._originalEvent && event._originalEvent.keyCode === KEY_CODES.enter) {
						events.stopImmediatePropagation(event);
					}
					self.setActive(true);
				}
			}

			function updateVisibleValue(self, value) {
				var parsedTime;

				if (typeof value === "string") {
					parsedTime = value.match(TIME_REGEXP);
					if (parsedTime.length) {
						self._hours.value(parsedTime[1]);
						self._minutes.value(parsedTime[2]);
						self._seconds.value(parsedTime[3]);
					}
				}
			}

			function onKeyDown(self, event) {
				switch (event.keyCode) {
					case KEY_CODES.tab:
						switch (event.target) {
							case self._first._ui.wrapper:
									if (event.shiftKey) {
										events.stopImmediatePropagation(event);
										self._exit();
									}
								break;
							case self._last._ui.wrapper:
									if (!event.shiftKey) {
										events.stopImmediatePropagation(event);
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
			 * @member ns.widget.tv.TimeInput
			 */
			function onKeyUp(self, event) {
				switch (event.keyCode) {

					case KEY_CODES.left:
						switch (event.target) {
							case self._minutes._ui.wrapper:
								self._hours.enableFocus();
								break;
							case self._seconds._ui.wrapper:
								self._minutes.enableFocus();
								break;
						}
						break;
					case KEY_CODES.right:
						switch (event.target) {
							case self._hours._ui.wrapper:
								self._minutes.enableFocus();
								break;
							case self._minutes._ui.wrapper:
								self._seconds.enableFocus();
								break;
						}
						events.stopImmediatePropagation(event);
						break;

					case KEY_CODES.enter:
						if (self.options.active) {
							if (!self._hours._insertNumberMode &&
								!self._minutes._insertNumberMode &&
								!self._seconds._insertNumberMode) {
									self._exit();
							}
						}
						break;
				}
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
			 * @member ns.widget.tv.TimeInput
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

				wrapper.addEventListener("blur", callbacks.onBlur, true);
				wrapper.addEventListener("vclick", callbacks.onActive, true);
				wrapper.addEventListener("focus", callbacks.onFocus, true);
				wrapper.addEventListener("keyup", callbacks.onKeyUp, true);
				wrapper.addEventListener("keydown", callbacks.onKeyDown, true);
			};

			/**
			 * Unbind events
			 * @method _unbindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.TimeInput
			 */
			prototype._unbindEvents = function() {
				var element = this.element,
					self = this,
					callbacks = this._callbacks,
					ui = self._ui,
					wrapper = ui.wrapper;

				wrapper.removeEventListener("blur", callbacks.onBlur, true);
				wrapper.removeEventListener("vclick", callbacks.onActive, true);
				wrapper.removeEventListener("focus", callbacks.onFocus, true);
				wrapper.removeEventListener("keyup", callbacks.onKeyUp, true);
				wrapper.removeEventListener("keydown", callbacks.onKeyDown, true);
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
			 * @member ns.widget.tv.TimeInput
			 */
			prototype._init = function(element) {
				var self = this,
					ui = self._ui,
					wrapper;

				element.value = element.getAttribute("placeholder") ||
							new Date().toTimeString().match(TIME_REGEXP)[0];

				if (ui.wrapper === null) {
					// find widget components: html elements
					wrapper = self.element.parentElement;
					ui.wrapper = wrapper;
					ui.hours = wrapper.querySelector("." + classes.hours);
					ui.minutes = wrapper.querySelector("." + classes.minutes);
					ui.seconds = wrapper.querySelector("." + classes.seconds);
					// widgets
					self._hours = ns.engine.instanceWidget(
						ui.hours, "SpinControl");
					self._minutes = ns.engine.instanceWidget(
						ui.minutes, "SpinControl");
					self._seconds = ns.engine.instanceWidget(
						ui.seconds, "SpinControl");
				}

				self._first = self._hours;
				self._last = self._seconds;
			};

			/**
			 * Destroys additional elements created by the widget,
			 * removes classes and event listeners
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.TimeInput
			 */
			prototype._destroy = function(element) {
				var self = this;

				self._hideOverlay();
				self._unbindEvents();

				self._hours.destroy();
				self._minutes.destroy();
				self._seconds.destroy();

				self._hours = null;
				self._minutes = null;
				self._seconds = null;
				self._first = null;
				self._last = null;

				unwrap(self, element);
			};

			widget.tv.TimeInput = TimeInput;

			engine.defineWidget(
				"TimeInput",
				selector,
				[],
				TimeInput,
				"tv"
			);

			BaseKeyboardSupport.registerActiveSelector("." + classes.timeInput);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.TimeInput;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
