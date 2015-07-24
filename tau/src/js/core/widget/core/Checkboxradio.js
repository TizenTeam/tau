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
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core",
			"../../engine",
			"../../util/selectors",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget  = ns.widget.BaseWidget,
				engine = ns.engine,
				selectors = ns.util.selectors,
				slice = [].slice,
				Checkboxradio = function () {
					var self = this;

					self._label = null;
					self._inputtype = null;
				},
				classes = {
					DISABLED: "ui-state-disabled",
					UI_PREFIX: "ui-"
				},
				prototype = new BaseWidget();

			Checkboxradio.prototype = prototype;

			prototype._build = function (element) {
				var inputtype = element.getAttribute("type"),
					elementClassList = element.classList;

				if (inputtype !== "checkbox" && inputtype !== "radio") {
					//_build should always return element
					return element;
				}

				elementClassList.add(classes.UI_PREFIX + inputtype);

				return element;
			};

			/**
			* Inits widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.Checkboxradio
			* @instance
			*/
			prototype._init = function (element) {
				var self = this;

				self._label = element.labels ? element.labels[0] : null;
				self._inputtype = element.getAttribute("type");
			};

			/**
			* Returns either a set of radios with the same name attribute or a single checkbox
			* @method getInputSet
			* @return {Array}
			* @protected
			* @member ns.widget.Checkboxradio
			* @instance
			*/
			prototype._getInputSet = function () {
				var self = this,
					element = self.element,
					parent;

				if (self._inputtype === "checkbox") {
					return [element];
				}

				parent = selectors.getClosestBySelector(element, "form, fieldset, .ui-page, [data-role='page'], [data-role='dialog']");

				if (parent) {
					return slice.call(parent.querySelectorAll("input[name='" + element.name + "'][type='" + self._inputtype + "']"));
				}

				return [];
			};

			/**
			* Refreshes widget
			* @method _refresh
			* @member ns.widget.Checkboxradio
			* @instance
			*/
			prototype._refresh = function () {
				var self = this,
					element = this.element;

				if (element.getAttribute("disabled")) {
					self._disable();
				} else {
					self._enable();
				}
			};

			/**
			* Enables widget
			* @method _enable
			* @member ns.widget.Checkboxradio
			* @protected
			* @instance
			*/
			prototype._enable = function (element) {
				if (element) {
					element.classList.remove(classes.DISABLED);
					element.removeAttribute("disabled");
				}
			};

			/**
			* Disables widget
			* @method _disable
			* @protected
			* @member ns.widget.Checkboxradio
			* @instance
			*/
			prototype._disable = function (element) {
				if (element) {
					element.classList.add(classes.DISABLED);
					element.setAttribute("disabled", true);
				}
			};

			/**
			* Return checked checkboxradio element
			* @method getCheckedElement
			* @return {?HTMLElement}
			* @member ns.widget.Checkboxradio
			* @new
			*/
			prototype.getCheckedElement = function () {
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
			* @member ns.widget.Checkboxradio
			* @return {?string}
			* @protected
			* @instance
			* @new
			*/
			prototype._getValue = function () {
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
			* @member ns.widget.Checkboxradio
			* @chainable
			* @instance
			* @protected
			* @new
			*/
			prototype._setValue = function (value) {
				var self = this,
					radios = self._getInputSet(),
					checkedElement,
					i,
					max = radios.length;

				for (i = 0; i < max; i++) {
					if (radios[i].value === value) {
						checkedElement = self.getCheckedElement();
						if (checkedElement) {
							checkedElement.checked = false;
						}
						radios[i].checked = true;
						return self;
					}
				}
				return self;
			};

			/**
			* Cleans widget's resources
			* @method _destroy
			* @protected
			* @member ns.widget.Checkboxradio
			* @instance
			*/
			prototype._destroy = function () {
				var self = this;

				self._label = null;
				self._inputtype = null;
			};

			// definition
			ns.widget.core.Checkboxradio = Checkboxradio;
			engine.defineWidget(
				"Checkboxradio",
				"input[type='checkbox']:not(.ui-slider-switch-input):not([data-role='toggleswitch']):not(.ui-toggleswitch), " +
				"input[type='radio'], " +
				"input.ui-checkbox, " +
				"input.ui-radio",
				[],
				Checkboxradio,
				""
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Checkboxradio;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
