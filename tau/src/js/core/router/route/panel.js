/*global window, define */
/*jslint nomen: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Route panel
 * Support class for router to control panel widget in profile Wearable.
 * @class ns.router.route.panel
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/DOM/attributes",
			"../../util/path",
			"../../util/selectors",
			"../../util/object",
			"../route",
			"../history",
			"../../widget/core/Panel"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var panelChanger = ns.widget.core.PanelChanger,
				selectors = ns.util.selectors,
				history = ns.router.history,
				engine = ns.engine,
				classes = {
					PANEL_CHANGER: panelChanger.classes.PANEL_CHANGER
				},
				CONST = {
					REVERSE: "slide-reverse"
				},
				routePanel = {};

			routePanel.orderNumber = 10;

			/**
			 * Returns default route options used inside Router.
			 * But, panel router has not options.
			 * @method option
			 * @static
			 * @member ns.router.route.panel
			 * @return null
			 */
			routePanel.option = function () {
				return null;
			};

			/**
			 * This method sets active panel and manages history.
			 * @method setActive
			 * @param {HTMLElement} element
			 * @member ns.router.route.panel
			 * @static
			 */
			routePanel.setActive = function (element) {
				var self = this,
					panelChangerElement = selectors.getClosestByClass(element, classes.PANEL_CHANGER),
					panelChangerComponent = engine.instanceWidget(panelChangerElement, "PanelChanger");
				self.active = true;
				self._panelChangerElement = panelChangerElement;
				self._panelChangerComponent = panelChangerComponent;
			};

			/**
			 * This method handles hash change.
			 * @method onHashChange
			 * @param {String} url
			 * @param {Object} options
			 * @param {string} prev
			 * @static
			 * @member ns.router.route.panel
			 * @return {boolean}
			 */
			routePanel.onHashChange = function (url, options, prev) {
				var self = this,
					storageName = panelChanger.default.STORAGE_NAME,
					panelHistory = JSON.parse(localStorage[storageName] || "[]"),
					panelChangerComponent = self._panelChangerComponent,
					activePanel = panelHistory[panelHistory.length - 1];

				if (self._panelChangerElement.querySelector("#" + activePanel).classList.contains(panelChanger.classes.PRE_IN)
						|| panelHistory.length === 0) {
					history.replace(prev, prev.stateTitle, prev.stateUrl);
					return true;
				}
				panelHistory.pop();
				if (panelChangerComponent.options.manageHistory && panelHistory.length > 0) {
					history.replace(prev, prev.stateTitle, prev.stateUrl);
					localStorage[storageName] = JSON.stringify(panelHistory);
					panelChangerComponent.changePanel("#" + panelHistory.pop(), CONST.REVERSE, "back");
					return true;
				}
				self.active = false;
				return false;
			};

			ns.router.route.panel = routePanel;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routePanel;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
