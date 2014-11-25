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
				 * {Object} List of classes which can be added to widget`s element
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 * @readonly
				 */
				classes = {
					focused: "focus",
					container: "checkboxradio-container",
					checkboxradioInListview: "checkboxradio-in-listview"
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
				 * {Object} Checkboxradio widget prototype
				 * @member ns.widget.tv.Checkboxradio
				 * @private
				 * @static
				 */
				prototype = new MobileCheckboxradio();

			Checkboxradio.prototype = prototype;
			Checkboxradio.classes = classes;

			prototype._buildWrapper = function (element) {
				var wrapper;

				// build wrapper as in profile mobile
				wrapper = MobileCheckboxradio.prototype._buildWrapper.call(this, element);

				// add special class
				wrapper.classList.add(classes.container);
				if ((!element.disabled) && (element.type === "radio") && (!element.classList.contains(classInListview))) {
					wrapper.setAttribute("tabindex", 0);
				}
				return wrapper;
			};

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
			prototype._build = function(element) {
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
			prototype._bindEvents = function(element) {
				var focusablePredecessor,
					parentNode;

				document.addEventListener("keyup", this, false);

				if (element.classList.contains(classInListview)) {
					focusablePredecessor = getInnerFocusablePredecessor(element);
					if (focusablePredecessor !== null) {
						focusablePredecessor.addEventListener("keyup", onKeydownContainer, false);
						focusablePredecessor.addEventListener("focus", onFocusContainer, false);
						focusablePredecessor.addEventListener("blur", onBlurContainer, false);
					}
				} else if (element.type === "radio") {
					parentNode = element.parentNode;
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
				var focusablePredecessor,
					parentNode;

				if (element.classList.contains(classInListview)) {
					focusablePredecessor = getInnerFocusablePredecessor(element);
					if (focusablePredecessor !== null) {
						focusablePredecessor.removeEventListener("keyup", onKeydownContainer, false);
						focusablePredecessor.removeEventListener("focus", onFocusContainer, false);
						focusablePredecessor.removeEventListener("blur", onBlurContainer, false);
					}
				} else if (element.type === "radio") {
					parentNode = element.parentNode;
					parentNode.removeEventListener("keyup", onKeydownContainer, false);
					parentNode.removeEventListener("focus", onFocusContainer, false);
					parentNode.removeEventListener("blur", onBlurContainer, false);
				} else {
					element.removeEventListener("keyup", onKeydownCheckbox, false);
				}

				document.removeEventListener("keyup", this, false);
			};

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
			 * Returns radiobutton / checkbox stored in a container or null
			 * @method findRadioCheckboxInContainer
			 * @param {HTMLElement} container
			 * @return {HTMLInputElement} Returns radio button stored in container or null
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
			 */
			function findRadioCheckboxInContainer (container) {
				var ancestors = container.getElementsByTagName("input"),
					length = ancestors.length,
					ancestor,
					type,
					i;

				for (i = 0; i < length; i++) {
					ancestor = ancestors[i];
					type = ancestor.type;
					if ((type === "radio") || (type === "checkbox")) {
						return ancestor;
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
				var checkboxradio;
				if (event.keyCode === KEY_CODES.enter) {
					// event.target is a container
					checkboxradio = findRadioCheckboxInContainer(event.target);
					if (checkboxradio && (!checkboxradio.disabled)) {
						checkboxradio.checked = !checkboxradio.checked;
						event.stopPropagation();
						event.preventDefault();
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
				// event.target is a container
				var checkboxradio = findRadioCheckboxInContainer(event.target);
				if (checkboxradio && (!checkboxradio.disabled)) {
					checkboxradio.parentNode.focus();
					checkboxradio.classList.add(classes.focused);
					event.stopPropagation();
					event.preventDefault();
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
				// event.target is a container
				var checkboxradio = findRadioCheckboxInContainer(event.target);
				if (checkboxradio && (!checkboxradio.disabled)) {
					checkboxradio.parentNode.blur();
					checkboxradio.classList.remove(classes.focused);
				}
			}

			/**
			 * Method returns first focusable predecessor of
			 * checkboxradio with class name classes.inner
			 * @method getInnerFocusablePredecessor
			 * @param {HTMLElement} Element
			 * @private
			 * @static
			 * @member ns.widget.tv.Checkboxradio
			 */
			function getInnerFocusablePredecessor (element) {
				var predecessor = element.parentNode;
				while (predecessor.getAttribute("tabindex") === null) {
					predecessor = predecessor.parentElement;
					if (!predecessor || !predecessor.getAttribute) {
						return null;
					}
				}
				return predecessor;
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
			function isInListview (element) {
				var selector = engine.getWidgetDefinition("Listview").selector;

				return (ns.util.selectors.getClosestBySelector(element, selector) !== null);
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

			BaseKeyboardSupport.registerActiveSelector(activeSelector);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Checkboxradio;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
