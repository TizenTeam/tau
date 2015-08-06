/*global window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true */
/**
 * # Toggle Switch Component
 * Shows a 2-state switch.
 *
 * The toggle switch widget shows a 2-state switch on the screen.
 * If defined with select type with options it creates toggles
 * On the toggle its possible to tap one side of the switch.
 *
 * We still support toggles defined with select tag for backward compatibility
 *
 * ## Default selectors
 * INPUT tags with _data-role=toggleswitch_ or SELECT tags
 * with _data-role=toggleswitch_
 * changed to toggle switch
 * To add a toggle switch widget to the application, use the following code:
 *
 *		@example
 *		<input type="checkbox" data-role="toggleswitch">
 *
 *		@example
 *		<select name="flip-11" id="flip-11" data-role="toggleswitch">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *
 *		@example
 *		<select name="flip-11" id="flip-11" data-role="toggleswitch">
 *			<option value="off">off option</option>
 *			<option value="on">on option</option>
 *		</select>
 *
 * ## Manual constructor
 * For manual creation of toggle switch widget you can use constructor of
 * widget from **tau** namespace:
 *
 *		@example
 *		<select id="toggle" name="flip-11" id="flip-11" data-role="toggleswitch"
 *		data-mini="true">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *		<script>
 *			var toggleElement = document.getElementById("toggle"),
 *				toggle = tau.widget.ToggleSwitch(toggleElement);
 *		</script>
 *
 * ## JavaScript API
 *
 * ToggleSwitch widget hasn't JavaScript API.
 *
 * @class ns.widget.mobile.ToggleSwitch
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
		 	"../../../../core/engine",
		 	"../../../../core/theme",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/manipulation",
			"../../../../core/event",
			"../../../../core/widget/core/Button",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var ToggleSwitch = function () {
					var self = this;
						self._ui = {};
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				events = ns.event,

				classes = {
					toggleContainer: "ui-toggle-container",
					toggle: "ui-toggle-switch",
					toggleHandler: "ui-switch-handler"
				},
				keyCode = {
					HOME: 36,
					END: 35,
					PAGE_UP : 33,
					PAGE_DOWN: 34,
					UP: 38,
					RIGHT: 39,
					DOWN: 40,
					LEFT: 37
				};

			ToggleSwitch.prototype = new BaseWidget();

			/**
			 * Dictionary for ToggleSwitch related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.ToggleSwitch
			 * @static
			 * @readonly
			 */
			ToggleSwitch.classes = classes;

			/**
			* Dictionary for keyboard codes
			* @property {Object} keyCode
			* @member ns.widget.mobile.ToggleSwitch
			* @static
			* @readonly
			*/
			ToggleSwitch.keyCode = keyCode;


			/**
			* Callback change the value of input type=checkbox
			* (method stricly for toggleswitch based oninput tag)
			* @method onChangeValue
			* @param {ns.widget.mobile.ToggleSwitch} self
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function onChangeValue(self){
				var element = self.element;

				element.selectedIndex = (self._ui.input.checked) ? 1 : 0;

				if (self._type === "select") {
					events.trigger(element, "change");
				}
			}

			/**
			* Simplify creating dom elements
			* (method stricly for toggleswitch based oninput tag)
			* @method createElement
			* @param {String} name
			* @return {HTMLElement}
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function createElement(name) {
				return document.createElement(name);
			}

			/**
			* Creates and set up input element
			* @method setUpInput
			* @return {HTMLElement}
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function setUpInput() {
				var inputElement = createElement("input");

				inputElement.type = "checkbox";
				return inputElement;
			}

			/**
			* Build Toggle based on Select Tag
			* @method buildToggleBasedOnSelectTag
			* @param {HTMLElement} element
			* @param {HTMLElement} divHandler
			* @param {HTMLElement} toggleContainer
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function buildToggleBasedOnSelectTag(element, divHandler, toggleContainer) {
				var inputElement;

				element.parentNode.insertBefore(toggleContainer, element);
				inputElement = setUpInput();

				if (element.hasAttribute("disabled")) {
					inputElement.setAttribute("disabled", "disabled");
				}
				inputElement.className = classes.toggle;

				toggleContainer.appendChild(inputElement);
				toggleContainer.appendChild(divHandler);
				toggleContainer.appendChild(element);

			}

			/**
			* Build Toggle based on Input Tag
			* @method buildToggleBasedOnInputTag
			* @param {HTMLElement} element
			* @param {HTMLElement} divHandler
			* @param {HTMLElement} toggleContainer
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function buildToggleBasedOnInputTag(element, divHandler, toggleContainer) {
				element.className = classes.toggle;

				element.parentNode.insertBefore(toggleContainer, element);
				toggleContainer.appendChild(element);
				toggleContainer.appendChild(divHandler);
			}

			/**
			 * Build ToggleSwitch
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._build = function (element) {
				var divHandler = createElement("div"),
					toggleContainer = createElement("div"),
					controlType = element.nodeName.toLowerCase();

				toggleContainer.className = classes.toggleContainer;
				divHandler.className = classes.toggleHandler;

				if (controlType === "input") {
					buildToggleBasedOnInputTag(element, divHandler, toggleContainer);
				}
				if (controlType === "select" || controlType === "tau-toggleswitch") {
					//hide element
					element.style.display = "none";
					buildToggleBasedOnSelectTag(element, divHandler, toggleContainer);
				}

				// check type of widget, based on select has option tags
				this._type = element.children.length ? "select" : "input";

				return element;
			};

			/**
			* Initiate widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.ToggleSwitch
			* @instance
			*/
			ToggleSwitch.prototype._init = function (element) {
				this._ui.input = element.parentElement.firstChild;
			};

			/**
			 * Get value of toggle switch. If widget is based on input type
			 * tag otherwise it return index of the element
			 * @method _getValue
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._getValue = function () {
				var self = this,
					element = self.element;

				return self._type === "input" ?
					parseFloat(element.value) : element.selectedIndex;
			};

			/**
			 * Set value of toggle switch
			 * @method _setValue
			 * @param {string} value
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._setValue = function (value) {
				var self = this,
					element = self.element;

				if (self._type === "input") {
					element.value = value;
				}
				if (self._type === "select") {
					element.selectedIndex = value;
				}
			};

			/**
			* Binds events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.ToggleSwitch
			* @instance
			*/
			ToggleSwitch.prototype._bindEvents = function () {
				var self = this;

				self._onChangeValue = onChangeValue.bind(null, self);
				self._ui.input.addEventListener("change",
						self._onChangeValue, true);
			};

			/**
			 * remove attributees when destroyed
			 * @method removeAttributesWhenDestroy
			 * @param {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function removeAttributesWhenDestroy(element) {
				element.removeAttribute("data-tau-name");
				element.removeAttribute("aria-disabled");
				element.removeAttribute("data-tau-bound");
				element.removeAttribute("data-tau-built");
			}

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._destroy = function () {
				var self = this,
					element = self.element,
					tagName = self._type,
					container = element.parentElement;

				self._ui.input.removeEventListener("change",
						self._onChangeValue, true);

				removeAttributesWhenDestroy(element);

				//remove visible representative
				container.parentElement.insertBefore(element, container);
				container.parentElement.removeChild(container);

				if (tagName === "input") {
					element.classList.remove(classes.toggle);
				}

				events.trigger(document, "destroyed", {
					widget: "ToggleSwitch",
					parent: element.parentNode
				});
			};

			ns.widget.mobile.ToggleSwitch = ToggleSwitch;
			engine.defineWidget(
				"ToggleSwitch",
				"input[data-role='toggleswitch']," +
				"select[data-role='toggleswitch']," +
				"select.ui-toggleswitch," +
				"input.ui-toggleswitch",
				[],
				ToggleSwitch,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.ToggleSwitch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
