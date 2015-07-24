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
 * #Spin Control Widget
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
 *			<label for="spin-1">Spin Control:</label>
 *			<input type="number" name="spin-1" id="spin-1" value="">
 *		</form>
 *
 * ## Manual constructor
 * For manual creation of SpinControl widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<form>
 *			<label for="spin-2">Spin Control:</label>
 *			<input type="number" name="spin-2" id="spin-2" value="">
 *		</form>
 *		<script>
 *			var inputElement = document.getElementById("spin-2"),
 *				spinControl = tau.widget.SpinControl(inputElement);
 *		</script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*.
 *
 * @class ns.widget.tv.SpinControl
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
			"../../../core/event",
			"../../../core/widget/BaseWidget",
			"../../../core/widget/core/Popup",
			"../../../profile/mobile/widget/mobile/Button",
			"./BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var widget = ns.widget,
				BaseWidget = widget.BaseWidget,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				engine = ns.engine,
				events = ns.event,
				SpinControl = function () {
					var self = this;
					BaseWidget.call(self);

					self._callbacks = {
						onFocus: null,
						onActive: null,
						onExit: null
					};
					self._ui = {
						wrapper: null,
						number: null,
						up: null,
						down: null,
						overlay: null,
						placeholder: null
					};
					self.options = {
						loop: false,
						active: false,
						deactivateOnExit: true,
						showInLightBox: true,
						max: null,
						usePlaceholder: true,
						numberOfDigits: 0 // number of digits, default: -1 (input.max length)
					};
					self._temporaryValue = 0;
					self._insertNumberMode = false;
				},
				/**
				 * Dictionary for textinput related css class names
				 * @property {Object} classes
				 * @member ns.widget.tv.SpinControl
				 * @static
				 */
				classes = {
					disabled: widget.mobile.Button.classes.uiDisabled,
					spinControl: "ui-spin-control",
					focus: "ui-spin-control-focus",
					active: "ui-spin-control-active",
					overlay: "ui-spin-control-overlay",
					number: "ui-spin-control-number",
					placeholder: "ui-spin-control-placeholder",
					up: "up",
					down: "down"
				},
				KEY_CODES = BaseKeyboardSupport.KEY_CODES,
				NUMBER_PLACEHOLDER_CHAR = "_",
				firstCharRegExp = /[0-9]/,
				placeholderCharRegExp = /[0-9]/,
				prototype = new BaseWidget(),
				selector = "input[type='number']";

			firstCharRegExp.compile("^" + NUMBER_PLACEHOLDER_CHAR);
			placeholderCharRegExp.compile(NUMBER_PLACEHOLDER_CHAR, "g");

			SpinControl.classes = classes;
			SpinControl.prototype = prototype;
			SpinControl.selector = selector;

			/**
			 * Method adds span to input.
			 * @method wrap
			 * @param {SpinControl} self
			 * @param {EventTarget|HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.tv.SpinControl
			 */
			function wrap(self, element) {
				var focusableInputFrame = document.createElement("div"),
					parent = element.parentNode,
					up = document.createElement("div"),
					down = document.createElement("div"),
					number = document.createElement("div"),
					placeholder = document.createElement("div"),
					ui = self._ui;

				up.classList.add(classes.up);
				down.classList.add(classes.down);
				number.classList.add(classes.number);
				focusableInputFrame.classList.add(classes.spinControl);
				placeholder.classList.add(classes.placeholder);

				focusableInputFrame.setAttribute("tabindex", 0);

				if (self.options.usePlaceholder) {
					placeholder.appendChild(focusableInputFrame);
					parent.replaceChild(placeholder, element);
				} else {
					parent.replaceChild(focusableInputFrame, element);
				}

				focusableInputFrame.appendChild(up);
				focusableInputFrame.appendChild(number);
				focusableInputFrame.appendChild(element);
				focusableInputFrame.appendChild(down);

				ui.wrapper = focusableInputFrame;
				ui.number = number;
				ui.up = up;
				ui.down = down;
				ui.placeholder = placeholder;
			}

			/**
			 * Method removes span from input.
			 * @method unwrap
			 * @param {ns.widget.tv.SpinControl} self
			 * @private
			 * @static
			 * @member ns.widget.tv.SpinControl
			 */
			function unwrap(self) {
				var ui = self._ui,
					wrapper = self.options.usePlaceholder ? ui.placeholder : ui.wrapper;

				wrapper.parentNode.replaceChild(self.element, wrapper);
				wrapper.innerHTML = "";
			}

			function onFocus(self) {
				if (!self.element.hasAttribute("disabled")) {
					self.addFocusClass();
				}
			}

			function onExit(self) {
				self._exit();
			}

			function onClickOverlay(self) {
				self._onClickOverlay();
			}

			/**
			 * Handler on overlay click
			 * @method _onClickOverlay
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._onClickOverlay = function () {
				this._hideOverlay();
			};

			/**
			 * Exit from widget opposite of setActive
			 * @method _exit
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._exit = function () {
				var self = this;

				disableInsertDigit(self);

				if (self.options.deactivateOnExit) {
					self.setActive(false);
				}
				if (document.activeElement !== self._ui.wrapper) {
					self.disableFocus();
				}
			};

			/**
			 * Sets max limit of value
			 * @method _createOverlay
			 * @param {HTMLInputElement} element
			 * @param {number|string} value
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._setMax = function (element, value) {
				var min = parseInt(element.getAttribute("min"));

				if (min < value) {
					element.setAttribute("max", value);

					if (element.value > value) {
						element.value = value;
					}
					this.options.numberOfDigits = value.toFixed().length;

					this._updateVisibleValue(element.value, "0");
				}
			};

			/**
			 * Create overlay below widget
			 * @method _createOverlay
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 * @return {HTMLElement} overlay
			 */
			prototype._createOverlay = function () {
				var overlay;

				overlay = document.createElement("div");
				overlay.classList.add(classes.overlay);
				overlay.addEventListener("vclick", onClickOverlay.bind(null, this));

				return overlay;
			};

			/**
			 * Shows overlay below widget
			 * @method _showOverlay
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._showOverlay = function() {
				var self = this,
					ui = self._ui,
					options = self.options,
					wrapper;

				if (options.showInLightBox && ui.overlay === null) {
					ui.overlay = self._createOverlay();
					wrapper = options.usePlaceholder ? ui.placeholder : ui.wrapper;
					wrapper.parentElement.appendChild(ui.overlay);
				}
			};

			/**
			 * Hide overlay below widget
			 * @method _hideOverlay
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._hideOverlay = function () {
				var self = this,
					overlay = self._ui.overlay;

				if (overlay !== null && overlay.parentNode) {
					overlay.parentNode.removeChild(overlay);
					self._ui.overlay = null;
				}
			};

			/**
			 * Enables focus on widget
			 * @method disableFocus
			 * @member ns.widget.tv.SpinControl
			 */
			prototype.addFocusClass = function () {
				this._ui.wrapper.classList.add(classes.focus);
			};

			/**
			 * Remove focus classes from element
			 * @method removeFocusClass
			 * @member ns.widget.tv.SpinControl
			 */
			prototype.removeFocusClass = function () {
				var wrapper = this._ui.wrapper;

				if (wrapper) {
					wrapper.classList.remove(classes.focus);
				}
			};

			/**
			 * Enables focus on widget
			 * @method enableFocus
			 * @member ns.widget.tv.SpinControl
			 */
			prototype.enableFocus = function () {
				this.addFocusClass();
				this._ui.wrapper.focus();
			};

			/**
			 * Remove focus from widget
			 * @method disableFocus
			 * @member ns.widget.tv.SpinControl
			 */
			prototype.disableFocus = function () {
				this.removeFocusClass();
			};

			prototype.enablePlaceholder = function () {
				var wrapper = this._ui.wrapper,
					style = this._ui.placeholder.style;

				style.width = wrapper.offsetWidth + 1 + "px";
				style.height = wrapper.offsetHeight + "px";
			};

			prototype.disablePlaceholder = function () {
				var style = this._ui.placeholder.style;

				style.width = null;
				style.height = null;
			};

			/**
			 * Activates widget
			 * @method setActive
			 * @param {boolean} active
			 * @member ns.widget.tv.SpinControl
			 */
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
					if (active) {
						self._ui.wrapper.classList.add(classes.active);
						if (document.activeElement === self._ui.wrapper) {
							self.addFocusClass();
						}
						self._showOverlay();
					} else {
						self._hideOverlay();
						self._ui.wrapper.classList.remove(classes.active);
					}
					options.active = active;
				}
			};

			function onActive(self, event) {
				if (!self.options.active) {
					if (event._originalEvent && event._originalEvent.keyCode === KEY_CODES.enter) {
						events.stopImmediatePropagation(event);
					}
					self.setActive(true);
				}
			}

			/**
			 * Update visible value of widget
			 * @method _updateVisibleValue
			 * @param {*} value
			 * @param {string} emptyChar
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._updateVisibleValue = function (value, emptyChar) {
				var number = this._ui.number,
					size = this.options.numberOfDigits;

				value = typeof value === "number" ?
					value : value === "" ?
						0 : parseInt(value);
				emptyChar = emptyChar || "0";

				number.innerHTML = new Array(size - value.toFixed().length + 1).join(emptyChar) + value;
			};

			/**
			 * Handler for click on increase number value
			 * @method onUp
			 * @param {ns.widget.tv.SpinControl} self
			 * @private
			 * @member ns.widget.tv.SpinControl
			 */
			function onUp(self) {
				var element = self.element;

				if (element.value === element.max) {
					if (self.options.loop) {
						element.value = element.min;
					}
				} else {
					element.stepUp();
				}

				self._updateVisibleValue(element.value, "0");
				events.trigger(element, "input");
			}

			/**
			 * Handler for click on decrease number value
			 * @method onDown
			 * @param {ns.widget.tv.SpinControl} self
			 * @private
			 * @member ns.widget.tv.SpinControl
			 */
			function onDown(self) {
				var element = self.element;

				if (element.value === element.min) {
					if (self.options.loop) {
						element.value = element.max;
					}
				} else {
					element.stepDown();
				}

				self._updateVisibleValue(element.value, "0");
				events.trigger(element, "input");
			}

			/**
			 * Validate value entered from number keyboard
			 * @method insertDigitValidation
			 * @param {ns.widget.tv.SpinControl} self
			 * @private
			 * @member ns.widget.tv.SpinControl
			 * @return {boolean}
			 */
			function insertDigitValidation(self) {
				var element = self.element,
					value = parseInt(self._temporaryValue.replace(placeholderCharRegExp, ""));

				return parseInt(element.max, 10) >= value && parseInt(element.min, 10) <= value;
			}

			/**
			 * Confirmation of value entered from number keyboard
			 * @method insertDigitValidation
			 * @param {ns.widget.tv.SpinControl} self
			 * @private
			 * @member ns.widget.tv.SpinControl
			 */
			function insertDigitConfirm(self) {
				var element = self.element;

				if (insertDigitValidation(self)) {
					element.value = parseInt(self._temporaryValue.replace(placeholderCharRegExp, ""));
					events.trigger(element, "input");
				}
				disableInsertDigit(self);
			}

			/**
			 * Handler on insert number value from number keyboard
			 * @method insertDigitValidation
			 * @param {ns.widget.tv.SpinControl} self
			 * @private
			 * @member ns.widget.tv.SpinControl
			 */
			function insertDigit(self, digit) {
				self._insertNumberMode = true;

				if (self._temporaryValue.replace(placeholderCharRegExp, "").length >= self.options.numberOfDigits) {
					self._temporaryValue = new Array(self.options.numberOfDigits + 1).join(NUMBER_PLACEHOLDER_CHAR);
				}
				self._temporaryValue = self._temporaryValue.replace(firstCharRegExp, "") + digit;

				self._updateVisibleValue(self._temporaryValue.replace(placeholderCharRegExp, ""), NUMBER_PLACEHOLDER_CHAR);
			}

			/**
			 * Disables the number keyboard insert mode
			 * @method disableInsertDigit
			 * @param {ns.widget.tv.SpinControl} self
			 * @private
			 * @member ns.widget.tv.SpinControl
			 */
			function disableInsertDigit(self) {
				var element = self.element;

				if (self._insertNumberMode) {
					self._updateVisibleValue(element.value, "0");
					self._temporaryValue = new Array(self.options.numberOfDigits + 1).join(NUMBER_PLACEHOLDER_CHAR);
					self._insertNumberMode = false;
				}
			}

			/**
			 * Method on keyup event.
			 * @method onKeyup
			 * @param {TextInput} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.SpinControl
			 */
			function onKeyup(self, event) {
				var keyCode = event.keyCode;

				if (self.options.active) {
					switch (keyCode) {
						case KEY_CODES.up:
							disableInsertDigit(self);
							onUp(self, event);
							// we do not jump to other element
							events.stopImmediatePropagation(event);
							events.preventDefault(event);
							break;
						case KEY_CODES.down:
							disableInsertDigit(self);
							onDown(self, event);
							// we do not jump to other element
							events.stopImmediatePropagation(event);
							events.preventDefault(event);
							break;
						case KEY_CODES.left:
						case KEY_CODES.right:
							if (self._insertNumberMode) {
								disableInsertDigit(self);
							}
							// we do not jump to other element
							events.stopImmediatePropagation(event);
							break;
						case KEY_CODES.enter:
							if (self._insertNumberMode) {
								insertDigitConfirm(self);
								events.preventDefault(event);
							} else if (self.options.active) {
								self._exit();
							}
							break;
						default :
							// check num pad
							if (keyCode >= 48 && keyCode <= 57) {
								insertDigit(self, keyCode - 48);
								events.stopImmediatePropagation(event);
								events.preventDefault(event);
							}
							if (keyCode >= 96 && keyCode <= 105) {
								insertDigit(self, keyCode - 96);
								events.stopImmediatePropagation(event);
								events.preventDefault(event);
							}
					}
				}
			}

			/**
			 * Gets widget value
			 * @method _getValue
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 * @returns {string}
			 */
			prototype._getValue = function () {
				return this.element.value;
			};

			/**
			 * Sets widget value
			 * @method _setValue
			 * @param {*} value
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._setValue = function (value) {
				var element = this.element;

				element.value = parseInt(value);
				this._updateVisibleValue(element.value);
				events.trigger(element, "input");
			};

			/**
			 * Bind events
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._bindEvents = function() {
				var element = this.element,
					self = this,
					callbacks = this._callbacks,
					ui = self._ui,
					wrapper = ui.wrapper;

				callbacks.onFocus = onFocus.bind(null, self);
				callbacks.onExit = onExit.bind(null, self);
				callbacks.onActive = onActive.bind(null, self);
				callbacks.onUp = onUp.bind(null, self);
				callbacks.onDown = onDown.bind(null, self);
				callbacks.onKeyup = onKeyup.bind(null, self);

				wrapper.addEventListener("focus", callbacks.onFocus);
				wrapper.addEventListener("blur", callbacks.onExit);
				wrapper.addEventListener("keyup", callbacks.onKeyup, true);
				wrapper.addEventListener("vclick", callbacks.onActive, true);
				ui.up.addEventListener("vclick", callbacks.onUp);
				ui.down.addEventListener("vclick", callbacks.onDown);
			};

			/**
			 * Unbind events
			 * @method _unbindEvents
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._unbindEvents = function() {
				var element = this.element,
					self = this,
					callbacks = this._callbacks,
					ui = self._ui,
					wrapper = ui.wrapper;

				wrapper.removeEventListener("focus", callbacks.onFocus);
				wrapper.removeEventListener("blur", callbacks.onExit);
				wrapper.removeEventListener("keyup", callbacks.onKeyup, true);
				wrapper.removeEventListener("vclick", callbacks.onActive, true);
				ui.up.removeEventListener("vclick", callbacks.onUp);
				ui.down.removeEventListener("vclick", callbacks.onDown);
			};

			function checkDisable(element) {
				if (element.hasAttribute("disabled")) {
					element.setAttribute("aria-disabled", true);
					element.classList.add("ui-disabled");
				} else {
					element.setAttribute("aria-disabled", false);
				}
			}

			/**
			 * Build widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._build = function (element) {
				var self = this;

				element.value = element.value ||
						element.getAttribute("min") ||
						element.getAttribute("placeholder") ||
						0;

				checkDisable(element);
				wrap(self, element);

				return element;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._init = function(element) {
				var self = this;

				element.step = element.step || 1;
				self.options.numberOfDigits = self.options.numberOfDigits ||
						(element.getAttribute("max") && element.getAttribute("max").length) ||
						2;

				self._temporaryValue = new Array(self.options.numberOfDigits + 1).join(NUMBER_PLACEHOLDER_CHAR);

				self._updateVisibleValue(
					element.value ||
					element.getAttribute("placeholder")
				);
			};

			/**
			 * Destroys additional elements created by the widget,
			 * removes classes and event listeners
			 * @method _destroy
			 * @protected
			 * @member ns.widget.tv.SpinControl
			 */
			prototype._destroy = function() {
				var self = this,
					ui = self._ui;

				self._hideOverlay();
				self._unbindEvents();

				unwrap(self);

				ui.wrapper = null;
				ui.number = null;
				ui.up = null;
				ui.down = null;
				ui.overlay = null;
				ui.placeholder = null;
			};

			widget.tv.SpinControl = SpinControl;

			engine.defineWidget(
				"SpinControl",
				selector,
				[],
				SpinControl,
				"tv"
			);

			BaseKeyboardSupport.registerActiveSelector("." + classes.spinControl);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.SpinControl;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
