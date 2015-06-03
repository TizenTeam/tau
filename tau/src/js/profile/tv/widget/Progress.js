/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Progress Widget
 * Shows a control that indicates the progress percentage of an on-going operation.
 *
 * @class ns.widget.tv.Progress
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/widget/BaseWidget",
			"../../../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.BaseWidget,

				engine = ns.engine,

				classes = {
					indeterminate: "ui-progress-indeterminate",
					process: "ui-progress-processing",
					disabled: "disabled",
					focused: "ui-focus",
					thumb: "ui-progress-thumb"
				},

				TYPE = {
					bar: "bar",
					circle: "circle"
				},

				Progress = function () {
					this.options = {};
				},

				prototype = new BaseWidget();


			Progress.classes = classes;

			prototype._configure = function () {
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
					infinite: false,
					appeariance: TYPE.bar,
					value: 0,
					max: 100,
					min: 0
				};
			};

			prototype._build = function (element) {
				var options = this.options,
					classList = element.classList,
					replacement = document.createElement("div"),
					i,
					attributes = element.attributes,
					length,
					nodeName,
					nodeValue;

				if (options.appeariance === TYPE.circle) {
					classList.add(classes.process);
					length = attributes.length;

					for (i = 0; i < length; ++i){
						nodeName  = attributes.item(i).name;
						nodeValue = attributes.item(i).value;
						replacement.setAttribute(nodeName, nodeValue);
					}

					replacement.innerHTML = element.innerHTML;
					element.parentNode.replaceChild(replacement, element);
				} else if (options.appeariance === TYPE.bar) {

					if (options.infinite === true) {
						classList.add(classes.indeterminate);
					}

				}

				return element;
			};
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

			prototype._destroy = function () {
				this.options = null;
			};

			Progress.prototype = prototype;
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
