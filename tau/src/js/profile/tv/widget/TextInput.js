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
 * #Text Input Widget
 * Decorator for inputs elements.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - INPUT with type "text" or "password" or "email" or "url" or
 *    "tel" or "month" or "week" or "datetime-local" or "color" or without any
 *    type
 *  - TEXTAREA
 *  - HTML elements with class ui-textinput
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
 * ####Create simple text input on INPUT element with class ui-textinput
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input name="text-1" id="text-1" class="ui-textinput">
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
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*.
 *
 * @class ns.widget.tv.TextInput
 * @extends ns.widget.mobile.TextInput
 * @author Lukasz Zajaczkowski <l.zajaczkows@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../profile/mobile/widget/mobile/Textinput",
			"../../../profile/mobile/widget/mobile/Button",
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/util/object",
			"./Page",
			"./BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var widget = ns.widget,
				MobileTextInput = widget.mobile.TextInput,
				MobileTextInputPrototype = MobileTextInput.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				/**
				 * Alias for {ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.tv.TextInput
				 * @static
				 * @private
				 */
				utilSelectors = ns.util.selectors,
				utilObject = ns.util.object,
				engine = ns.engine,
				TextInput = function () {
					var self = this;
					MobileTextInput.call(self);
					BaseKeyboardSupport.call(self);

					self._callbacks = {};
					self._lastEventLineNumber = 0;
				},
				/**
				 * Dictionary for textinput related css class names
				 * @property {Object} classes
				 * @member ns.widget.tv.TextInput
				 * @static
				 */
				classes = utilObject.merge({}, MobileTextInput.classes, {
					uiDisabled: widget.mobile.Button.classes.uiDisabled,
					uiFocus: "ui-focus",
					uiInputBox: "input-box",
					highlight: "ui-highlight"
				}),
				KEY_CODES = BaseKeyboardSupport.KEY_CODES,
				prototype = new MobileTextInput(),
				// for detect keyboard open/hide
				initialScreenHeight = window.innerHeight,
				//state check if user enter input inside container or leaves it
				elementIsFocused = false,
				selector = "input[type='text'], " +
					"input[type='password'], input[type='email'], " +
					"input[type='url'], input[type='tel'], textarea, " +
					"input[type='month'], input[type='week'], " +
					"input[type='datetime-local'], input[type='color'], " +
					"input:not([type]), " +
					"." +classes.uiTextinput + ":not([type='number'])";

			TextInput.events = MobileTextInput.events;
			TextInput.classes = classes;
			TextInput.prototype = prototype;
			TextInput.selector = selector;

			function wrapInput(element, self) {
				var inputBox = document.createElement("div"),
					parentElement = element.parentNode;

				inputBox.classList.add(classes.uiInputBox);
				inputBox.setAttribute("tabindex", 0);
				parentElement.replaceChild(inputBox, element);

				inputBox.appendChild(element);

				self._ui.inputBox = inputBox;
			}
			/**
			 * Init widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.TextInput
			 */
			prototype._build = function(element) {
				var self = this;
				element = MobileTextInputPrototype._build.call(self, element);
				wrapInput(element, self);

				return element;
			};

			/**
			 * Method finds label tag for element.
			 * @method _findLabel
			 * @param {HTMLElement} element
			 * @member ns.widget.tv.TextInput
			 * @return {HTMLElement}
			 * @protected
			 */
			prototype._findLabel = function (element) {
				return element.parentNode.parentNode.querySelector("label[for='" + element.id + "']");
			};

			/**
			 * Callback for focus event on input
			 * @method inputFocus
			 * @param {ns.widget.tv.TextInput} self
			 * @static
			 * @private
			 * @member ns.widget.tv.TextInput
			 */
			function inputFocus(self) {
				var input = self.element;

				elementIsFocused = true;
				if (!input.getAttribute("disabled")) {
					input.classList.add(classes.highlight);
					input.parentElement.classList.add(classes.uiFocus);
				}
				self.saveKeyboardSupport();
				self.disableKeyboardSupport();
			}

			/**
			 * Callback for focus event on container of input
			 * @method inputContainerFocus
			 * @param {ns.widget.tv.TextInput} self
			 * @static
			 * @private
			 * @member ns.widget.tv.TextInput
			 */
			function inputContainerFocus(self) {
				var input = self.element;

				if (!input.getAttribute("disabled")) {
					input.parentElement.classList.add(classes.uiFocus);
				}
			}

			/**
			 * Callback for blur event on input
			 * @method inputBlur
			 * @param {ns.widget.tv.TextInput} self
			 * @static
			 * @private
			 * @member ns.widget.tv.TextInput
			 */
			function inputBlur(self, event) {
				var input = self.element;

				elementIsFocused = false;
				input.classList.remove(classes.highlight);
				input.parentElement.classList.remove(classes.uiFocus);
				self.restoreKeyboardSupport();
			}

			/**
			 * Callback for blur event on container of input
			 * @method inputContainerBlur
			 * @param {ns.widget.tv.TextInput} self
			 * @static
			 * @private
			 * @member ns.widget.tv.TextInput
			 */
			function inputContainerBlur(self, event) {
				self.element.parentElement.classList.remove(classes.uiFocus);
			}

			/**
			 * Init widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.TextInput
			 */
			prototype._bindEvents = function(element) {
				var self = this,
					callbacks = self._callbacks,
					parentElement = element.parentElement;

				callbacks.inputFocus = inputFocus.bind(null, self);
				callbacks.inputBlur = inputBlur.bind(null, self);
				callbacks.inputContainerFocus = inputContainerFocus.bind(null, self);
				callbacks.inputContainerBlur = inputContainerBlur.bind(null, self);

				parentElement.addEventListener("focus", callbacks.inputContainerFocus, false);
				parentElement.addEventListener("blur", callbacks.inputContainerBlur, false);

				element.addEventListener("focus", callbacks.inputFocus, false);
				element.addEventListener("blur", callbacks.inputBlur, false);

				MobileTextInputPrototype._bindEvents.call(self, element);

				self._bindEventKey();

				callbacks.onKeyupElementContainer = onKeyupElementContainer.bind(null, self);

				callbacks.onResize = onResize.bind(null, self);

				element.addEventListener("keyup", onKeyupElement, false);
				parentElement.addEventListener("keyup", callbacks.onKeyupElementContainer, false);

				window.addEventListener("resize", callbacks.onResize, false);
			};

			/**
			 * Destroys additional elements created by the widget,
			 * removes classes and event listeners
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.TextInput
			 */
			prototype._destroy = function(element) {
				var self = this,
					callbacks = self._callbacks,
					parentElement = element.parentElement;

				parentElement.removeEventListener("focus", callbacks.inputContainerFocus, false);
				parentElement.removeEventListener("blur", callbacks.inputContainerBlur, false);

				element.removeEventListener("focus", callbacks.inputFocus, false);
				element.removeEventListener("blur", callbacks.inputBlur, false);

				element.removeEventListener("keyup", onKeyupElement, false);
				parentElement.removeEventListener("keyup", callbacks.onKeyupElementContainer, false);

				element.removeEventListener("keyup", callbacks.onKeyupElementContainer, false);

				self._destroyEventKey();

				MobileTextInputPrototype._destroy.call(self, element);

				window.removeEventListener("resize", callbacks.onResize, false);
			};

			/**
			 * Callback enable/disbale focus on input element
			 * @method onKeyupElementContaine
			 * @param {ns.widget.tv.TextInput} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.TextInput
			 */
			function onKeyupElementContainer(self, event) {
				var element = self.element,
					elementTypeName = element.tagName.toLowerCase(),
					eventTarget = event.target;

				switch (event.keyCode) {
					case KEY_CODES.enter:
						//when the keyboard is on
						if (window.innerHeight < initialScreenHeight) {
							self.saveKeyboardSupport();
							self.disableKeyboardSupport();
						} else {
							if (elementIsFocused) {
								//check if enter to the input or textarea and get focus
								if (elementTypeName !== "textarea") {
									element.blur();
									element.parentElement.focus();
								}
								// @todo: add support for exit
							} else {
								// input is highlighted
								element.focus();
							}
						}
						break;
				}
			}

			/**
			 * Callback to prevent key movement inside input
			 * @method onKeyupElement
			 * @param {Event} event
			 * @static
			 * @private
			 * @member ns.widget.tv.TextInput
			 */
			function onKeyupElement(event) {
				switch (event.keyCode) {
					case KEY_CODES.up:
					case KEY_CODES.down:
					case KEY_CODES.left:
					case KEY_CODES.right:
						// when we are focused on input element, prevent actions on arrows
						event.stopImmediatePropagation();
						break;
				}
			}

			/**
			 * Enable or disable keyboard support after resize od screen (open
			 * virtual keyboard)
			 * @method onResize
			 * @param {ns.widget.tv.TextInput} self
			 * @private
			 * @static
			 * @member ns.widget.tv.TextInput
			 */
			function onResize(self) {
				var elem;

				if (window.innerHeight < initialScreenHeight) {
					self.saveKeyboardSupport();
					self.enableKeyboardSupport();
				} else {
					self.disableKeyboardSupport();
					self.restoreKeyboardSupport();
					//when textarea after closing the keyboard has focus then change focus to container
					elem = document.querySelector("textarea.ui-focus");
					if (elem) {
						elem.parentNode.focus();
					}
				}
			}

			/**
			 * Method returns not disabled TextInput element which is the closest
			 * to element.
			 * @method isEnabledTextInput
			 * @param {EventTarget|HTMLElement} element
			 * @return {?HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.tv.TextInput
			 */
			function isEnabledTextInput(element) {
				return element && element.classList.contains(MobileTextInput.classes.uiInputText) &&
					!element.classList.contains(classes.uiDisabled) && !element.disabled;
			}

			widget.tv.TextInput = TextInput;

			engine.defineWidget(
				"TextInput",
				selector,
				[],
				TextInput,
				"tv",
				true
			);

			BaseKeyboardSupport.registerActiveSelector("." + classes.uiInputBox);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.TextInput;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
