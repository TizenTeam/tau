/*global window, define */
/**
 * @class ej.router.Page
 */
(function (window, document, ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../../engine",
			"../../../utils/path",
			"../../../utils/DOM/attributes",
			"../../../micro/selectors",
			"../history",
			"../route",
			"../../../widget/micro/Popup"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var RoutePopup = {
					defaults: {
						transition: 'none',
						container: null,
						volatileRecord: true
					},
					filter: ej.micro.selectors.popup,
					activePopup: null,
					events: {
						POPUP_HIDE: 'popuphide'
					}
				},
				engine = ej.engine,
				path = ej.utils.path,
				history = ej.router.micro.history,
				pathUtils = ej.utils.path,
				DOM = ej.utils.DOM,
				popupHashKey = "popup=true",
				popupHashKeyReg = /([&|\?]popup=true)/;

			RoutePopup.option = function () {
				return RoutePopup.defaults;
			};
			/**
			* Change page
			* @method open
			* @param {HTMLElement|string} toPopup
			* @param {Object} options
			* @static
			* @memberOf ej.router.micro.route.Popup
			*/
			RoutePopup.open = function (toPopup, options) {
				var popup,
					popupKey,
					router = engine.getRouter(),
					url = pathUtils.getLocation(),
					removePopup = function () {
						toPopup.removeEventListener(RoutePopup.events.POPUP_HIDE, removePopup, false);
						toPopup.parentNode.removeChild(toPopup);
					},
					openPopup = function () {
						toPopup.removeEventListener(RoutePopup.events.POPUP_HIDE, openPopup, false);
						popup = engine.instanceWidget(toPopup, 'popup', options);
						popup.open();
						RoutePopup.activePopup = popup;
					},
					documentUrl = path.getLocation().replace(popupHashKeyReg, ""),
					activePage = router.container.getActivePage(),
					container;

				popupKey = popupHashKey;

				if (!options.fromHashChange) {
					url = path.addHashSearchParams(documentUrl, popupKey);
					history.replace(options, "", url);
				}

				if (DOM.getNSData(toPopup, "external") === true) {
					container = options.container ? activePage.querySelector(options.container) : activePage;
					container.appendChild(toPopup);
					toPopup.addEventListener(RoutePopup.events.POPUP_HIDE, removePopup, false);
				}

				if (RoutePopup._hasActivePopup()) {
					toPopup.addEventListener(RoutePopup.events.POPUP_HIDE, openPopup, false);
					RoutePopup._closeActivePopup();
				} else {
					popup = engine.instanceWidget(toPopup, 'popup', options);
					popup.open();
					RoutePopup.activePopup = popup;
				}
			};

			RoutePopup._closeActivePopup = function (activePopup) {
				activePopup = activePopup || RoutePopup.activePopup;

				if (activePopup) {
					// Close and clean up
					activePopup.close();
					RoutePopup.activePopup = null;
				}
			};

			RoutePopup.onHashChange = function () {
				var activePopup = RoutePopup.activePopup;

				if (activePopup) {
					RoutePopup._closeActivePopup(activePopup);
					// Default routing setting cause to rewrite further window history
					// even if popup has been closed
					// To prevent this onHashChange after closing popup we need to change
					// disable volatile mode to allow pushing new history elements
					return true;
				}
				return false;
			};

			RoutePopup._hasActivePopup = function () {
				return !!RoutePopup.activePopup;
			};

			ej.router.micro.route.popup = RoutePopup;

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return RoutePopup;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
