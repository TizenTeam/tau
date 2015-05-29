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
			"../../../core/widget/core",
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget  = ns.widget.BaseWidget,
				engine = ns.engine,
				selectors = ns.util.selectors,
				slice = [].slice,
				Checkboxradio = function () {
					var self = this;

					self._inputtype = null;
				},
				classes = {
					UI_PREFIX: "ui-"
				},
				prototype = new BaseWidget();

			Checkboxradio.prototype = prototype;

			/**
			* Build Checkboxradio widget
			* @method _build
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.Checkboxradio
			* @instance
			*/
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
			* Returns the value of checkbox or radio
			* @method _getValue
			* @member ns.widget.Checkboxradio
			* @return {?string}
			* @protected
			* @instance
			* @new
			*/
			prototype._getValue = function () {
				return this.element.value;
			};

			/**
			* Set value to the checkbox or radio
			* @method _setValue
			* @param {string} value
			* @member ns.widget.Checkboxradio
			* @chainable
			* @instance
			* @protected
			* @new
			*/
			prototype._setValue = function (value) {
				this.element.value = value;
			};

			// definition
			ns.widget.mobile.Checkboxradio = Checkboxradio;
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
			return ns.widget.mobile.Checkboxradio;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
