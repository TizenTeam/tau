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
					uiNumberInput: "ui-number-input"
				}),
				KEY_CODES = BaseKeyboardSupport.KEY_CODES,
				prototype = new MobileTextInput(),
				// for detect keyboard open/hide
				initialScreenHeight = window.innerHeight,
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

			/**
			 * Init widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.TextInput
			 */
			prototype._bindEvents = function(element) {
				var self = this,
					callbacks = self._callbacks;

				MobileTextInputPrototype._bindEvents.call(self, element);

				self._bindEventKey();

				callbacks.onKeyup = onKeyupTextarea.bind(null, self);
				callbacks.onResize = onResize.bind(null, self);

				switch (element.type) {
					case "textarea":
						element.addEventListener("keyup", callbacks.onKeyup, false);
				}

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
					callbacks = self._callbacks;

				switch (element.type) {
					case "textarea":
						element.removeEventListener("keyup", callbacks.onKeyup, false);
				}

				self._destroyEventKey();

				MobileTextInputPrototype._destroy.call(self, element);

				window.removeEventListener("resize", callbacks.onResize, false);
			};

			/**
			 * Method overrides Textarea behavior on keyup event.
			 * @method onKeyupTextarea
			 * @param {TextInput} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.TextInput
			 */
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
							event.stopImmediatePropagation();
						}
						break;
					case KEY_CODES.down:
						// if cursor is not at the last line
						// or the previous event was not in the last line
						if (currentLineNumber < linesNumber || self._lastEventLineNumber !== linesNumber) {
							// we do not jump to other element
							event.stopImmediatePropagation();
						}
						break;
					case KEY_CODES.left:
					case KEY_CODES.right:
							// we do not jump to other element
							event.stopImmediatePropagation();
						break;
				}
				self._lastEventLineNumber = currentLineNumber;
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
				if (window.innerHeight < initialScreenHeight) {
					self.saveKeyboardSupport();
					self.enableKeyboardSupport();
				} else {
					self.disableKeyboardSupport();
					self.restoreKeyboardSupport();
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

			/**
			 * Method overrides input behavior on keydown event.
			 * @method onKeydownInput
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.TextInput
			 */
			function onKeydownInput(event) {
				var target = event.target,
					isEnabled = isEnabledTextInput(target),
					parent = target.parentNode;

				if (isEnabled) {
					event.stopPropagation();
					event.preventDefault();
					if (event.keyCode !== KEY_CODES.up && event.keyCode !== KEY_CODES.down) {
						parent.focus();
					}
				}
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

			BaseKeyboardSupport.registerActiveSelector("." + classes.uiTextinput);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.TextInput;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
