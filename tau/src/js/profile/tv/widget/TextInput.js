/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Text Input Widget
 * Decorator for inputs elements.
 *
 * @class ns.widget.tv.TextInput
 * @extends ns.widget.mobile.TextInput
 * @author Lukasz Zajaczkowski <l.zajaczkows@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../profile/mobile/widget/mobile/Textinput",
			"../../../profile/mobile/widget/mobile/Button",
			"../../../core/engine",
			"./BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var MobileTextInput = ns.widget.mobile.TextInput,
				MobileTextInputPrototype = MobileTextInput.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				engine = ns.engine,
				FUNCTION_TYPE = "function",
				TextInput = function () {
					MobileTextInput.call(this);
					BaseKeyboardSupport.call(this);

					this._callbacks = {};
					this._lastEventLineNumber = 0;
				},
				classes = {
					uiDisabled: ns.widget.mobile.Button.classes.uiDisabled,
					uiNumberInput: "ui-number-input"
				},
				KEY_CODES = BaseKeyboardSupport.KEY_CODES,
				prototype = new MobileTextInput();

			TextInput.events = MobileTextInput.events;
			TextInput.classes = MobileTextInput.classes;
			TextInput.prototype = prototype;

			prototype._init = function(element) {
				if (typeof MobileTextInputPrototype._init === FUNCTION_TYPE) {
					MobileTextInputPrototype._init.call(this, element);
				}

				switch (element.type) {
				case "number":
					wrapInputNumber(element);
					break;
				}
			};

			prototype._bindEvents = function(element) {
				var callbacks = this._callbacks;

				if (typeof MobileTextInputPrototype._bindEvents === FUNCTION_TYPE) {
					MobileTextInputPrototype._bindEvents.call(this, element);
				}

				this._bindEventKey();

				callbacks.onKeyupTextarea = onKeyupTextarea.bind(null, this);

				switch (element.type) {
					case "number":
						element.addEventListener("keyup", onKeydownInput, false);
						break;
					case "textarea":
						element.addEventListener("keyup", callbacks.onKeyupTextarea, false);
				}
			};

			prototype._destroy = function(element) {
				var callbacks = this._callbacks;

				switch (element.type) {
					case "number":
						element.removeEventListener("keyup", onKeydownInput, false);
						break;
					case "textarea":
						element.removeEventListener("keyup", callbacks.onKeyupTextarea, false);
				}

				this._destroyEventKey();

				if (typeof MobileTextInputPrototype._destroy === FUNCTION_TYPE) {
					MobileTextInputPrototype._destroy.call(this, element);
				}
			};

			function onKeyupTextarea(self, event) {
				var textarea = self.element,
					value = textarea.value,
					linesNumber = value.split("\n").length,
					currentLineNumber = value.substr(0, textarea.selectionStart).split("\n").length;

				switch (event.keyCode) {
					case KEY_CODES.up:
						// if cursor is not at the first line
						// or the previous event was not in the first line
						if (currentLineNumber > 1 || self._lastEventLineNumber !== 1) {
							// we do not jump to other element
							event.preventDefault();
							event.stopPropagation();
						}
						break;
					case KEY_CODES.down:
						// if cursor is not at the last line
						// or the previous event was not in the last line
						if (currentLineNumber < linesNumber || self._lastEventLineNumber !== linesNumber) {
							// we do not jump to other element
							event.preventDefault();
							event.stopPropagation();
						}
						break;
					case KEY_CODES.left:
					case KEY_CODES.right:
							// we do not jump to other element
							event.preventDefault();
							event.stopPropagation();
						break;
				}
				self._lastEventLineNumber = currentLineNumber;
			}

			/**
			 * Method adds span to input.
			 * @method wrapInputNumber
			 * @param {EventTarget|HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.tv.TextInput
			 */
			function wrapInputNumber(element) {
				var focusableInputFrame = document.createElement("span"),
				parent = element.parentNode;

				focusableInputFrame.setAttribute("tabindex", 0);
				parent.replaceChild(focusableInputFrame, element);
				focusableInputFrame.appendChild(element);
				focusableInputFrame.classList.add(classes.uiNumberInput);
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
				if (element.classList.contains(TextInput.classes.uiInputText) &&
					!element.classList.contains(classes.uiDisabled)) {
					return element;
				}
				return null;
			}

			/**
			 * Method overrides input behavior on keydown event.
			 * @method onKeydownInput
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.TextInput
			 */
			function onKeydownInput(event) {
				var element = isEnabledTextInput(event.target),
					parent = element.parentNode;

				if(element) {
					event.stopPropagation();
					event.preventDefault();
					if (event.keyCode !== KEY_CODES.up && event.keyCode !== KEY_CODES.down) {
						parent.focus();
					}
				}
			}

			ns.widget.tv.TextInput = TextInput;

			engine.defineWidget(
				"TextInput",
				"input[type='text'], input[type='number'], input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='month'], input[type='week'], input[type='datetime-local'], input[type='color'], input:not([type]), .ui-textinput",
				[],
				TextInput,
				"tv",
				true
			);

			BaseKeyboardSupport.registerActiveSelector(".ui-textinput");

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.TextInput;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
