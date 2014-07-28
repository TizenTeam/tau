/*global window, define */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
*
* Licensed under the Flora License, Version 1.1 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://floralicense.org/license/
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
 * Support class for router to control changing pupups in profile Wearable.
 * @class ns.router.route.popup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/path",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/selectors",
			"../../selectors",
			"../history",
			"../route",
			"../../widget/wearable/Popup"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var routePopup = {
					/**
					 * Object with default options
					 * @property {Object} defaults
					 * @property {string} [defaults.transition='none'] Sets the animation used during change of popup.
					 * @property {?HTMLElement} [defaults.container=null] Sets container of element.
					 * @property {boolean} [defaults.volatileRecord=true] Sets if the current history entry will be modified or a new one will be created.
					 * @member ns.router.route.popup
					 * @static
					 */
					defaults: {
						transition: 'none',
						container: null,
						volatileRecord: true
					},
					/**
					 * Alias for {@link ns.wearable.selectors#popup}
					 * @property {string} filter
					 * @member ns.router.route.popup
					 * @static
					 */
					filter: ns.wearable.selectors.popup,
					/**
					 * Storage variable for active popup
					 * @property {?HTMLElement} activePopup
					 * @member ns.router.route.popup
					 * @static
					 */
					activePopup: null,
					/**
					 * Dictionary for popup related event types
					 * @property {Object} events
					 * @property {string} [events.POPUP_HIDE='popuphide']
					 * @member ns.router.route.popup
					 * @static
					 */
					events: {
						POPUP_HIDE: 'popuphide'
					}
				},
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias for {@link ns.util.path}
				 * @property {Object} path
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				path = ns.util.path,
				/**
				 * Alias for {@link ns.util.selectors}
				 * @property {Object} utilSelector
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				utilSelector = ns.util.selectors,
				/**
				 * Alias for {@link ns.router.history}
				 * @property {Object} history
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				history = ns.router.history,
				/**
				 * Alias for {@link ns.util.path}
				 * @property {Object} pathUtils
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				pathUtils = ns.util.path,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				DOM = ns.util.DOM,
				/**
				 * Alias for array slice method
				 * @method slice
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				slice = [].slice,
				/**
				 * Popup's hash added to url
				 * @property {string} popupHashKey
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				popupHashKey = "popup=true",
				/**
				 * Regexp for popup's hash
				 * @property {RegExp} popupHashKeyReg
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				popupHashKeyReg = /([&|\?]popup=true)/;

			/**
			 * Tries to find a popup element matching id and filter (selector).
			 * Adds data url attribute to found page, sets page = null when nothing found.
			 * @method findPopupAndSetDataUrl
			 * @param {string} id
			 * @param {string} filter
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			function findPopupAndSetDataUrl(id, filter) {
				var popup = document.getElementById(path.hashToSelector(id));

				if (popup && utilSelector.matchesSelector(popup, filter)) {
					DOM.setNSData(popup, 'url', id);
				} else {
					// if we matched any element, but it doesn't match our filter
					// reset page to null
					popup = null;
				}
				// @TODO ... else
				// probably there is a need for running onHashChange while going back to a history entry
				// without state, eg. manually entered #fragment. This may not be a problem on target device
				return popup;
			}

			/**
			 * This method returns default options for popup router.
			 * @method option
			 * @return {Object}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.option = function () {
				return routePopup.defaults;
			};

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
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {string} [options.container = null] Selector for container.
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.open = function (toPopup, options) {
				var popup,
					popupKey,
					router = engine.getRouter(),
					url = pathUtils.getLocation(),
					removePopup = function () {
						document.removeEventListener(routePopup.events.POPUP_HIDE, removePopup, false);
						toPopup.parentNode.removeChild(toPopup);
						routePopup.activePopup = null;
					},
					openPopup = function () {
						document.removeEventListener(routePopup.events.POPUP_HIDE, openPopup, false);
						popup = engine.instanceWidget(toPopup, 'popup', options);
						popup.open();
						routePopup.activePopup = popup;
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
					container = options.container ? activePage.element.querySelector(options.container) : activePage.element;
					container.appendChild(toPopup);
					document.addEventListener(routePopup.events.POPUP_HIDE, removePopup, false);
				}

				if (routePopup._hasActivePopup()) {
					document.addEventListener(routePopup.events.POPUP_HIDE, openPopup, false);
					routePopup._closeActivePopup();
				} else {
					openPopup();
				}
			};

			/**
			 * This method closes active popup.
			 * @method _closeActivePopup
			 * @param {HTMLElement} activePopup
			 * @member ns.router.route.popup
			 * @protected
			 * @static
			 */
			routePopup._closeActivePopup = function (activePopup) {
				activePopup = activePopup || routePopup.activePopup;

				if (activePopup) {
					// Close and clean up
					activePopup.close();
					routePopup.activePopup = null;
				}
			};

			/**
			 * This method handles hash change.
			 * It closes active popup.
			 * @method onHashChange
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.onHashChange = function (/* url, options */) {
				var activePopup = routePopup.activePopup;

				if (activePopup) {
					routePopup._closeActivePopup(activePopup);
					// Default routing setting cause to rewrite further window history
					// even if popup has been closed
					// To prevent this onHashChange after closing popup we need to change
					// disable volatile mode to allow pushing new history elements
					return true;
				}
				return false;
			};

			/**
			 * On open fail, currently never used
			 * @method onOpenFailed
			 * @member ns.router.route.popup
			 * @return {null}
			 * @static
			 */
			routePopup.onOpenFailed = function (/* options */) {
				return null;
			};

			/**
			 * This method finds popup by data-url.
			 * @method find
			 * @param {string} absUrl Absolute path to opened popup
			 * @return {HTMLElement} Element of popup
			 * @member ns.router.route.popup
			 */
			routePopup.find = function (absUrl) {
				var self = this,
					dataUrl = self._createDataUrl(absUrl),
					activePage = engine.getRouter().getContainer().getActivePage(),
					popup;

				popup = activePage.element.querySelector("[data-url='" + dataUrl + "']" + self.filter);

				if (!popup && dataUrl && !path.isPath(dataUrl)) {
					popup = findPopupAndSetDataUrl(dataUrl, self.filter);
				}

				return popup;
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * Fetched external scripts if required.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed popup
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
			 */
			routePopup.parse = function (html, absUrl) {
				var self = this,
					popup,
					dataUrl = self._createDataUrl(absUrl),
					scripts,
					all = document.createElement('div'),
					scriptRunner = ns.util.runScript.bind(null, dataUrl);

				//workaround to allow scripts to execute when included in popup divs
				all.innerHTML = html;

				popup = all.querySelector(self.filter);

				// TODO tagging a popup with external to make sure that embedded popups aren't
				// removed by the various popup handling code is bad. Having popup handling code
				// in many places is bad. Solutions post 1.0
				DOM.setNSData(popup, 'url', dataUrl);
				DOM.setNSData(popup, 'external', true);

				scripts = popup.querySelectorAll('script');
				slice.call(scripts).forEach(scriptRunner);

				return popup;
			};

			/**
			 * Convert url to data-url
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @return {string}
			 * @member ns.router.route.popup
			 * @protected
			 * @static
			 */
			routePopup._createDataUrl = function (absoluteUrl) {
				return path.convertUrlToDataUrl(absoluteUrl);
			};

			/**
			 * Return true if active popup exists.
			 * @method _hasActivePopup
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @protected
			 * @static
			 */
			routePopup._hasActivePopup = function () {
				var popup = document.querySelector('.' + ns.widget.wearable.Popup.classes.active);
				routePopup.activePopup = popup && engine.instanceWidget(popup, 'popup');
				return !!routePopup.activePopup;
			};

			ns.router.route.popup = routePopup;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routePopup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
