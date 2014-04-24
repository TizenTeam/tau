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
				* Listview widget
				* @class ns.widget.Listview
				* @extends ns.widget.BaseWidget
				*/
				Listview = function () {
					return this;
				},
				prototype = new BaseWidget();

			Listview.events = {};

			/**
			* build Listview
			* @method _build
			* @private
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.Listview
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
			* @member ns.widget.Listview
			*/
			prototype._refresh = function () {
				return null;
			};

			/**
			* @method _destroy
			* @private
			* @member ns.widget.Listview
			*/
			prototype._destroy = function () {
				return null;
			};

			Listview.prototype = prototype;
			ns.widget.wearable.Listview = Listview;

			engine.defineWidget(
				"Listview",
				".ui-listview",
				[],
				Listview,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Listview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
