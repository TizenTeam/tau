/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Route popup
 * Support class for router to control changing pupups in profile Wearable.
 *
 * @class ns.router.tv.route.popup
 * @extend ns.router.route.popup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../profile/wearable/router/route",
			"../../../../profile/wearable/router/route/popup",
			"../../../../profile/tv/widget/Popup"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var routePopup = ns.router.route.popup,
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				DOM = ns.util.DOM;


			/**
			 * This method opens popup if no other popup is opened.
			 * It also changes history to show that popup is opened.
			 * If there is already active popup, it will be closed.
			 * @method open
			 * @param {HTMLElement|string} toPopup
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = 'popup'] Represents kind of link as 'page' or 'popup' or 'external' for linking to another domain.
			 * @param {string} [options.transition = 'none'] Sets the animation used during change of popup.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {string} [options.container = null] Selector for container.
			 * @param {boolean} [options.volatileRecord=true] Sets if the current history entry will be modified or a new one will be created.
			 * @param {Event} event
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.open = function (toPopup, options, event) {
				var popup,
					router = engine.getRouter(),
					events = routePopup.events,
					removePopup = function () {
						document.removeEventListener(events.POPUP_HIDE, removePopup, false);
						toPopup.parentNode.removeChild(toPopup);
						routePopup.activePopup = null;
					},
					openPopup = function () {
						var positionTo = options["position-to"];
						// add such option only if it exists
						if (positionTo) {
							options.positionTo = positionTo;
						}
						if (event && event.touches) {
							options.x = event.touches[0].clientX;
							options.y = event.touches[0].clientY;
						} else if (event){
							options.x = event.clientX;
							options.y = event.clientY;
						}

						document.removeEventListener(events.POPUP_HIDE, openPopup, false);
						popup = engine.instanceWidget(toPopup, "popup", options);
						popup.open(options);
						routePopup.activePopup = popup;
					},
					activePage = router.container.getActivePage(),
					container;

				if (DOM.getNSData(toPopup, "external") === true) {
					container = options.container ? activePage.element.querySelector(options.container) : activePage.element;
					container.appendChild(toPopup);
					document.addEventListener(routePopup.events.POPUP_HIDE, removePopup, false);
				}

				if (routePopup.hasActive()) {
					document.addEventListener(routePopup.events.POPUP_HIDE, openPopup, false);
					routePopup.close();
				} else {
					openPopup();
				}
			};

			ns.router.route.popup = routePopup;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routePopup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
