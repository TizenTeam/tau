/*global window, define */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
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
 *  - INPUT with type "text" or "number" or "password" or "email" or "url" or
 *    "tel" or "month" or "week" or "datetime-local" or "color" or without any
 *    type
 *  - TEXTAREA
 *  - HTML elements with class ui-TextInput
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
 * *document.getElementById*. Second parameter is **options** and it is a object
 * with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input type="text" name="text-1" id="text-1" value="">
 *		</form>
 *		<script>
 *			$("#text-1").textinput();
 *		</script>
 *
 * jQuery Mobile constructor has one optional parameter is **options** and it is
 * a object with options for widget.
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
 *
 *		 	// textInput.methodName(argument1, argument2, ...);
 *			// for example:
 *			textInput.value("text");
 *		</script>
 *
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		<input id="text-1" />
 *		<script>
 *			// $("#text-1").textinput('methodName', argument1, argument2, ...);
 *			// for example
 *
 *			$("#text-1").value("text");
 *		</script>
 *
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
 */
(function (document, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/theme",
			"../mobile",  // fetch namespace
			"./BaseWidgetMobile",
			"./Button"
		],
		function () {
//>>excludeEnd("tauBuildExclude");
			var TextInput = function () {
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {string} [options.clearSearchButtonText="clear text"] Default text for search field clear text button
					 * @property {boolean} [options.disabled=false] disable widget
					 * @property {?boolean} [options.mini=null] set mini version
					 * @property {string} [options.theme='s'] theme of widget
					 * @property {string} [options.clearBtn=false] option indicates that the clear button will be shown
					 * @member ns.widget.mobile.TextInput
					 */
					this.options = {
						clearSearchButtonText: "clear text",
						disabled: false,
						mini: null,
						theme: 's',
						clearBtn: false
					};
				},
				/**
				 * Alias for {ns.widget.BaseWidget}
				 * @property {Object} BaseWidget
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 */
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * Alias for {ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Alias for {ns.theme}
				 * @property {Object} theme
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 */
				themes = ns.theme,
				/**
				 * Flag with informations about events
				 * @property {boolean} eventsAdded
				 * @private
				 * @static
				 * @member ns.widget.mobile.TextInput
				 */
				eventsAdded = false,

				/**
				 * Dictionary for textinput related css class names
				 * @property {Object} classes
				 * @member ns.widget.mobile.TextInput
				 * @static
				 */
				classes = {
					uiBodyTheme: "ui-body-",
					uiMini: "ui-mini",
					uiInputText: "ui-input-text",
					//clear: "ui-input-clear",
					clear: "ui-li-delete",
					clearHidden: "ui-input-clear-hidden"
				},
				/**
				 * Selector for clear button appended to textinput
				 * @property {string} CLEAR_BUTTON_SELECTOR
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 * @readonly
				 */
				CLEAR_BUTTON_SELECTOR = '.' + classes.clear,
				/**
				 * Alias for {ns.widget.mobile.Button.classes.uiDisabled}
				 * @property {string} CLASS_DISABLED
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 * @readonly
				 */
				CLASS_DISABLED = ns.widget.mobile.Button.classes.uiDisabled;

			TextInput.prototype = new BaseWidget();

			TextInput.classes = classes;

			/**
			 * Enables the textinput
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
			 *	@example
			 *	<input id="input" />
			 *	<script>
			 *		$( "#input" ).textinput( "enable" );
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
			TextInput.prototype._enable = function () {
				var element = this.element;
				if (element) {
					element.classList.remove(CLASS_DISABLED);
				}
			};

			/**
			 * Disables the textinput
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
			 *	@example
			 *	<input id="input" />
			 *	<script>
			 *		$( "#input" ).textinput( "disable" );
			 *	</script>
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
			TextInput.prototype._disable = function () {
				var element = this.element;
				if (element) {
					element.classList.add(CLASS_DISABLED);
				}
			};

			/**
			 * Toggle visibility of the clear button
			 * @method toggleClearButton
			 * @param {HTMLElement} clearbtn
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.TextInput
			 * @static
			 * @private
			 */
			function toggleClearButton(clearbtn, element) {
				if (clearbtn) {
					if (element.value === "") {
						clearbtn.classList.add(classes.clearHidden);
					} else {
						clearbtn.classList.remove(classes.clearHidden);
					}
				}
			}

			/**
			 * Method finds label tag for element.
			 * @method findLabel
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.TextInput
			 * @return {HTMLElement}
			 * @static
			 * @private
			 */
			function findLabel(element) {
				var elemParent = element.parentNode;
				return elemParent.querySelector('label[for="' + element.id + '"]');
			}

			/**
			 * Method returns not disabled TextInput element which is the closest
			 * to element.
			 * @method isEnabledTextInput
			 * @param {EventTarget|HTMLElement} element
			 * @return {?HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function isEnabledTextInput(element) {
				if (element.classList.contains(classes.uiInputText) &&
						!element.classList.contains(CLASS_DISABLED)) {
					return element;
				}
				return null;
			}

			/**
			* The check whether the element is the enable "clear" button
			* @method isEnabledClearButton
			* @param {HTMLElement|EventTarget} element
			* @return {boolean}
			* @private
			* @static
			* @member ns.widget.mobile.TextInput
			*/
			function isEnabledClearButton(element) {
				var input,
					inputClassList;
				if (element && element.classList.contains(classes.clear)) {
					input = element.previousElementSibling;
					inputClassList = input.classList;
					if (inputClassList.contains(classes.uiInputText) &&
							!inputClassList.contains(CLASS_DISABLED)) {
						return true;
					}
				}
				return false;
			}

			/**
			 * Method adds class ui-focus to target element of event.
			 * @method onFocus
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function onFocus(event) {
				var elem = isEnabledTextInput(event.target);
				if (elem) {
					elem.classList.add('ui-focus');
				}
			}

			/**
			 * Method adds event for resize textarea.
			 * @method onKeyUp
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function onKeyup(event) {
				var element = isEnabledTextInput(event.target),
					self;
				if (element) {
					self = engine.getBinding(element, "TextInput");
					if (self) {
						toggleClearButton(self._ui.clearButton, element);
					}
					_resize(element);
				}
			}
			/**
			 * Method removes class ui-focus from target element of event.
			 * @method onBlur
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function onBlur(event) {
				var element = isEnabledTextInput(event.target),
					self;
				if (element) {
					element.classList.remove('ui-focus');
					self = engine.getBinding(element, "TextInput");
					if (self) {
						toggleClearButton(self._ui.clearButton, element);
					}
				}
			}
			/**
			* Handler for vclick events in clearButton
			* @method onCancel
			* @param {Event} event
			* @private
			* @static
			* @member ns.widget.mobile.TextInput
			*/
			function onCancel(event) {
				var clearButton = event.target,
					element;
				if (isEnabledClearButton(clearButton)) {
					element = clearButton.previousElementSibling;
					element.value = "";
					toggleClearButton(clearButton, element);
					element.focus();
				}
			}

			/**
			 * add events to all TextInputs
			 * @method addGlobalEvents
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			function addGlobalEvents() {
				if (!eventsAdded) {
					document.addEventListener('focus', onFocus, true);
					document.addEventListener('blur', onBlur, true);
					document.addEventListener('vclick', onCancel, true);
					eventsAdded = true;
				}
			}
			/**
			 * resize textarea
			 * @method _resize
			 * @private
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.TextInput
			 */
			function _resize(element){
				if (element.nodeName.toLowerCase() === "textarea") {
					if(element.clientHeight < element.scrollHeight){
						element.style.height = element.scrollHeight +" px";
					}
				}
			}

			/**
			* Configure TextInput Widget
			* @method _configure
			* @member ns.widget.mobile.TextInput
			* @protected
			*/
			TextInput.prototype._configure = function () {
				var self= this;

				self._ui = self._ui || {};
			}

			/**
			* build TextInput Widget
			* @method _build
			* @param {HTMLElement} element
			* @member ns.widget.mobile.TextInput
			* @return {HTMLElement}
			* @protected
			*/
			TextInput.prototype._build = function (element) {
				var self= this,
					elementClassList = element.classList,
					classes = TextInput.classes,
					options = self.options,
					themeClass,
					labelFor = findLabel(element),
					clearButton,
					ui;

				ui = self._ui;

				options.theme = themes.getInheritedTheme(element) || options.theme;
				themeClass = classes.uiBodyTheme + options.theme;

				if (labelFor) {
					labelFor.classList.add(classes.uiInputText);
				}

				elementClassList.add(classes.uiInputText);
				elementClassList.add(themeClass);

				switch (element.type) {
				case "text":
				case "password":
				case "number":
				case "email":
				case "url":
				case "tel":
					element.setAttribute("role", "textbox");
					element.setAttribute("aria-label", "Keyboard opened");
					break;
				default:
					if (element.tagName.toLowerCase() === "textarea") {
						element.setAttribute("role", "textbox");
						element.setAttribute("aria-label", "Keyboard opened");
					}
				}

				element.setAttribute("tabindex", 0);

				if (options.clearBtn) {
					clearButton = document.createElement("span");
					clearButton.classList.add(classes.clear);
					element.parentNode.appendChild(clearButton);
					ui.clearButton = clearButton;
				}

				//Auto grow
				_resize(element);

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
			TextInput.prototype._init = function (element) {
				var self = this,
					options = self.options;
				if (options.clearBtn) {
					self._ui.clearButton = element.parentNode.querySelector(CLEAR_BUTTON_SELECTOR);
					if (self._ui.clearButton) {
						toggleClearButton(self._ui.clearButton, element);
					}
				}
				return element;
			};


			/**
			* Bind events to widget
			* @method _bindEvents
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.TextInput
			*/
			TextInput.prototype._bindEvents = function (element) {
				var clearButton = this._ui.clearButton;
				element.addEventListener('keyup', onKeyup , false);
				if (clearButton) {
					clearButton.addEventListener("vclick", onCancel.bind(null, this), false);
				}
				addGlobalEvents();
			};

			ns.widget.mobile.TextInput = TextInput;
			engine.defineWidget(
				"TextInput",
				"input[type='text'], input[type='number'], input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='month'], input[type='week'], input[type='datetime-local'], input[type='color'], input:not([type]), .ui-textinput",
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
