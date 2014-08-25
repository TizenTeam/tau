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
 * #Checkbox-radio Widget
 * Checkboxradio widget changes default browser checkboxes and radios to form more adapted to TV environment.
 *
 * ##Default selectors
 * In default all inputs with type _checkbox_ or _radio_ are changed to checkboxradio widget.
 *
 * ##HTML Examples
 *
 * ### Create checkboxradio
 *
 *	@example
 *		<input type="checkbox" name="checkbox-example" id="checkbox-example"/>
 *		<label for="checkbox-example">Example</label>
 *
 *		<input type="radio" name="radio-example" id="radio-example" value="1">
 *		<label for="radio-example">Example</label>
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
			"../../../profile/mobile/widget/mobile/Checkboxradio",
			"../../../core/engine",
			"./BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var MobileCheckboxradio = ns.widget.mobile.Checkboxradio,
				MobileCheckboxradioPrototype = MobileCheckboxradio.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				engine = ns.engine,
				classes = {
					focused: "focus"
				},
				FUNCTION_TYPE = "function",
				Checkboxradio = function () {
					MobileCheckboxradio.call(this);
					BaseKeyboardSupport.call(this);
				},
				KEY_CODES = {
					up: 38,
					down: 40,
					enter: 13
				},
				prototype = new MobileCheckboxradio();

			Checkboxradio.prototype = prototype;

			/**
			* Method initializes widget
			* @param {HTMLElement} element Input element
			*/
			prototype._init = function(element) {
				var self = this;
				if (typeof MobileCheckboxradioPrototype._init === FUNCTION_TYPE) {
					MobileCheckboxradioPrototype._init.call(self, element);
				}

				self.registerActiveSelector("input:not([disabled]):not([type=radio])");
				self.registerActiveSelector(".radio-container");
			};

			/**
			* Builds structure of checkboxradio widget
			* @param {HTMLInputElement} element
			* @return {HTMLInputElement} Built element
			*/
			prototype._build = function(element) {
				wrapInput(element);
				return element;
			};

			/**
			* Binds events to widget
			* @param {HTMLInputElement} element Input element
			*/
			prototype._bindEvents = function(element) {
				document.addEventListener("keyup", this, false);

				if (element.type === "radio") {
					var parentNode = element.parentNode;
					parentNode.addEventListener("keyup", onKeydownContainer, false);
					parentNode.addEventListener("focus", onFocusContainer, false);
					parentNode.addEventListener("blur", onBlurContainer, false);
				} else {
					element.addEventListener("keyup", onKeydownCheckbox, false);
				}
			};

			/**
			* Cleans widget's resources
			* @param {HTMLInputElement} element
			*/
			prototype._destroy = function(element) {
				if (element.type === "radio") {
					var parentNode = element.parentNode;
					parentNode.removeEventListener("keyup", onKeydownContainer, false);
					parentNode.removeEventListener("focus", onFocusContainer, false);
					parentNode.removeEventListener("blur", onBlurContainer, false);
				} else {
					element.removeEventListener("keyup", onKeydownCheckbox, false);
				}

				document.removeEventListener("keyup", this, false);

			};

			/**
			* Returns label connected to input by htmlFor tag
			* @param {HTMLElement} parent Input`s parent
			* @param {string} id Input`s id
			* @return {?HTMLElement} Label or null if not found
			*/
			function getLabelForInput(parent, id) {
				var labels = parent.getElementsByTagName("label"),
					length = labels.length,
					i;
				for (i = 0; i < length; i++) {
					if (labels[i].htmlFor == id) {
						return labels[i];
					}
				}
				return null;
			}

			/**
			 * Method adds span to input.
			 * @param {EventTarget|HTMLElement} element Input element
			 */
			function wrapInput(element) {
				var container = document.createElement("span"),
					parent = element.parentNode,
					label = getLabelForInput(parent, element.id);

				parent.replaceChild(container, element);
				container.appendChild(element);

				if (label) {
					label.style.display = "inline-block";
					if (element.disabled) {
						// make label not focusable (remove button class)
						label.className = "";
					}
					container.appendChild(label);
				}

				if ((element.type === "radio") && (!element.disabled)) {
					container.setAttribute("tabindex", 0);
					container.className = "radio-container";
				}
			}

			/**
			 * Method overrides input behavior on keydown event (checkbox).
			 * @param {Event} event
			 */
			function onKeydownCheckbox(event) {
				var element = event.target;
				if (element) {
					if (event.keyCode === KEY_CODES.enter) {
						element.checked = !element.checked;
						event.stopPropagation();
						event.preventDefault();
					}
				}
			}

			/**
			* Returns radio button stored in container or null
			* @param {HTMLElement} container
			* @return {HTMLInputElement} Returns radio button stored in container or null
			*/
			function findRadioInContainer (container) {
				var children = container.getElementsByTagName("input"),
					length = children.length,
					child = null,
					i;
				for (i = 0; i < length; i++) {
					child = children[i];
					if (child.type === "radio") {
						return child;
					}
				}
				return null;
			}

			/**
			 * Method overrides input behavior on keydown event (radiobutton`s container).
			 * @param {Event} event
			 */
			function onKeydownContainer(event) {
				var element = event.target,
					radio = null;
				if (element) {
					if (event.keyCode === KEY_CODES.enter) {
						radio = findRadioInContainer(element);
						if (radio) {
							radio.checked = !radio.checked;
							event.stopPropagation();
							event.preventDefault();
						}
					}
				}
			}

			/**
			 * Method overrides input behavior on focus event (radiobutton`s container).
			 * @param {Event} event
			 */
			function onFocusContainer(event) {
				var element = event.target,
					radio = null;
				if (element) {
					radio = findRadioInContainer(element);
					if (radio) {
						radio.classList.add(classes.focused);
						event.stopPropagation();
						event.preventDefault();
					}
				}
			}

			/**
			 * Method overrides input behavior on blur event (radiobutton`s container).
			 * @param {Event} event
			 */
			function onBlurContainer(event) {
				var element = event.target,
					radio = null;
				if (element) {
					radio = findRadioInContainer(element);
					if (radio) {
						radio.classList.remove(classes.focused);
					}
				}
			}

			ns.widget.tv.Checkboxradio = Checkboxradio;

			engine.defineWidget(
				"Checkboxradio",
				"input[type='checkbox'], input[type='radio']",
				[],
				Checkboxradio,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Checkboxradio;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
