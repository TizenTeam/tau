/*global window, define */
/*jslint nomen: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Route Popup
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
			"../../../../core/util/object",
			"../../../../core/widget/core/Popup",
			"../history",
			"../route"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var
			/**
			 * @property {Object} Popup Alias for {@link ns.widget.Popup}
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			Popup = ns.widget.core.Popup,

			routePopup = {
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
				 * Popup Element Selector
				 * @property {string} filter
				 * @member ns.router.route.popup
				 * @static
				 */
				filter: "." + Popup.classes.popup,
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
					POPUP_HIDE: "popuphide"
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
			 * Alias for Object utils
			 * @method slice
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			object = ns.util.object,
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
				var defaults = object.merge({}, routePopup.defaults);
				defaults.transition = ns.getConfig('popupTransition', defaults.transition);
				return defaults;
			};

			/**
			 * This method sets active popup and manages history.
			 * @method setActive
			 * @param {?ns.widget.wearable.popup} activePopup
			 * @param {Object} options
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.setActive = function (activePopup, options) {
				var url,
					pathLocation = path.getLocation(),
					documentUrl = pathLocation.replace(popupHashKeyReg, "");

				this.activePopup = activePopup;

				if (activePopup) {
					// If popup is being opened, the new state is added to history.
					if (options && !options.fromHashChange && options.history) {
						url = path.addHashSearchParams(documentUrl, popupHashKey);
						history.replace(options, "", url);
					}
				} else if (pathLocation !== documentUrl) {
					// If popup is being closed, the history.back() is called
					// but only if url has special hash.
					// Url is changed after opening animation and in some cases,
					// the popup is closed before this animation and then the history.back
					// could cause undesirable change of page.
					history.back();
				}
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
						popup = engine.instanceWidget(toPopup, "Popup", options);
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

			/**
			 * This method closes active popup.
			 * @method close
			 * @param {ns.widget.wearable.Popup} [activePopup]
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext= in ui-pre-in] options.ext
			 * @param {Object} options
			 * @member ns.router.route.popup
			 * @protected
			 * @static
			 */
			routePopup.close = function (activePopup, options) {
				activePopup = activePopup || this.activePopup;

				if (activePopup) {
					// Close and clean up
					activePopup.close(options || {});
				}
			};

			/**
			 * This method handles hash change.
			 * It closes active popup.
			 * @method onHashChange
			 * @param {string} url
			 * @param {object} options
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.onHashChange = function (url, options) {
				var activePopup = this.activePopup;

				if (activePopup) {
					routePopup.close(activePopup, options);
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
					dataUrl = self._createDataUrl(absUrl);

				popup = html.querySelector(self.filter);

				if (popup) {
					// TODO tagging a popup with external to make sure that embedded popups aren't
					// removed by the various popup handling code is bad. Having popup handling code
					// in many places is bad. Solutions post 1.0
					DOM.setNSData(popup, "url", dataUrl);
					DOM.setNSData(popup, "external", true);
				}

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
			 * @method hasActive
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.hasActive = function () {
				return !!this.activePopup;
			};

			/**
			 * Returns active popup.
			 * @method getActive
			 * @return {?ns.widget.wearable.Popup}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.getActive = function () {
				return this.activePopup;
			};

			ns.router.route.popup = routePopup;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routePopup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
