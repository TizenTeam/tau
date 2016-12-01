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
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core",
			"../../engine",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Radio = function () {
					var self = this;

					self._inputtype = null;
				},
				classes = {
					radio: "ui-radio"
				},
				prototype = new BaseWidget();

			Radio.prototype = prototype;

			/**
			 * Build Radio widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.Radio
			 * @instance
			 */
			prototype._build = function (element) {
				var inputType = element.getAttribute("type");

				if (inputType !== "radio") {
					//_build should always return element
					return element;
				}

				element.classList.add(classes.radio);

				return element;
			};

			/**
			 * Returns the value of radio
			 * @method _getValue
			 * @member ns.widget.Radio
			 * @return {?string}
			 * @protected
			 * @instance
			 * @new
			 */
			prototype._getValue = function () {
				return this.element.value;
			};

			/**
			 * Set value to the radio
			 * @method _setValue
			 * @param {string} value
			 * @member ns.widget.Radio
			 * @chainable
			 * @instance
			 * @protected
			 * @new
			 */
			prototype._setValue = function (value) {
				this.element.value = value;
			};

			// definition
			ns.widget.core.Radio = Radio;
			engine.defineWidget(
				"Radio",
				"input[type='radio'], input.ui-radio",
				[],
				Radio,
				""
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Radio;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
