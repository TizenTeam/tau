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
 * #Progress Bar Widget
 *
 * ##Manual constructor
 * ###For manual creation of progressbar widget you can use constructor of widget:
 *
 *	@example
 *	var progressbar = ns.engine.instanceWidget(document.getElementById('foo'), 'progressbar');
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	var progressbar = $('#foo').progressbar();
 *
 * ##HTML Examples
 * ###Create simple progressbar from div using data-role:
 *
 *	@example
 *	<div data-role="progressbar"></div>
 *
 * ##Using in javascript
 * ###Set value of the progressbar
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).value(50);
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$('#foo').progressbar('value', 50);
 *
 * ###Get value of the progressbar
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).value();
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$('#foo').progressbar('value');
 *
 * ## Using events
 * ###Change event use
 * This event is called when, progressbar value was changed.
 *
 *	@example
 *	document.getElementById("foo").addEventListener("change", function () {
 *		console.log("change");
 *	});
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$("#foo").bind("change", function () {
 *		console.log("change");
 *	});
 *
 * ###Complete event use
 * This event is called when, progressbar value was changed to 100%.
 *
 *	@example
 *	document.getElementById("foo").addEventListener("complete", function () {
 *		console.log("complete");
 *	});
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$("#foo").bind("complete", function () {
 *		console.log("complete");
 *	});
 *
 * @extends ns.widget.BaseWidget
 * @class ns.widget.mobile.Progressbar
 */

(function (window, ns) {
	"use strict";

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);


	define(
		[
			"../../../../core/engine",
			"../mobile",
			"./BaseWidgetMobile",
			"../../../../core/event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,


				events = ns.event,
				/**
				* @property {ns.engine} engine Alias for class ns.engine
				* @member ns.widget.mobile.Progressbar
				* @private
				*/
				engine = ns.engine,

				Progressbar = function () {

					/**
					* Object with default options
					* @type {{value : number, max : number, min : number}}
					* @member ns.widget.mobile.Progressbar
					* @instance
					*/
					this.options = {
						value: 0,
						max: 100,
						min: 0
					};
				};

			Progressbar.prototype = new BaseWidget();

			/**
			* Dictionary for progress related css class names
			* @type {{uiProgressbar: string, uiProgressbarBg: string, uiProgressbarValue: string}}
			* @static
			* @member ns.widget.mobile.Progressbar
			*/
			Progressbar.classes = {
				uiProgressbar: "ui-progressbar",
				uiProgressbarBg: "ui-progressbar-bg",
				uiProgressbarValue: "ui-progressbar-value"
			};

			/**
			* Build structure of progress widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.mobile.Progressbar
			* @instance
			*/
			Progressbar.prototype._build = function (element) {
				/* cached Progressbar.classes object
				* type Object
				*/
				var classes = Progressbar.classes,
					self = this,
					options = self.options,
					progressbarBgElement,
					progressbarValueElement;

				progressbarBgElement = document.createElement("div");
				progressbarValueElement = document.createElement("div");

				element.classList.add(classes.uiProgressbar);
				progressbarBgElement.classList.add(classes.uiProgressbarBg);
				progressbarValueElement.classList.add(classes.uiProgressbarValue);

				progressbarValueElement.style.width = options.value + '%';

				progressbarValueElement.style.display = "none";

				element.setAttribute("role", "progressbar");
				element.setAttribute("aria-valuemin", options.min);
				element.setAttribute("aria-valuenow", options.value);
				element.setAttribute("aria-valuemax", options.max);

				progressbarBgElement.appendChild(progressbarValueElement);
				element.appendChild(progressbarBgElement);

				// fix for compare tests
				self.min = options.min;
				self.valueDiv = progressbarValueElement;
				self.oldValue = options.value;

				return element;
			};


			/**
			 * Set progressbar value, return value. Alias method to Progressbar.value()
			 * @method _setValue
			 * @param {number} value
			 * @returns {boolean}
			 * @protected
			 * @member ns.widget.mobile.Progressbar
			 * @instance
			 */
			Progressbar.prototype._setValue = function (value) {
				var self = this,
					options = self.options,
					element = self.element,
					corretValue = Math.min(options.max, Math.max(options.min, value));
				if (corretValue === value) {
					if (value !== options.value) {
						events.trigger(element, "change");
						options.value = value;
						self._refresh();
					}
					if (value === options.max) {
						events.trigger(element, "complete");
					}
					return true;
				}
				return false;
			};

			/**
			* Set progressbar value, return value
			* @method _getValue
			* @param {number} value
			* @returns {number}
			* @member ns.widget.mobile.Progressbar
			* @instance
			*/
			Progressbar.prototype._getValue = function () {
				return this.options.value;
			};

			/**
			* Refresh progressbar
			* @method _refresh
			* @member ns.widget.mobile.Progressbar
			* @protected
			* @instance
			*/
			Progressbar.prototype._refresh = function () {
				var element = this.element,
					options = this.options,
					elementChild = element.firstElementChild.firstElementChild;

				element.setAttribute("aria-valuenow", options.value);
				elementChild.style.display = '';
				elementChild.style.width = options.value + "%";
			};

			// definition
			ns.widget.mobile.Progressbar = Progressbar;
			engine.defineWidget(
				"Progressbar",
				"[data-role='progressbar'], .ui-progressbar-container",
				["value"],
				Progressbar,
				"tizen"
			);

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Progressbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
