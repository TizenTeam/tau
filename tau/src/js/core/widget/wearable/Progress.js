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
				* Progress widget
				* @class ns.widget.Progress
				* @extends ns.widget.BaseWidget
				*/
				Progress = function () {
					return this;
				},
				prototype = new BaseWidget();

			Progress.events = {};

			/**
			* build Progress
			* @method _build
			* @private
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.Progress
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
			* @member ns.widget.Progress
			*/
			prototype._refresh = function () {
				return null;
			};

			/**
			* @method _destroy
			* @private
			* @member ns.widget.Progress
			*/
			prototype._destroy = function () {
				return null;
			};

			Progress.prototype = prototype;
			ns.widget.wearable.Progress = Progress;

			engine.defineWidget(
				"Progress",
				"progress",
				[],
				Progress,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Progress;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
