/*global window, define, ns */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
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
			var BaseWidget  = ns.widget.BaseWidget,
				engine = ns.engine,
				Checkbox = function () {
					var self = this;

					self._inputtype = null;
				},
				classes = {
					checkbox: "ui-checkbox"
				},
				prototype = new BaseWidget();

			Checkbox.prototype = prototype;

			/**
			 * Build Checkbox widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.Checkbox
			 * @instance
			 */
			prototype._build = function (element) {
				var inputType = element.getAttribute("type");

				if (inputType !== "checkbox") {
					//_build should always return element
					return element;
				}
				element.classList.add(classes.checkbox);
				return element;
			};

			/**
			 * Returns the value of checkbox
			 * @method _getValue
			 * @member ns.widget.Checkbox
			 * @return {?string}
			 * @protected
			 * @instance
			 * @new
			 */
			prototype._getValue = function () {
				return this.element.value;
			};

			/**
			 * Set value to the checkbox
			 * @method _setValue
			 * @param {string} value
			 * @member ns.widget.Checkbox
			 * @chainable
			 * @instance
			 * @protected
			 * @new
			 */
			prototype._setValue = function (value) {
				this.element.value = value;
			};

			// definition
			ns.widget.core.Checkbox = Checkbox;
			engine.defineWidget(
				"Checkbox",
				"input[type='checkbox']:not(.ui-slider-switch-input):not([data-role='toggleswitch']):not(.ui-toggleswitch):not(.ui-toggle-switch)," +
				"input.ui-checkbox",
				[],
				Checkbox,
				"core",
				false,
				false,
				HTMLInputElement
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Checkbox;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
