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
 * #Text Input
 * TextInput component is decorator for input elements.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - INPUT with type "text" or "number" or "password" or "email" or "url" or "tel" or "month" or "week" or "datetime-local" or "color" or without any
 *    type
 *  - TEXTAREA
 *  - HTML elements with class _ui-text-input_
 *
 * ###HTML Examples
 *
 * ####Create simple text input on INPUT element
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input type="text" name="text-1" id="text-1" value="">
 *		</form>
 *
 * ####Create simple text input on TEXTAREA element
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<textarea name="text-1" id="text-1"></textarea>
 *		</form>
 *
 * ####Create simple text input on INPUT element with class ui-text-input
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input name="text-1" id="text-1" class="ui-text-input">
 *		</form>
 *
 * ## Manual constructor
 * For manual creation of TextInput widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input type="search" name="text-1" id="text-1" value="">
 *		</form>
 *		<script>
 *			var inputElement = document.getElementById("text-1"),
 *				textInput = tau.widget.TextInput(inputElement);
 *		</script>
 *
 * ##Options for widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<input id="text-1" />
 *		<script>
 *			var inputElement = document.getElementById('text-1'),
 *				textInput = tau.widget.TextInput(inputElement);
 *			// textInput.methodName(argument1, argument2, ...);
 *			// for example:
 *			textInput.value("text");
 *		</script>
 *
 * @since 2.0
 * @class ns.widget.mobile.TextInput
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Piotr Kusztal <p.kusztal@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 * @author Heeju Joo <heeju.joo@samsung.com>
 */
(function (document, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/DOM",
			"../../../../core/util/object",
			"../../../../core/util/selectors",
			"../../../../core/widget/core/Button",
			"../../../../core/event",
			"./BaseWidgetMobile",
			"../mobile"
		],
		function () {
		//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				util = ns.util,
				domUtils = util.DOM,
				utilSelector = util.selectors,
				objectUtils = util.object,
				utilEvent = ns.event,

				TextInput = function () {
					var self = this;

					self.options = objectUtils.merge({}, TextInput.defaults);
					self._ui = {
						textLineElement: null,
						textClearButtonElement: null
					};
					self._callbacks = {};
				},
				buttonClasses = ns.widget.core.Button.classes,

				prototype = new BaseWidget(),

				CLASSES_PREFIX = "ui-text-input",

				/**
				 * Dictionary for TextInput related css class names
				 * @property {Object} classes
				 * @member ns.widget.mobile.TextInput
				 * @static
				 */
				classes = {
					uiTextInput: CLASSES_PREFIX,
					uiTextInputClear: CLASSES_PREFIX + "-clear",
					uiTextInputClearHidden: CLASSES_PREFIX + "-clear-hidden",
					uiTextInputClearActive: CLASSES_PREFIX + "-clear-active",
					uiTextInputTextLine: CLASSES_PREFIX + "-textline",
					uiTextInputDisabled: CLASSES_PREFIX + "-disabled",
					uiTextInputFocused: CLASSES_PREFIX + "-focused",
					HEADER_WITH_SEARCH: "ui-header-searchbar",
					SEARCHINPUT: "ui-search-input",
					HEADER: "ui-header"
				},
				/**
				 * Selector for clear button appended to TextInput
				 * @property {string} CLEAR_BUTTON_SELECTOR
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 * @readonly
				 */
				selector = {
					uiTextInput: "." + classes.uiTextInput,
					uiTextInputClearButton: "." + classes.uiTextInputClear,
					uiTextInputTextLine: "." + classes.uiTextInputTextLine
				},
				/**
				 * Object with default options
				 * @property {Object} options
				 * @property {boolean} [options.clearBtn=false] option indicates that the clear button will be shown
				 * @property {boolean} [options.textLine=true] option indicates that the text underline will be shown
				 * @member ns.widget.mobile.TextInput
				 */
				defaults = {
					clearBtn: false,
					textLine: true
				},
				eventName = {
					SEARCH: "search",
					ANIMATIONEND: "animationend"
				};

			TextInput.prototype = prototype;
			TextInput.classes = classes;
			TextInput.defaults = defaults;

			/**
			 * Resize textarea, called after text input
			 * @method _resize
			 * @private
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.TextInput
			 */
			function resizeTextArea(element) {
				element.style.height = "auto"; // reset for the browser to recalculate scrollHeight
				element.style.height = element.scrollHeight + "px"; // apply scrollHeight as new height
			}
			/**
			 * Toggle visibility of the clear button
			 * @method toggleClearButton
			 * @param {HTMLElement} clearBtn
			 * @param {HTMLInputElement} inputElement
			 * @param {Object} self
			 * @member ns.widget.mobile.TextInput
			 * @static
			 * @private
			 */
			function toggleClearButton(clearBtn, inputElement, self) {
				if (clearBtn) {
					if (!inputElement.classList.contains(classes.uiTextInputFocused)) {
						document.addEventListener(eventName.ANIMATIONEND, function (event) {
							if (event.animationName === "btn_pressup_animation") {
								clearBtn.classList.add(classes.uiTextInputClearHidden);
								self.trigger(eventName.SEARCH);
							}
						}, false);

						inputElement.value = "";
						inputElement.focus();

						inputElement.classList.remove(classes.uiTextInputClearActive);
					} else {
						clearBtn.classList.remove(classes.uiTextInputClearHidden);
						inputElement.classList.add(classes.uiTextInputClearActive);
					}
				}
			}

			/**
			 * Method adds class ui-text-input-focused to target element of event.
			 * @method onFocus
			 * @param {ns.widget.mobile.TextInput} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function onFocus(self) {
				var element = self.element;

				element.classList.add(classes.uiTextInputFocused);
			}

			/**
			 * Method adds event for showing clear button and optional resizing textarea.
			 * @method onInput
			 * @param {ns.widget.mobile.TextInput} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function onInput(self) {
				var element = self.element,
					btn = self._ui.textClearButtonElement;

				if (element.value === "") {
					btn.classList.add(classes.uiTextInputClearHidden);
					element.classList.remove(classes.uiTextInputClearActive);
				} else {
					toggleClearButton(self._ui.textClearButtonElement, element, self);
				}

				if (element.nodeName.toLowerCase() === "textarea") {
					resizeTextArea(element);
				}
			}
			/**
			 * Method removes class ui-text-input-focused from target element of event.
			 * @method onBlur
			 * @param {ns.widget.mobile.TextInput} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function onBlur(self) {
				var element = self.element;

				element.classList.remove(classes.uiTextInputFocused);
				toggleClearButton(self._ui.textClearButtonElement, element, self);
			}

			function setAria(element) {
				element.setAttribute("role", "textinput");
				element.setAttribute("aria-label", "Keyboard opened");
			}

			function createTextLine(element) {
				var textLine = document.createElement("span");

				textLine.classList.add(classes.uiTextInputTextLine);
				domUtils.insertNodeAfter(element, textLine);

				return textLine;
			}

			function createClearButton(element, header) {
				var clearButton = document.createElement("a");

				clearButton.classList.add(buttonClasses.BTN);
				clearButton.classList.add(buttonClasses.BTN_ICON);
				clearButton.classList.add(buttonClasses.BTN_NOBG);
				clearButton.classList.add(classes.uiTextInputClear);

				clearButton.tabindex = 0;
				if (header) {
					element.parentNode.appendChild(clearButton);
				} else {
					element.parentNode.insertBefore(clearButton, element.nextSibling.nextSibling);
				}

				return clearButton;
			}

			/**
			* build TextInput Widget
			* @method _build
			* @param {HTMLElement} element
			* @member ns.widget.mobile.TextInput
			* @return {HTMLElement}
			* @protected
			*/
			prototype._build = function (element) {
				var self = this,
					options = self.options,
					type = element.type,
					ui = self._ui,
					header = null;

				/* set Aria and TextLine */
				switch (type) {
					case "text":
					case "password":
					case "number":
					case "email":
					case "url":
					case "tel":
					case "search":
						setAria(element);
						ui.textLineElement = createTextLine(element);
						break;
					default:
						if (element.tagName.toLowerCase() === "textarea") {
							setAria(element);
							if (options.textLine) {
								ui.textLineElement = createTextLine(element);
							}
						}
				}

				element.classList.add(classes.uiTextInput);
				element.tabindex = 0;

				if (options.clearBtn) {
					ui.textClearButtonElement = createClearButton(element);
				}

				if (type === "search") {
					header = utilSelector.getClosestByClass(element, classes.HEADER);
					element.classList.add(classes.SEARCHINPUT);

					if (header) {
						header.classList.add(classes.HEADER_WITH_SEARCH);
						if (element.nextElementSibling.classList.contains(classes.uiTextInputTextLine)) {
							element.parentElement.removeChild(element.nextElementSibling);
						}
					}

					if (!options.clearBtn) {
						ui.textClearButtonElement = createClearButton(element, header);
					}

					if (!element.getAttribute("placeholder")) {
						element.setAttribute("placeholder", "Search");
					}

				}

				return element;
			};

			/**
			* Init TextInput Widget
			* @method _init
			* @param {HTMLElement} element
			* @member ns.widget.mobile.TextInput
			* @return {HTMLElement}
			* @protected
			*/
			prototype._init = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					type = element.type,
					parentNode = element.parentNode;

				if (options.clearBtn) {
					ui.textClearButtonElement = ui.textClearButtonElement || parentNode.querySelector(selector.uiTextInputClearButton);
				}
				if (options.textLine) {
					switch (type) {
						case "text":
						case "password":
						case "number":
						case "email":
						case "url":
						case "tel":
							ui.textLineElement = ui.textLineElement || parentNode.querySelector(selector.uiTextInputTextLine);
							break;
						default:
							if (element.nodeName.toLowerCase() === "textarea") {
								ui.textLineElement = ui.textLineElement || parentNode.querySelector(selector.uiTextInputTextLine);
							}
					}
				}

				if (element.nodeName.toLowerCase() === "textarea") {
					if (element.hasAttribute("rows") === false) {
						element.rows = 1;
					}
					resizeTextArea(element);
				}

				return element;
			};


			/**
			* Bind events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.TextInput
			*/
			prototype._bindEvents = function () {
				var self = this,
					element = self.element,
					clearBtn = self._ui.textClearButtonElement,
					onInputCallback = onInput.bind(null, self),
					onFocusCallback = onFocus.bind(null, self),
					onBlurCallback = onBlur.bind(null, self);

				self._callbacks = {
					onInputCallback: onInputCallback,
					onFocusCallback: onFocusCallback,
					onBlurCallback: onBlurCallback
				};

				utilEvent.on(element, "input", onInputCallback);
				utilEvent.on(element, "focus", onFocusCallback);
				utilEvent.on(element, "blur", onBlurCallback);
				if (clearBtn) {
					clearBtn.classList.add(classes.uiTextInputClearHidden);
				}

			};
			/**
			 * unbind events to widget
			 * @method _unbindEvents
			 * @protected
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._unbindEvents = function () {
				var self = this,
					element = self.element,
					callbacks = self._callbacks;

				utilEvent.off(element, "input", callbacks.onInputCallback);
				utilEvent.off(element, "focus", callbacks.onFocusCallback);
				utilEvent.off(element, "blur", callbacks.onBlurCallback);
			};

			/**
			 * Enables the TextInput
			 *
			 * Method removes disabled attribute on input and changes look of
			 * input to enabled state.
			 *
			 *	@example
			 *	<input id="input" />
			 *	<script>
			 *		var inputElement = document.getElementById("input"),
			 *			textInputWidget = tau.widget.TextInput();
			 *
			 *		textInputWidget.enable();
			 *	</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.TextInput
			 */

			/**
			 * Method enables TextInput.
			 * @method _enable
			 * @member ns.widget.mobile.TextInput
			 * @protected
			 */
			prototype._enable = function () {
				var element = this.element;

				if (element) {
					element.removeAttribute("disabled");
					element.classList.remove(classes.uiTextInputDisabled);
				}
			};

			/**
			 * Disables the TextInput
			 *
			 * Method adds disabled attribute on input and changes look of
			 * input to disable state.
			 *
			 *	@example
			 *	<input id="input" />
			 *	<script>
			 *		var inputElement = document.getElementById("input"),
			 *			textInputWidget = tau.widget.TextInput();
			 *
			 *		textInputWidget.disable();
			 *	</script>
			 *
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.TextInput
			 */

			/**
			 * Method disables TextInput
			 * @method _disable
			 * @member ns.widget.mobile.TextInput
			 * @protected
			 */
			prototype._disable = function () {
				var element = this.element;

				if (element) {
					element.setAttribute("disabled", "disabled");
					element.classList.add(classes.uiTextInputDisabled);
				}
			};

			/**
			 * Get element value
			 * @method _getValue
			 * @return {?string}
			 * @member ns.widget.mobile.TextInput
			 * @protected
			 * @since 2.3.1
			 */
			prototype._getValue = function () {
				var element = this.element;

				if (element) {
					return element.value;
				}
				return null;
			};

			/**
			 * Set element value
			 * @method _setValue
			 * @param {string} value
			 * @member ns.widget.mobile.TextInput
			 * @return {ns.widget.mobile.TextInput}
			 * @protected
			 * @since 2.3.1
			 */
			prototype._setValue = function (value) {
				var element = this.element;

				if (element) {
					element.value = value;
				}
				return this;
			};

			/**
			 * Destroys additional elements created by the widget,
			 * removes classes and event listeners
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self._ui,
					textLine = ui.textLineElement,
					clearButton = ui.textClearButtonElement;

				self._unbindEvents();

				if (textLine.parentElement) {
					textLine.parentElement.removeChild(ui.textLineElement);
				}

				if (clearButton) {
					clearButton.parentElement.removeChild(ui.textClearButtonElement);
				}

				ui = null;

			};

			ns.widget.mobile.TextInput = TextInput;
			engine.defineWidget(
				"TextInput",
				"input[type='text']:not([data-role])" +
					", input[type='number']:not([data-role])" +
					", input[type='password']:not([data-role])" +
					", input[type='email']:not([data-role])" +
					", input[type='url']:not([data-role])" +
					", input[type='tel']:not([data-role])" +
					", input[type='search']:not([data-role]), .ui-search-input" +
					", textarea" +
					", input:not([type])." + classes.uiTextInput,
				[],
				TextInput,
				"mobile"
			);

			engine.defineWidget(
				"SearchInput",
				"",
				[],
				TextInput,
				"mobile"
			);
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.TextInput;
		}
	);
//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
