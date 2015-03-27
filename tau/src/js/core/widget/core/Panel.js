/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Panel Widget
 *
 * Panel is component that can have header, content, footer, listview and so on like the page component.
 * Panel has been made that developer can implement to multi panel in one page.
 * But, Panel don't need to implement in one html file. Panel can be existed other html files.
 * PanelChanger controlled Panel lifecycle so If you implement to Panel in PanelChanger, you can experience UX that multi page existed in one page.
 *
 * @class ns.widget.core.Panel
 * @extends ns.widget.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../event",
			"../../util/selectors",
			"../BaseWidget",
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				events = ns.event,
				classes = {
					PANEL: "ui-panel",
					ACTIVE_PANEL: "ui-panel-active"
				},
				EVENT_TYPE = {
					BEFORE_CREATE: "panelbeforecreate",
					CREATE: "panelcreate",
					BEFORE_SHOW: "panelbeforeshow",
					SHOW: "panelshow",
					BEFORE_HIDE: "panelbeforehide",
					HIDE: "panelhide",
					CHANGE: "panelchange"
				},
				Panel = function () {
				},
				prototype = new BaseWidget();

			Panel.eventType = EVENT_TYPE;
			Panel.classes = classes;
			Panel.prototype = prototype;

			/**
			 * Build Panel component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Panel
			 * @protected
			 */
			prototype._build = function(element) {
				var routePanel = engine.getRouter().getRoute("panel");
				element.classList.add(classes.PANEL);
				routePanel.setActive(element);

				return element;
			};

			/**
			 * Destroy Panel component
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Panel
			 * @protected
			 */
			prototype._destroy = function(element) {
				events.trigger(element, EVENT_TYPE.HIDE);
			};
			// definition
			ns.widget.core.Panel = Panel;

			engine.defineWidget(
				"Panel",
				"[data-role='panel'], .ui-panel",
				[],
				Panel,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
