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
 * Checkboxradio widget changes default browser checkboxes and radios to form more adapted to mobile environment.
 *
 * ##Default selectors
 * In default all inputs with type _checkbox_ or _radio_ are changed to checkboxradio widget.
 *
 * ##HTML Examples
 *
 * ### Create checkboxradio
 *
 *	@example
 *	<input type="checkbox" name="checkbox-yes" id="checkbox-yes" />
 *	<label for="checkbox-yes">Yes</label>
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
			"./Button",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Checkboxradio = function () {
					/**
					* @property {Object} options Object with default options
					* @property {string} [options.theme='s'] Widget's theme
					* @member ns.widget.mobile.Checkboxradio
					* @instance
					*/
					this.options = {
						theme: 's'
					};

					this._onLabelClickBound = null;
					this._onInputClickBound = null;
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
				* @property {Function} slice Alias for function Array.slice
				* @member ns.widget.mobile.Checkboxradio
				* @private
				* @static
				*/
				slice = [].slice;

			Checkboxradio.prototype = new BaseWidget();

			/**
			* Finds best matched label for given input: <br>
			* 1. Checks if one of parents is not a label<br>
			* 2. Checks label#for=input.id if input.id is set in parent form, fieldset, page<br>
			* 3. Creates label
			* @method getLabel
			* @param {HTMLElement} input
			* @return {HTMLElement}
			* @private
			* @static
			* @member ns.widget.mobile.Checkboxradio
			*/
			function getLabel(input) {
				var parent = selectors.getClosestByTag(input, "label"),
					label;
				if (parent) { //1
					parent.parentNode.replaceChild(parent.firstElementChild, parent);
					return parent;
				}
				if (input.id) { //2
					parent = selectors.getClosestBySelector(input,
						"form, fieldset, [data-role='page'], [data-role='dialog']");
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
			}

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

			/**
			* Check checkboxradio element
			* @method checkElement
			* @param {ns.widget.mobile.Checkboxradio} instance
			* @private
			* @member ns.widget.mobile.Checkboxradio
			* @new
			*/
			function checkElement(instance) {
				var labelClassList = instance.label.classList,
					iconClassList,
					element = instance.element;
				if (!element.getAttribute("disabled")) {
					if (instance.icon) {
						iconClassList = instance.icon.classList;
						iconClassList.add(instance.checkedicon);
						iconClassList.remove(instance.uncheckedicon);
					}
					labelClassList.add(instance.checkedClass);
					labelClassList.remove(instance.uncheckedClass);
					instance.wrapper.setAttribute(instance.ariaCheckedAttr, true);
				}
			}

			/**
			* Uncheck checkboxradio element
			* @method uncheckElement
			* @param {ns.widget.mobile.Checkboxradio} instance
			* @private
			* @member ns.widget.mobile.Checkboxradio
			* @new
			*/
			function uncheckElement(instance) {
				var labelClassList = instance.label.classList,
					iconClassList,
					element = instance.element;
				if (!element.getAttribute("disabled")) {
					if (instance.icon) {
						iconClassList = instance.icon.classList;
						iconClassList.add(instance.uncheckedicon);
						iconClassList.remove(instance.checkedicon);
					}
					labelClassList.add(instance.uncheckedClass);
					labelClassList.remove(instance.checkedClass);
					instance.wrapper.setAttribute(instance.ariaCheckedAttr, false);
				}
			}

			/**
			* Builds structure of checkboxradio widget
			* @method _build
			* @param {HTMLInputElement} element
			* @return {HTMLInputElement}
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/
			Checkboxradio.prototype._build = function (element) {
				var inputtype = element.getAttribute('type'),
					options = this.options,
					label,
					labelClassList,
					wrapper,
					ariaCheckedAttr,
					icon,
					checkedState,
					checkedClass,
					uncheckedClass,
					uncheckedState,
					checkedicon,
					uncheckedicon,
					activeBtn,
					iconSpan,
					iconClassList,
					iconpos,
					mini;

				//if created dynamically on wrong element, just return from here
				if (inputtype !== "checkbox" && inputtype !== "radio") {
					//_build should always return element
					return element;
				}
				ariaCheckedAttr = inputtype === 'radio' ? 'aria-selected' : 'aria-checked';
				checkedState = inputtype + "-on";
				uncheckedState = inputtype + "-off";
				icon = selectors.getParentsBySelector(element, "[data-type='horizontal']").length ? false : uncheckedState;
				if (!icon) {
					activeBtn = "ui-btn-active";
				}
				checkedClass = "ui-" + checkedState;
				uncheckedClass = "ui-" + uncheckedState;
				checkedicon = "ui-icon-" + checkedState;
				uncheckedicon = "ui-icon-" + uncheckedState;

				label = getLabel(element);
				labelClassList = label.classList;

				//@todo these options should not be passed via DOM element
				mini = dom.inheritAttr(element, "data-mini", "form,fieldset");
				if (mini) {
					label.setAttribute('data-mini', mini);
				}

				iconpos = dom.inheritAttr(element, "data-iconpos", "form,fieldset");
				if (iconpos) {
					label.setAttribute('data-iconpos', iconpos);
				}

				label.setAttribute('data-theme', options.theme);
				label.setAttribute('data-icon', icon);
				label.setAttribute('data-shadow', false);
				label.setAttribute('data-bar', true);
				engine.instanceWidget(label, "Button");
				iconSpan = label.getElementsByClassName('ui-icon')[0];
				if (iconSpan) {
					iconClassList = iconSpan.classList;
				}

				// Wrap the input + label in a div
				wrapper = '<div role="' + inputtype + '" class="ui-' + inputtype;
				if (element.classList.contains("favorite")) {
					wrapper += ' favorite';
				}
				wrapper += '"></div>';

				//make sure label is after input
				if (element.nextElementSibling) {
					element.parentNode.insertBefore(label, element.nextElementSibling);
				} else {
					element.parentNode.appendChild(label);
				}
				dom.wrapInHTML([element, label], wrapper);
				wrapper = element.parentNode;

				if (element.hasAttribute('checked')) {
					// quick fix to resolve problem in tests when sometimes attribute checked isn't proper interpreted to property in object
					element.checked = true;
				}
				if (element.checked) {
					labelClassList.add(checkedClass);
					if (!icon) {
						labelClassList.add(activeBtn);
					}
					labelClassList.remove(uncheckedClass);
					if (iconSpan) {
						iconClassList.add(checkedicon);
						iconClassList.remove(uncheckedicon);
					}
					wrapper.setAttribute(ariaCheckedAttr, true);
				} else {
					labelClassList.remove(checkedClass);
					if (!icon) {
						labelClassList.remove(activeBtn);
					}
					labelClassList.add(uncheckedClass);
					if (iconSpan) {
						iconClassList.add(uncheckedicon);
						iconClassList.remove(checkedicon);
					}
					wrapper.setAttribute(ariaCheckedAttr, false);
				}

				element.checked = element.getAttribute('checked') === 'checked';

				if (element.getAttribute("disabled")) {
					wrapper.classList.add('ui-disabled');
				} else {
					wrapper.classList.remove('ui-disabled');
				}
				return element;
			};

			/**
			* Inits widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/
			Checkboxradio.prototype._init = function (element) {
				this.label = getLabel(element);
				this.icon = this.label.getElementsByClassName('ui-icon')[0];
				this.wrapper = element.parentNode;
				this.inputtype = element.getAttribute('type');
				this.checkedClass = 'ui-' + this.inputtype + '-on';
				this.uncheckedClass = 'ui-' + this.inputtype + '-off';
				this.ariaCheckedAttr = this.inputtype === 'radio' ? 'aria-selected' : 'aria-checked';
				this.checkedicon = "ui-icon-" + this.inputtype + '-on';
				this.uncheckedicon = "ui-icon-" + this.inputtype + '-off';
			};

			/**
			* Binds events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/
			Checkboxradio.prototype._bindEvents = function () {
				this._onLabelClickBound = onLabelClick.bind(null, this);
				this._onInputClickBound = onInputClick.bind(null, this);
				this.label.addEventListener('vclick', this._onLabelClickBound, true);
				this.element.addEventListener('vclick', this._onInputClickBound, false);
			};

			/**
			* Returns either a set of radios with the same name attribute or a single checkbox
			* @method getInputSet
			* @return {Array}
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
			*/
			Checkboxradio.prototype._getInputSet = function () {
				var parent;

				if (this.inputtype === 'checkbox') {
					return [this.element];
				}

				parent = selectors.getClosestBySelector(this.element,
					"form, fieldset, [data-role='page'], [data-role='dialog']");

				if (parent) {
					return slice.call(parent.querySelectorAll(
						"input[name='" + this.element.name + "'][type='" + this.inputtype + "']"
					));
				}

				return [];
			};

			/**
			* Updates all others checkboxradio widgets with the same name attribute (only radios)
			* @method _updateAll
			* @protected
			* @member ns.widget.mobile.Checkboxradio
			* @instance
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
			* @instance
			*/

			Checkboxradio.prototype.refresh = function () {
				var element = this.element;

				if (element.checked) {
					checkElement(this);
				} else {
					uncheckElement(this);
				}

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
			* @instance
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
			* @instance
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
			* @instance
			*/
			Checkboxradio.prototype._destroy = function () {
				this.label.removeEventListener('vclick', this._onLabelClickBound, true);
				this.element.removeEventListener('vclick', this._onInputClickBound, false);
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
			* @instance
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
			* @instance
			 * @protected
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
							uncheckElement(engine.getBinding(checkedElement));
						}
						checkElement(engine.getBinding(radios[i]));
						return this;
					}
				}
				return this;
			};

			// definition
			ns.widget.mobile.Checkboxradio = Checkboxradio;
			engine.defineWidget(
				"Checkboxradio",
				"input[type='checkbox'], input[type='radio'], .ui-checkbox",
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
