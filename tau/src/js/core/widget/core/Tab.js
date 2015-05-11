/*global window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/**
 * @class ns.widget.mobile.Tab
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/selectors",
			"../../util/grid",
			"../../util/DOM/attributes",
			"../../event/vmouse",
			"./Scrollview",
			"../../event",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				events = ns.event,
				Tab = function () {
				},
				/**
				 * Object with class dictionary
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.mobile.Tab
				 * @readonly
				 */
				classes = {
				},
				CustomEvent = {
					TAB_CHANGE: "tabchange"
				},
				prototype = new BaseWidget();

			Tab.prototype = prototype;
			Tab.classes = classes;

			/**
			 * Set the active tab
			 * @method setActive
			 * @param {number} index of the tab
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype._setActive = function(index) {
				var element = this.element;
				events.trigger(element, CustomEvent.TAB_CHANGE, {
					active: index
				});
			};
			/**
			 * Set the active tab
			 * @method setActive
			 * @param {number} index of the tab
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype.setActive = function(index) {
				this._setActive(index);
			};

			/**
			 * Get the active tab
			 * @method setActive
			 * @param {number} index of the tab
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype._getActive = function() {
				return this.options.active;
			};

			/**
			 * Get the active tab
			 * @method setActive
			 * @param {number} index of the tab
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype.getActive = function() {
				return this._getActive();
			};

			ns.widget.core.Tab = Tab;
			engine.defineWidget(
				"Tab",
				"",
				["setActive", "getActive"],
				Tab,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Tab;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
