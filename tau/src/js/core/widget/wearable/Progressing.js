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
				* Progressing widget
				* @class ns.widget.Progressing
				* @extends ns.widget.BaseWidget
				*/
				Progressing = function () {
					return this;
				},
				prototype = new BaseWidget();

			Progressing.events = {};

			/**
			* build Progressing
			* @method _build
			* @private
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.Progressing
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
			* @member ns.widget.Progressing
			*/
			prototype._refresh = function () {
				return null;
			};

			/**
			* @method _destroy
			* @private
			* @member ns.widget.Progressing
			*/
			prototype._destroy = function () {
				return null;
			};

			Progressing.prototype = prototype;
			ns.widget.wearable.Progressing = Progressing;

			engine.defineWidget(
				"Progressing",
				".ui-progress",
				[],
				Progressing,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Progressing;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
