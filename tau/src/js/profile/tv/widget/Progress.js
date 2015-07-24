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
/*jslint nomen: true */
/**
 * # Progress Widget
 * Shows a control that indicates the progress percentage of an on-going operation.
 *
 * @class ns.widget.tv.Progress
 * @extends ns.widget.core.Progress
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/widget/core/Progress",
			"../../../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var CoreProgress = ns.widget.core.Progress,
				CoreProgressPrototype = CoreProgress.prototype,
				engine = ns.engine,
				classes = {
					disabled: "disabled",
					focused: "ui-focus",
					thumb: "ui-progress-thumb"
				},

				Progress = function () {
					CoreProgress.call(this);
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {number} [options.value=0] value of progress
					 * bar
					 * @property {number} [options.min=0] minimal value of
					 * progress bar
					 * @property {number} [options.max=100] maximal value of
					 * progress bar
					 * @member ns.widget.tv.ProgressBar
					 */
					this.options = {
						value: 0,
						max: 100,
						min: 0
					};
				},
				FUNCTION_TYPE = "function",
				prototype = new CoreProgress();

			Progress.prototype = prototype;

			/**
			 * Initializes progress
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.Progress
			 */
			prototype._init = function(element) {
				var self = this,
					min = parseInt(element.getAttribute("min"), 10),
					max = parseInt(element.getAttribute("max"), 10),
					value = parseInt(element.getAttribute("value"), 10),
					options = self.options;
				if (typeof CoreProgressPrototype._init === FUNCTION_TYPE) {
					CoreProgressPrototype._init.call(self, element);
				}

				// remember attributes value
				if (isNaN(min) || min === null) {
					min = options.min || 0;
				}
				options.min = min;

				if (isNaN(max) || max === null) {
					max = options.max || 0;
				}
				options.max = max;

				if (isNaN(value) || (value === null) || (value < min) || (value > max)) {
					value = options.value || 0;
					element.setAttribute("value", value);
				}
				options.value = value;

				// if widget is disabled add proper class
				if (element.getAttribute("disabled") === "disabled") {
					element.classList.add(classes.disabled);
				}
			};

			/**
			 * Method sets ProgressBar value.
			 * @method _setValue
			 * @param {number} value
			 * @return {boolean} True if value changed
			 * @protected
			 * @member ns.widget.tv.Progress
			 */
			prototype._setValue = function (element, value) {
				var self = this,
					options = self.options;
				if ((typeof value === "number") && (value !== options.value) && (value >= options.min) && (value <= options.max)) {
					self.trigger("change");
					if (value === self.maxValue) {
						self.trigger("complete");
					}
					options.value = value;
					self.element.setAttribute("value", value);
					return true;
				} else {
					return false;
				}
			};

			/**
			 * Method gets ProgressBar value.
			 * @method _getValue
			 * @return {number}
			 * @protected
			 * @member ns.widget.tv.Progress
			 */
			prototype._getValue = function () {
				return this.options.value;
			};

			/**
			 * Method Focuses object
			 * @method focus
			 * @member ns.widget.tv.Progress
			 */
			prototype.focus = function () {
				var classList = this.element.classList,
					focused = classes.focused;
				if (!classList.contains(focused)) {
					classList.add(focused);
				}
			};

			/**
			 * Method unfocuses object
			 * @method blur
			 * @member ns.widget.tv.Progress
			 */
			prototype.blur = function () {
				var classList = this.element.classList,
					focused = classes.focused;
				if (classList.contains(focused)) {
					classList.remove(focused);
				}
			};

			ns.widget.tv.Progress = Progress;

			engine.defineWidget(
				"Progress",
				"progress",
				[],
				Progress,
				"tv"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Progress;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
