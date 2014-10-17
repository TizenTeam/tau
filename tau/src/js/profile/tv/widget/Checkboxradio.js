/*global window, define, ns */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
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
				 * {Object} List of classes which can be added to widget`s element
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 * @readonly
				 */
				classes = {
					focused: "focus"
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
					MobileCheckboxradio.call(this);
					BaseKeyboardSupport.call(this);
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
					enter: 13
				},
				/**
				 * {Object} Checkboxradio widget prototype
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 */
				prototype = new MobileCheckboxradio();

			Checkboxradio.prototype = prototype;

			/**
			 * Builds structure of checkboxradio widget
			 * @method _build
			 * @param {HTMLInputElement} element
			 * @return {HTMLInputElement} Built element
			 * @protected
			 * @member ns.widget.tv.Checkboxradio
			 */
			prototype._build = function(element) {
				wrapInput(element);
				return element;
			};

			/**
			 * Binds events to widget
			 * @method _bindEvents
			 * @param {HTMLInputElement} element Input element
			 * @protected
			 * @member ns.widget.tv.Checkboxradio
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
			 * @method _destroy
			 * @param {HTMLInputElement} element
			 * @protected
			 * @member ns.widget.tv.Checkboxradio
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
			 * @method getLabelForInput
			 * @param {HTMLElement} parent Input`s parent
			 * @param {string} id Input`s id
			 * @return {?HTMLElement} Label or null if not found
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
			 */
			function getLabelForInput(parent, id) {
				var labels = parent.getElementsByTagName("label"),
					length = labels.length,
					i;
				for (i = 0; i < length; i++) {
					if (labels[i].htmlFor === id) {
						return labels[i];
					}
				}
				return null;
			}

			/**
			 * Method adds span to input.
			 * @method wrapInput
			 * @param {EventTarget|HTMLElement} element Input element
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
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
			 * @method onKeydownCheckbox
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
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
			 * @method findRadioInContainer
			 * @param {HTMLElement} container
			 * @return {HTMLInputElement} Returns radio button stored in container or null
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
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
			 * @method onKeydownContainer
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
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
			 * @method onFocusContainer
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
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
			 * @method onBlurContainer
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
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

			// definition
			ns.widget.tv.Checkboxradio = Checkboxradio;

			engine.defineWidget(
				"Checkboxradio",
				"input[type='checkbox'], input[type='radio']",
				[],
				Checkboxradio,
				"tv",
				true
			);

			BaseKeyboardSupport.registerActiveSelector("input[type='radio'],[type='checkbox']");

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Checkboxradio;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
