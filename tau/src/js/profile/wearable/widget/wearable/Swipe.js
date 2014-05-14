/*global window, define */
/*jslint nomen: true */
/**
 * #Swipe Widget
 *
 *
 * @class ns.widget.Swipe
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				/**
				* Swipe widget
				* @class ns.widget.Swipe
				* @extends ns.widget.BaseWidget
				*/
				Swipe = function () {
					return this;
				},
				prototype = new BaseWidget();

			Swipe.events = {};

			/**
			* build Swipe
			* @method _build
			* @private
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.Swipe
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
			* @member ns.widget.Swipe
			*/
			prototype._refresh = function () {
				return null;
			};

			/**
			* @method _destroy
			* @private
			* @member ns.widget.Swipe
			*/
			prototype._destroy = function () {
				return null;
			};

			Swipe.prototype = prototype;
			ns.widget.wearable.Swipe = Swipe;

			engine.defineWidget(
				"Swipe",
				".ui-swipe",
				[],
				Swipe,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Swipe;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
