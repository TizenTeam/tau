/*global window, define */
/*jslint nomen: true */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				/**
				* Button widget
				* @class ns.widget.Button
				* @extends ns.widget.BaseWidget
				*/
				Button = function () {
					return this;
				},
				prototype = new BaseWidget();

			Button.events = {};

			/**
			* build Button
			* @method _build
			* @private
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.Button
			*/
			prototype._build = function (element) {
				return element;
			};

			prototype._init = function (element) {
				return element;
			};

			prototype._bindEvents = function (element) {
				return element;
			};

			/**
			* refresh structure
			* @method _refresh
			* @new
			* @member ns.widget.Button
			*/
			prototype._refresh = function () {
				return null;
			};

			/**
			* @method _destroy
			* @private
			* @member ns.widget.Button
			*/
			prototype._destroy = function () {
				return null;
			};

			Button.prototype = prototype;
			ns.widget.wearable.Button = Button;

			engine.defineWidget(
				"Button",
				".ui-btn",
				[],
				Button,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
