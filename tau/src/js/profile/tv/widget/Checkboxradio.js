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
 * #Checkbox-radio Widget
 * Checkboxradio widget changes default browser checkboxes and radios to form more adapted to TV environment.
 * Widget inherits from mobile widget. You can look for its documentation in {@link ns.widget.mobile.Checkboxradio}
 *
 * ##Default selectors
 * By default all inputs with type "checkbox" or "radio" are changed to Checkboxradio widget.
 *
 * @class ns.widget.tv.Checkboxradio
 * @extends ns.widget.mobile.Checkboxradio
 * @author Piotr Ostalski <p.ostalski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../profile/mobile/widget/mobile/Checkboxradio",
			"../../../core/engine",
			"../../../core/util/selectors",
			"./BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/** {Object} Widget Alias for {@link ns.widget.mobile.Checkboxradio}
			 * @member ns.widget.tv.Checkboxradio
			 * @private
			 * @static
			 */
			var MobileCheckboxradio = ns.widget.mobile.Checkboxradio,
				/**
				 * {Object} Alias for {@link ns.widget.tv.BaseKeyboardSupport}
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 */
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				/**
				 * {Object} Alias for {@link ns.engine}
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * {Object} Alias for {@link ns.util.selectors}
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 */
				selectorUtils = ns.util.selectors,
				/**
				 * {Object} List of classes which can be added to widget`s element
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 * @readonly
				 */
				classes = {
					focused: "ui-focus",
					container: "checkboxradio-container",
					checkboxradioInListview: "checkboxradio-in-listview",
					listItemWithRadio: "li-has-radio",
					listItemWithCheckbox: "li-has-checkbox",
					background: "ui-background"
				},
				/**
				 * {Constant} Constant describing type of functions
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 * @readonly
				 */
				FUNCTION_TYPE = "function",
				Checkboxradio = function () {
					var self = this;

					MobileCheckboxradio.call(self);
					BaseKeyboardSupport.call(self);
					/**
					 * Checkbox radio type
					 * @property {"radio"|"checkbox"} type
					 */
					self.type = "";
					self._onKeyDownRadioBound = null;
				},
				/**
				 * {Object} List of remote control / keyboard button key codes
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 * @readonly
				 */
				KEY_CODES = {
					up: 38,
					down: 40,
					left: 37,
					right: 39,
					enter: 13
				},
				/**
				 * {string} Class name of checkboxradioInListview
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 * @readonly
				 */
				classInListview = classes.checkboxradioInListview,
				/**
				 * {string} Active selector - for keyboard support
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 * @readonly
				 */
				activeSelector = "input[type='radio']:not([disabled]):not(." + classInListview + "), "
					+ "[type='checkbox']:not([disabled]):not(." + classInListview + ")",
				/**
				 * {string} Focusable predecessor selector
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 * @readonly
				 */
				focusablePredecessorSelector = "*[tabindex], "
					+ "." + classes.listItemWithCheckbox + ", "
					+ "." + classes.listItemWithRadio,
				/**
				 * {string} Checkboxradio selector
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 * @readonly
				 */
				widgetSelector = "input[type='checkbox'], input[type='radio']",
				/**
				 * {string} Listview selector - value filled in runtime
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 * @readonly
				 */
				listViewSelector = "",
				/**
				 * {HTMLElement} Background node clone for memory optimization
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 * @readonly
				 */
				backgroundElement = null,
				/**
				 * {Object} Checkboxradio widget prototype
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 */
				prototype = new MobileCheckboxradio();

			Checkboxradio.prototype = prototype;
			Checkboxradio.classes = classes;

			/**
			 * Method overrides input behavior on keydown event (radio).
			 * @method onKeydownRadio
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
			 */
			function onKeydownRadio(event) {
				var keyCode = event.keyCode;

				if (keyCode === KEY_CODES.down ||
						keyCode === KEY_CODES.up ||
						keyCode === KEY_CODES.left ||
						keyCode === KEY_CODES.right
						) {
					event.preventDefault();
					event.stopPropagation();
				}
			}

			/**
			 * Method overrides input behavior on keydown event (radiobutton`s container).
			 * @method onKeyup
			 * @param {Event} event
			 * @param {HTMLInputElement} [input=undefined]
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
			 */
			function onKeyup(event, input) {
				var checkboxradio;
				if (event.keyCode === KEY_CODES.enter) {
					// event.target is a container
					checkboxradio = input || event.target.querySelector(widgetSelector);
					if (checkboxradio && (!checkboxradio.disabled)) {
						checkboxradio.checked = !checkboxradio.checked;
						event.stopPropagation();
						event.preventDefault();
					}
				}
			}

			/**
			 * Method overrides input behavior on focus event (radiobutton`s container).
			 * @method onFocus
			 * @param {Event} event
			 * @param {HTMLInputElement} [input=undefined]
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
			 */
			function onFocus(event, input) {
				// event.target is a container
				var checkboxradio = input || event.target.querySelector(widgetSelector);
				if (checkboxradio && (!checkboxradio.disabled)) {
					if (input) {
						checkboxradio.parentNode.focus();
					}
					checkboxradio.classList.add(classes.focused);
					checkboxradio.parentNode.classList.add(classes.focused);
					event.stopPropagation();
					event.preventDefault();
				}
			}

			/**
			 * Method overrides input behavior on blur event (radiobutton`s container).
			 * @method onBlur
			 * @param {Event} event
			 * @param {HTMLInputElement} [input=undefined]
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
			 */
			function onBlur(event, input) {
				// event.target is a container
				var checkboxradio = input || event.target.querySelector(widgetSelector);
				if (checkboxradio && (!checkboxradio.disabled)) {
					if (input) {
						checkboxradio.parentNode.blur();
					}
					checkboxradio.classList.remove(classes.focused);
					checkboxradio.parentNode.classList.remove(classes.focused);
				}
			}

			/**
			 * Checks if checkboxradio is in a listview
			 * @method isInListview
			 * @param {HTMLElement} Element
			 * @return {boolean} True if an element is in a listview
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
			 */
			function isInListview(element) {
				if (listViewSelector.length === 0) {
					listViewSelector = engine.getWidgetDefinition("Listview").selector;
				}
				return !!ns.util.selectors.getClosestBySelector(element, listViewSelector);
			}

			/**
			 * Builds and returns input wrapper
			 * @method _buildWrapper
			 * @param {HTMLInputElement} element
			 * @return {HTMLDivElement}
			 * @protected
			 * @member ns.widget.tv.Checkboxradio
			 */
			prototype._buildWrapper = function (element) {
				var wrapper;

				// build wrapper as in profile mobile
				wrapper = MobileCheckboxradio.prototype._buildWrapper.call(this, element);

				// add special class
				wrapper.classList.add(classes.container);
				if (!element.disabled && element.classList.contains(classes.checkboxradioInListview)) {
					wrapper.setAttribute("tabindex", 0);
				}

				if (!backgroundElement) {
					backgroundElement = document.createElement("div");
					backgroundElement.className = classes.background;
				}

				if (wrapper.firstChild) {
					wrapper.insertBefore(backgroundElement.cloneNode(), element);
				} else {
					wrapper.appendChild(backgroundElement.cloneNode());
				}

				return wrapper;
			};

			/**
			 * Builds and returns label element
			 * @method _buildLabel
			 * @param {HTMLInputElement} element
			 * @return {HTMLLabelElement}
			 * @protected
			 * @member ns.widget.tv.Checkboxradio
			 */
			prototype._buildLabel = function (element) {
				var label = this._findLabel(element.parentNode, element.id);
				// label is not a button as in profile mobile

				if (label) {
					label.style.display = "inline-block";
					if (element.disabled) {
						// make label not focusable (remove button class)
						label.className = "";
					}
				}
				return label;
			};

			/**
			 * Builds structure of checkboxradio widget
			 * @method _build
			 * @param {HTMLInputElement} element
			 * @return {HTMLInputElement} Built element
			 * @protected
			 * @member ns.widget.tv.Checkboxradio
			 */
			prototype._build = function (element) {
				// set proper class if element in on the listview
				if (isInListview(element)) {
					element.classList.add(classInListview);
				}
				// build element
				element = MobileCheckboxradio.prototype._build.call(this, element);

				return element;
			};

			/**
			 * Binds events to widget
			 * @method _bindEvents
			 * @param {HTMLInputElement} element Input element
			 * @protected
			 * @member ns.widget.tv.Checkboxradio
			 */
			prototype._bindEvents = function (element) {
				var focusablePredecessor,
					parentNode,
					self = this;

				element.addEventListener("focus", self);
				element.addEventListener("blur", self);
				element.addEventListener("keyup", self);
				element.addEventListener("down", self);

				if (element.classList.contains(classInListview)) {
					focusablePredecessor = selectorUtils.getClosestBySelector(element,
							focusablePredecessorSelector);
					if (focusablePredecessor !== null) {
						focusablePredecessor.addEventListener("keyup", onKeyup, false);
						focusablePredecessor.addEventListener("focus", onFocus, false);
						focusablePredecessor.addEventListener("blur", onBlur, false);
					}
				} else if (element.type === "radio") {
					parentNode = element.parentNode;
					parentNode.addEventListener("keyup", onKeyup, false);
					parentNode.addEventListener("keydown", onKeydownRadio, false);
					parentNode.addEventListener("focus", onFocus, false);
					parentNode.addEventListener("blur", onBlur, false);
				}
			};

			/**
			 * Cleans widget's resources
			 * @method _destroy
			 * @param {HTMLInputElement} element
			 * @protected
			 * @member ns.widget.tv.Checkboxradio
			 */
			prototype._destroy = function (element) {
				var focusablePredecessor,
					parentNode,
					self = this;

				element.removeEventListener("focus", self);
				element.removeEventListener("blur", self);
				element.removeEventListener("keyup", self);
				element.removeEventListener("keydown", self);

				if (element.classList.contains(classInListview)) {
					focusablePredecessor = selectorUtils.getClosestBySelector(element,
							focusablePredecessorSelector);
					if (focusablePredecessor !== null) {
						focusablePredecessor.removeEventListener("keyup", onKeyup, false);
						focusablePredecessor.removeEventListener("focus", onFocus, false);
						focusablePredecessor.removeEventListener("blur", onBlur, false);
					}
				} else if (element.type === "radio") {
					parentNode = element.parentNode;
					parentNode.removeEventListener("keyup", onKeyup, false);
					parentNode.removeEventListener("keydown", onKeydownRadio, false);
					parentNode.removeEventListener("focus", onFocus, false);
					parentNode.removeEventListener("blur", onBlur, false);
				}
			};

			/**
			 * Initialize checkbox widget
			 * @method _init
			 * @param {HTMLInputElement} element
			 * @protected
			 * @member ns.widget.tv.Checkboxradio
			 */
			prototype._init = function (element) {
				this.type = element.type;
			};

			/**
			 * Handles blur/focus events on input
			 * @param {Event} event
			 * @member ns.widget.tv.Checkboxradio
			 */
			prototype.handleEvent = function (event) {
				switch (event.type) {
				case "focus":
					return onFocus(event, this.element);
				case "blur":
					return onBlur(event, this.element);
				case "keydown":
					return onKeydownRadio(event);
				case "keyup":
					return onKeyup(event, this.element);
				}
			};

			// definition
			ns.widget.tv.Checkboxradio = Checkboxradio;

			engine.defineWidget(
				"Checkboxradio",
				widgetSelector,
				[],
				Checkboxradio,
				"tv",
				true
			);

			BaseKeyboardSupport.registerActiveSelector(activeSelector);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Checkboxradio;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
