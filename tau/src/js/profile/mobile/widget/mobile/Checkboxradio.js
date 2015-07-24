/*global window, define */
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
 * Checkboxradio widget changes default browser checkboxes and radios to form more adapted to mobile environment.
 *
 * ##Default selectors
 * By default all inputs with:
 *
 * - type "checkbox" and without class "ui-slider-switch-input"
 * - type "radio"
 * - class "ui-checkbox"
 *
 * are changed to Checkboxradio widget.
 *
 * ##Manual constructor - checkbox
 * For manual creation of Checkboxradio widget with checkbox content you can use constructor of widget:
 *
 *	@example
 *	<!-- Widget structure -->
 *	<input type="checkbox" id="checkbox-1"></input>
 *	<label for="checkbox-1">Label1</label>
 *	<input class="ui-checkbox" id="checkbox-2"></input>
 *	<label for="checkbox-2">Label2</label>
 *	<script>
 *	var checkbox = document.getElementById("checkbox-1"),
 *		widget = tau.widget.Checkboxradio(checkbox),
 *		checkbox2 = document.getElementById("checkbox-2"),
 *		widget2 = tau.widget.Checkboxradio(checkbox2);
 *	</script>
 *
 * ##Manual constructor - radio
 * For manual creation of Checkboxradio widget with radio content you can use constructor of widget:
 *
 *	@example
 *	<!-- Widget structure -->
 *	<input type="radio" id="radio-1"></input>
 *	<label for="radio-1">Label1</label>
 *	<script>
 *	var radio = document.getElementById("radio-1"),
 *		widget = tau.widget.Checkboxradio(radio);
 *	</script>
 *
 * ##HTML Examples
 *
 * ###Setting checkbox checked / unchecked
 *
 *	@example
 *	<!-- Widget structure -->
 *	<input type="checkbox" id="checkbox-1"></input>
 *	<label for="checkbox-1">Label1</label>
 *	<script>
 *	var checkbox = document.getElementById("checkbox-1");
 *	// Checked
 *	checkbox.checked = true;
 *	// Unchecked
 *	checkbox.checked = false;
 *	</script>
 *
 * ###Setting radio checked / unchecked
 *
 *	@example
 *	<!-- Widget structure -->
 *	<input type="radio" id="radio-1"></input>
 *	<label for="radio-1">Label1</label>
 *	<script>
 *	var radio = document.getElementById("radio-1");
 *	// Checked
 *	radio.checked = true;
 *	// Unchecked
 *	radio.checked = false;
 *	</script>
 *
 * ###Setting disabled
 *
 *	@example
 *	<!-- Widget structure -->
 *	<input type="checkbox" id="checkbox-1" disabled="disabled"></input>
 *	<label for="checkbox-1">Label1</label>
 *	<input type="radio" id="radio-1" disabled="disabled"></input>
 *	<label for="radio-1">Label2</label>
 *
 * @class ns.widget.mobile.Checkboxradio
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/selectors",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/manipulation",
			"../../../../core/widget/core/Button",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Checkboxradio = function () {
					var self = this;
					/**
					* @property {Object} options Object with default options
					* @property {string} [options.theme='s'] Widget's theme
					* @member ns.widget.mobile.Checkboxradio
					*/
					self.options = {
						theme: 's'
					};

					self._callbacks = {
						onLabelClick : null,
						onInputClick : null
					}

					self.inputType = "";
					self.checkedClass = "";
					self.uncheckedClass = "";
					self.ariaCheckedAttr = "";
					self.checkedIcon = "";
					self.uncheckedIcon = "";

					self.label = null;
					self.icon = null;
					self.wrapper = null;
				},
				/**
				* @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* @property {Object} engine Alias for class ns.engine
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				engine = ns.engine,
				/**
				* @property {Object} selectors Alias for class ns.util.selectors
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				selectors = ns.util.selectors,
				/**
				* @property {Object} dom Alias for class ns.util.DOM
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				dom = ns.util.DOM,
				/**
				* @property {Object} events Alias for class ns.event
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				events = ns.event,
				/**
				 * {Object} List of classes which can be added to widget`s element
				 * @member ns.widget.mobile.Checkboxradio
				 * @private
				 * @static
				 */
				classes = {
					DISABLED: "ui-disabled",
					ICON_PREFIX: "ui-icon-",
					ICON_WRAPPER: "ui-icon-wrapper",
					ICON: "ui-icon",
					OFF: "-off",
					ON: "-on",
					UI: "ui-"
				},
				/**
				* @property {Function} slice Alias for function Array.slice
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				slice = [].slice;

			Checkboxradio.prototype = new BaseWidget();

			/**
			 * Dictionary for slider related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.Checkboxradio
			 * @static
			 * @readonly
			 */
			Checkboxradio.classes = classes;

			/**
			 * Function fires on label click event
			 * @method onLabelClick
			 * @param {ns.widget.mobile.Checkboxradio} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.Checkboxradio
			 */
			function onLabelClick(self, event) {
				var element = self.element;

				events.preventDefault(event);
				events.stopPropagation(event);
				events.stopImmediatePropagation(event);
				if (element.getAttribute("disabled")) {
					return;
				}

				// Always set checked to true for radios
				// for checkboxes toggle value
				element.checked = (element.type === 'checkbox') ? !element.checked : true;

				if (element.checked) {
					self._getInputSet().forEach(function (el) {
						if (element !== el) {
							el.checked = false;
						}
					});
				}

				self._updateAll();
				event.stopPropagation();
				event.preventDefault();
			}

			/**
			 * Function fires on input click event
			 * @method onInputClick
			 * @param {ns.widget.mobile.Checkboxradio} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.Checkboxradio
			 */
			function onInputClick(self, event) {
				var element = self.element;

				if (element.getAttribute("disabled")) {
					event.preventDefault();
					return;
				}

				element.checked = !element.checked;

				if (element.checked) {
					self._getInputSet().forEach(function (el) {
						if (element !== el) {
							el.checked = false;
						}
					});
				}

				self._updateAll();
			}

			function setStyleForChecked(self) {
				var labelClassList = self.label.classList,
					iconClassList;
				if (self.icon) {
					iconClassList = self.icon.classList;
					iconClassList.add(self.checkedIcon);
					iconClassList.remove(self.uncheckedIcon);
				}
				labelClassList.add(self.checkedClass);
				labelClassList.remove(self.uncheckedClass);
				self.wrapper.setAttribute(self.ariaCheckedAttr, true);
			}

			function setStyleForUnchecked(self) {
				var labelClassList = self.label.classList,
					iconClassList;
				if (self.icon) {
					iconClassList = self.icon.classList;
					iconClassList.add(self.uncheckedIcon);
					iconClassList.remove(self.checkedIcon);
				}
				labelClassList.add(self.uncheckedClass);
				labelClassList.remove(self.checkedClass);
				self.wrapper.setAttribute(self.ariaCheckedAttr, false);
			}
			/**
			* Check or uncheck checkboxradio element
			* @method setCheckboxradioStatus
			* @param {ns.widget.mobile.Checkboxradio} self
			* @param {boolean} status
			* @private
			* @member ns.widget.mobile.Checkboxradio
			* @new
			*/
			function setCheckboxradioStatus(self, status) {
				var element = self.element;
				if (!element.getAttribute("disabled")) {
					if (status) {
						// checkbox is checked
						setStyleForChecked(self);
					} else {
						// checkbox is checked
						setStyleForUnchecked(self);
					}
				}
			}

			/**
			* Finds best matched label for given input: <br>
			* 1. Checks if one of parents is not a label<br>
			* 2. Checks label#for=input.id if input.id is set in parent form, fieldset, page<br>
			* 3. Creates label
			* @method _findLabel
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			*/
			Checkboxradio.prototype._findLabel = function() {
				var input = this.element,
					parent = selectors.getClosestByTag(input, "label"),
					selector = [],
					definition,
					label;
				if (parent) { //1
					parent.parentNode.replaceChild(parent.firstElementChild, parent);
					return parent;
				}
				if (input.id) { //2
					selector.push("form, fieldset");
					// page
					definition = engine.getWidgetDefinition("Page");
					if (definition) {
						selector.push(definition.selectors.toString());
					}
					// dialog
					definition = engine.getWidgetDefinition("Dialog");
					if (definition) {
						selector.push(definition.selectors.toString());
					}
					// find parent
					parent = selectors.getClosestBySelector(input, selector.toString());
					if (parent) {
						label = parent.querySelector("label[for='" + input.id + "']");
						if (label) {
							return label;
						}
					}
				}
				//3
				label = document.createElement("label");
				if (input.id) {
					label.setAttribute("for", input.id);
				}
				return label;
			};

			Checkboxradio.prototype._buildLabel = function (element) {
				var inputType =  this.inputType,
					options = this.options,
					checkedState,
					checkedClass,
					icon,
					label,
					mini,
					iconpos;

				icon = selectors.getParentsBySelector(element, "[data-type='horizontal']").length ? false : inputType + classes.OFF;
				label = this._findLabel();

				//@todo these options should not be passed via DOM element
				mini = dom.inheritAttr(element, "data-mini", "form,fieldset");
				if (mini) {
					dom.setNSData(label, "mini", mini);
				}
				iconpos = dom.inheritAttr(element, "data-iconpos", "form,fieldset");
				if (iconpos) {
					dom.setNSData(label, "iconpos", iconpos);
				}

				dom.setNSData(label, "theme", options.theme);
				dom.setNSData(label, "icon", icon);
				dom.setNSData(label, "shadow", false);
				dom.setNSData(label, "bar", true);
				engine.instanceWidget(label, "Button");

				//make sure label is after input
				if (element.nextElementSibling) {
					element.parentNode.insertBefore(label, element.nextElementSibling);
				} else {
					element.parentNode.appendChild(label);
				}

				if (!icon) {
					if (element.checked) {
						label.classList.add(ns.widget.mobile.Button.classes.uiBtnActive);
					} else {
						label.classList.remove(ns.widget.mobile.Button.classes.uiBtnActive);
					}
				}

				return label;
			};

			Checkboxradio.prototype._buildWrapper = function (element) {
				var label = this._findLabel(),
					inputType = this.inputType,
					ariaCheckedAttr = this.ariaCheckedAttr,
					wrapper;

				// Wrap the input + label in a div
				wrapper = "<div role='" + inputType + "' class='ui-" + inputType;
				if (element.classList.contains("favorite")) {
					wrapper += " favorite";
				}
				wrapper += "'></div>";

				dom.wrapInHTML([element, label], wrapper);
				// wrapper's node
				wrapper = element.parentNode;

				if (element.checked) {
					wrapper.setAttribute(ariaCheckedAttr, true);
				} else {
					wrapper.setAttribute(ariaCheckedAttr, false);
				}

				if (element.getAttribute("disabled")) {
					wrapper.classList.add(classes.DISABLED);
				} else {
					wrapper.classList.remove(classes.DISABLED);
				}

				return wrapper;
			};

			Checkboxradio.prototype._buildIcon = function (element) {
				var inputType = this.inputType,
					icon,
					iconParent,
					iconWrapper;

				icon = this._findLabel().getElementsByClassName(classes.ICON)[0];
				iconParent = icon && icon.parentElement;
				iconWrapper = document.createElement("span");

				if (icon) {
					iconWrapper.classList.add(classes.ICON_WRAPPER);
					iconWrapper.appendChild(icon);
					iconParent.appendChild(iconWrapper);
				}

				return icon;
			};

			/**
			* Builds structure of checkboxradio widget
			* @method _build
			* @param {HTMLInputElement} element
			* @return {HTMLInputElement}
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			*/
			Checkboxradio.prototype._build = function (element) {
				var self = this,
					inputType = element.getAttribute("type");

				//if created dynamically on wrong element, just return from here
				if (inputType !== "checkbox" && inputType !== "radio") {
					//_build should always return element
					return element;
				}

				if (element.hasAttribute('checked')) {
					// quick fix to resolve problem in tests when sometimes attribute checked isn't proper interpreted to property in object
					element.checked = true;
				}

				// set classes
				self.element = element;
				self.inputType = inputType;
				self.checkedClass = classes.UI + inputType + classes.ON;
				self.uncheckedClass = classes.UI + inputType + classes.OFF;
				self.ariaCheckedAttr = inputType === "radio" ? "aria-selected" : "aria-checked";
				self.checkedIcon = classes.ICON_PREFIX + inputType + classes.ON;
				self.uncheckedIcon = classes.ICON_PREFIX + inputType + classes.OFF;

				// create elements
				self.label = self._buildLabel(element);
				self.icon = self._buildIcon(element);
				self.wrapper = self._buildWrapper(element);

				// check or uncheck element
				if (element.checked) {
					setStyleForChecked(self);
				} else {
					setStyleForUnchecked(self);
				}

				return element;
			};

			/**
			* Inits widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			*/
			Checkboxradio.prototype._init = function (element) {
				var self = this;
				self.label = self._findLabel();
				self.icon = self.label.getElementsByClassName("ui-icon")[0];
				self.wrapper = element.parentNode;
				self.inputType = element.getAttribute("type");
				self.checkedClass = classes.UI + self.inputType + classes.ON;
				self.uncheckedClass = classes.UI + self.inputType + classes.OFF;
				self.ariaCheckedAttr = self.inputType === "radio" ? "aria-selected" : "aria-checked";
				self.checkedIcon = classes.ICON_PREFIX + self.inputType + classes.ON;
				self.uncheckedIcon = classes.ICON_PREFIX + self.inputType + classes.OFF;
			};

			/**
			* Binds events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			*/
			Checkboxradio.prototype._bindEvents = function () {
				var callbacks = this._callbacks;

				callbacks.onLabelClick = onLabelClick.bind(null, this);
				callbacks.onInputClick = onInputClick.bind(null, this);
				this.label.addEventListener('vclick', callbacks.onLabelClick, true);
				this.element.addEventListener('vclick', callbacks.onInputClick, false);
			};

			/**
			* Returns either a set of radios with the same name attribute or a single checkbox
			* @method getInputSet
			* @return {Array}
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			*/
			Checkboxradio.prototype._getInputSet = function () {
				var parent;

				if (this.inputType === 'checkbox') {
					return [this.element];
				}

				parent = selectors.getClosestBySelector(this.element,
					"form, fieldset, [data-role='page'], [data-role='dialog']");

				if (parent) {
					return slice.call(parent.querySelectorAll(
						"input[name='" + this.element.name + "'][type='" + this.inputType + "']"
					));
				}

				return [];
			};

			/**
			* Updates all others checkboxradio widgets with the same name attribute (only radios)
			* @method _updateAll
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			*/
			Checkboxradio.prototype._updateAll = function () {
				this._getInputSet().forEach(function (el) {
					var widget = engine.getBinding(el);

					if (widget) {
						if (widget.element.checked || widget.element.type === "checkbox") {
							events.trigger(widget.element, "change");
						}
						widget.refresh();
					}
				});
			};

			/**
			* Refreshes widget
			* @method refresh
			* @member ns.widget.mobile.Checkboxradio
			*/

			Checkboxradio.prototype.refresh = function () {
				var element = this.element;

				setCheckboxradioStatus(this, element.checked);

				if (element.getAttribute("disabled")) {
					this.disable();
				} else {
					this.enable();
				}
			};

			/**
			* Enables widget
			* @method _enable
			* @member ns.widget.mobile.Checkboxradio
			* @protected
			*/
			Checkboxradio.prototype._enable = function () {
				dom.removeAttribute(this.element, "disabled");
				this.wrapper.classList.remove('ui-disabled');
			};

			/**
			* Disables widget
			* @method _disable
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			*/
			Checkboxradio.prototype._disable = function () {
				dom.setAttribute(this.element, "disabled", true);
				this.wrapper.classList.add('ui-disabled');
			};

			/**
			* Cleans widget's resources
			* @method _destroy
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			*/
			Checkboxradio.prototype._destroy = function () {
				var self = this,
					callbacks = self._callbacks;
				self.label.removeEventListener('vclick', callbacks.onLabelClick, true);
				self.element.removeEventListener('vclick', callbacks.onInputClick, false);
			};

			/**
			 * Return checked checkboxradio element
			 * @method getCheckedElement
			 * @return {?HTMLElement}
			 * @member ns.widget.mobile.Checkboxradio
			 * @new
			 */
			Checkboxradio.prototype.getCheckedElement = function () {
				var radios = this._getInputSet(),
					i,
					max = radios.length;
				for (i = 0; i < max; i++) {
					if (radios[i].checked) {
						return radios[i];
					}
				}
				return null;
			};

			/**
			 * Returns value of checkbox if it is checked or value of radios with the same name
			 * @method _getValue
			 * @member ns.widget.mobile.Checkboxradio
			 * @return {?string}
			 * @protected
			 * @new
			 */
			Checkboxradio.prototype._getValue = function () {
				var checkedElement = this.getCheckedElement();

				if (checkedElement) {
					return checkedElement.value;
				}

				return null;
			};

			/**
			* Check element with value
			* @method _setValue
			* @param {string} value
			* @member ns.widget.mobile.Checkboxradio
			* @chainable
			* @new
			*/
			Checkboxradio.prototype._setValue = function (value) {
				var radios = this._getInputSet(),
					checkedElement,
					i,
					max = radios.length;

				for (i = 0; i < max; i++) {
					if (radios[i].value === value) {
						checkedElement = this.getCheckedElement();
						if (checkedElement) {
							setCheckboxradioStatus(engine.getBinding(checkedElement), false);
						}
						setCheckboxradioStatus(engine.getBinding(radios[i]), true);
						return this;
					}
				}
				return this;
			};

			// definition
			ns.widget.mobile.Checkboxradio = Checkboxradio;
			engine.defineWidget(
				"Checkboxradio",
				"input[type='checkbox']:not(.ui-slider-switch-input):not([data-role='toggleswitch']):not(.ui-toggleswitch)," +
				"input[type='radio']," +
				"input.ui-checkbox",
				[
					"enable",
					"disable",
					"refresh"
				],
				Checkboxradio,
				'mobile'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Checkboxradio;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
