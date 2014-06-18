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
 * @class ns.widget.Textinput
 * @extends ns.widget.BaseWidget
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
			var Textinput = function () {
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {string} [options.clearSearchButtonText="clear text"] Default text for search field clear text button
					 * @property {boolean} [options.disabled=false] disable widget
					 * @property {?boolean} [options.mini=null] set mini version
					 * @property {string} [options.theme='s'] theme of widget
					 * @property {string} [options.clearBtn=false] option indicates that the clear button will be shown
					 * @member ns.widget.Textinput
					 * @instance
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
				 * @member ns.widget.Textinput
				 * @static
				 * @private
				 */
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * Alias for {ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.Textinput
				 * @static
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Alias for {ns.theme}
				 * @property {Object} theme
				 * @member ns.widget.Textinput
				 * @static
				 * @private
				 */
				themes = ns.theme,
				/**
				 * Flag with informations about events
				 * @property {boolean} eventsAdded
				 * @private
				 * @static
				 */
				eventsAdded = false,

				/**
				 * Dictionary for textinput related css class names
				 * @property {Object} classes
				 * @member ns.widget.Textinput
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
				 * Alias for {ns.widget.mobile.Button.classes.uiDisabled}
				 * @property {Object} CLASS_DISABLED
				 * @member ns.widget.Textinput
				 * @static
				 * @private
				 * @readonly
				 */
				CLASS_DISABLED = ns.widget.mobile.Button.classes.uiDisabled;

			Textinput.prototype = new BaseWidget();

			Textinput.classes = classes;

			/**
			* Enable textinput
			* @method _enable
			* @member ns.widget.Textinput
			* @protected
			* @instance
			*/
			Textinput.prototype._enable = function () {
				var element = this.element;
				if (element) {
					element.classList.remove(CLASS_DISABLED);
				}
			};

			/**
			* Disable textinput
			* @method _disable
			* @member ns.widget.Textinput
			* @protected
			* @instance
			*/
			Textinput.prototype._disable = function () {
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
			 * @member ns.widget.Textinput
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
			* Find label tag for element
			* @method findLabel
			* @param {HTMLElement} element
			* @member ns.widget.Textinput
			* @return {HTMLElement}
			* @static
			* @private
			*/
			function findLabel(element) {
				var elemParent = element.parentNode;
				return elemParent.querySelector('label[for="' + element.id + '"]');
			}

			/**
			* return not disabled textinput element which is the closest to element
			* @method isEnabledTextInput
			* @param {HTMLElement} element
			* @return {?HTMLElement}
			* @private
			* @static
			* @member ns.widget.Textinput
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
			* @param {HTMLElement} element
			* @return {boolean}
			* @private
			* @static
			* @member ns.widget.Textinput
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
			* add class ui-focus to target element of event
			* @method onFocus
			* @param {Event} event
			* @private
			* @static
			* @member ns.widget.Textinput
			*/
			function onFocus(event) {
				var elem = isEnabledTextInput(event.target);
				if (elem) {
					elem.classList.add('ui-focus');
				}
			}

			/**
			 * add event for resize textarea
			 * @method onKeyup
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.Textinput
			 */
			function onKeyup(event) {
				var element = isEnabledTextInput(event.target),
					self;
				if (element) {
					self = engine.getBinding(element, "Textinput");
					toggleClearButton(self._ui.clearButton, element);
					_resize(element);
				}
			}
			/**
			* remove class ui-focus from target element of event
			* @method onBlur
			* @param {Event} event
			* @private
			* @static
			* @member ns.widget.Textinput
			*/
			function onBlur(event) {
				var element = isEnabledTextInput(event.target),
					self;
				if (element) {
					element.classList.remove('ui-focus');
					self = engine.getBinding(element, "Textinput");
					toggleClearButton(self._ui.clearButton, element);
				}
			}
			/**
			*
			* @method onCancel
			* @param {Event} event
			* @private
			* @static
			* @member ns.widget.Textinput
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
			* add events to all textinputs
			* @method addGlobalEvents
			* @private
			* @static
			* @member ns.widget.Textinput
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
			 * @member ns.widget.Textinput
			 * @param element
			 */
			function _resize(element){
				if (element.nodeName.toLowerCase() === "textarea") {
					if(element.clientHeight < element.scrollHeight){
						element.style.height = element.scrollHeight +" px";
					}
				}
			}

			/**
			* build Textinput Widget
			* @method _build
			* @param {HTMLElement} element
			* @member ns.widget.Textinput
			* @return {HTMLElement}
			* @protected
			* @instance
			*/
			Textinput.prototype._build = function (element) {
				var self= this,
					elementClassList = element.classList,
					classes = Textinput.classes,
					options = self.options,
					themeclass,
					labelFor = findLabel(element),
					clearButton,
					ui;

				self._ui = self._ui || {};
				ui = self._ui;

				options.theme = themes.getInheritedTheme(element) || options.theme;
				themeclass  = classes.uiBodyTheme + options.theme;

				if (labelFor) {
					labelFor.classList.add(classes.uiInputText);
				}

				elementClassList.add(classes.uiInputText);
				elementClassList.add(themeclass);

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
			* Init Textinput Widget
			* @method _init
			* @param {HTMLElement} element
			* @member ns.widget.Textinput
			* @return {HTMLElement}
			* @protected
			*/
			Textinput.prototype._init = function (element) {
				if (this._ui.clearButton) {
					toggleClearButton(this._ui.clearButton, element);
				}
				return element;
			};


			/**
			* Bind events to widget
			* @method _bindEvents
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.Textinput
			*/
			Textinput.prototype._bindEvents = function (element) {
				var clearButton = this._ui.clearButton;
				element.addEventListener('keyup', onKeyup , false);
				if (clearButton) {
					clearButton.addEventListener("vclick", onCancel.bind(null, this), false);
				}
				addGlobalEvents();
			};

			ns.widget.mobile.Textinput = Textinput;
			engine.defineWidget(
				"Textinput",
				"input[type='text'], input[type='number'], input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='month'], input[type='week'], input[type='datetime-local'], input[type='date'], input[type='time'], input[type='datetime'], input[type='color'], input:not([type]), .ui-textinput",
				[],
				Textinput,
				"mobile"
			);
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Textinput;
		}
	);
//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
