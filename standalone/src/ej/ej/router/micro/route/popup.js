/*global window, define */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * Support class for router to control change pupups.
 * @class ns.router.micro.route.popup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../../engine",
			"../../../utils/path",
			"../../../utils/DOM/attributes",
			"../../../micro/selectors",
			"../../../utils/selectors",
			"../history",
			"../route",
			"../../../widget/micro/Popup"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var routePopup = {
					/**
					 * @property {Object} defaults Object with default options
					 * @property {string} [defaults.transition='none']
					 * @property {?HTMLElement} [defaults.container=null]
					 * @property {boolean} [defaults.volatileRecord=true]
					 * @memberOf ns.router.micro.route.popup
					 * @static
					 */
					defaults: {
						transition: 'none',
						container: null,
						volatileRecord: true
					},
					/**
					 * @property {string} filter Alias for {@link ns.micro.selectors#popup}
					 * @memberOf ns.router.micro.route.popup
					 * @static
					 */
					filter: ns.micro.selectors.popup,
					/**
					 * @property {?HTMLElement} activePopup Storage variable for active popup
					 * @memberOf ns.router.micro.route.popup
					 * @static
					 */
					activePopup: null,
					/**
					 * @property {Object} events Dictionary for popup related event types
					 * @property {string} [events.popup_hide='popuphide']
					 * @memberOf ns.router.micro.route.popup
					 * @static
					 */
					events: {
						popup_hide: 'popuphide'
					}
				},
				/**
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} path Alias for {@link ns.utils.path}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				path = ns.utils.path,
				/**
				 * @property {Object} utilSelector Alias for {@link ns.utils.selectors}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				utilSelector = ns.utils.selectors,
				/**
				 * @property {Object} history Alias for {@link ns.router.micro.history}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				history = ns.router.micro.history,
				/**
				 * @property {Object} pathUtils Alias for {@link ns.utils.path}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				pathUtils = ns.utils.path,
				/**
				 * @property {Object} DOM Alias for {@link ns.utils.DOM}
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				DOM = ns.utils.DOM,
				/**
				 * @method slice Alias for array slice method
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				slice = [].slice,
				/**
				 * @property {string} popupHashKey
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				popupHashKey = "popup=true",
				/**
				 * @property {RegExp} popupHashKeyReg
				 * @memberOf ns.router.micro.route.popup
				 * @private
				 * @static
				 */
				popupHashKeyReg = /([&|\?]popup=true)/;

			/**
			 * Tries to find a popup element matching id and filter (selector).
			 * Adds data url attribute to found page, sets page = null when nothing found
			 * @method findPopupAndSetDataUrl
			 * @param {string} id
			 * @param {string} filter
			 * @return {HTMLElement}
			 * @memberOf ns.router.micro.route.popup
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
			 * Returns default options
			 * @method option
			 * @return {Object}
			 * @memberOf ns.router.micro.route.popup
			 * @static
			 */
			routePopup.option = function () {
				return routePopup.defaults;
			};

			/**
			 * Change page
			 * @method open
			 * @param {HTMLElement|string} toPopup
			 * @param {Object} options
			 * @memberOf ns.router.micro.route.popup
			 * @static
			 */
			routePopup.open = function (toPopup, options) {
				var popup,
					popupKey,
					router = engine.getRouter(),
					url = pathUtils.getLocation(),
					removePopup = function () {
						document.removeEventListener(routePopup.events.popup_hide, removePopup, false);
						toPopup.parentNode.removeChild(toPopup);
						routePopup.activePopup = null;
					},
					openPopup = function () {
						document.removeEventListener(routePopup.events.popup_hide, openPopup, false);
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
					document.addEventListener(routePopup.events.popup_hide, removePopup, false);
				}

				if (routePopup._hasActivePopup()) {
					document.addEventListener(routePopup.events.popup_hide, openPopup, false);
					routePopup._closeActivePopup();
				} else {
					openPopup();
				}
			};

			/**
			 * Close active popup
			 * @method _closeActivePopup
			 * @param {HTMLElement} activePopup
			 * @memberOf ns.router.micro.route.popup
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
			 * Close active popup
			 * @method onHashChange
			 * @return {boolean}
			 * @memberOf ns.router.micro.route.popup
			 * @static
			 */
			routePopup.onHashChange = function () {
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
			 * @memberOf ns.router.micro.route.popup
			 * @return {null}
			 * @static
			 */
			routePopup.onOpenFailed = function(/* options */) {
				return null;
			};

			/**
			 * Find popup by data-url
			 * @method find
			 * @param {string} absUrl
			 * @return {HTMLElement}
			 * @memberOf ns.router.micro.route.popup
			 * @static
			 */
			routePopup.find = function( absUrl ) {
				var dataUrl = this._createDataUrl( absUrl ),
					activePage = engine.getRouter().getContainer().getActivePage(),
					popup;

				popup = activePage.element.querySelector("[data-url='" + dataUrl + "']" + this.filter);

				if ( !popup && dataUrl && !path.isPath( dataUrl ) ) {
					popup = findPopupAndSetDataUrl(dataUrl, this.filter);
				}

				return popup;
			};

			/**
			 * Parses HTML and runs scripts from parsed code.
			 * Fetched external scripts if required.
			 * @method parse
			 * @param {string} html
			 * @param {string} absUrl
			 * @return {HTMLElement}
			 * @memberOf ns.router.micro.route.popup
			 * @static
			 */
			routePopup.parse = function( html, absUrl ) {
				var popup,
					dataUrl = this._createDataUrl( absUrl ),
					scripts,
					all = document.createElement('div');

				//workaround to allow scripts to execute when included in popup divs
				all.innerHTML = html;

				popup = all.querySelector(this.filter);

				// TODO tagging a popup with external to make sure that embedded popups aren't
				// removed by the various popup handling code is bad. Having popup handling code
				// in many places is bad. Solutions post 1.0
				DOM.setNSData(popup, 'url', dataUrl);
				DOM.setNSData(popup, 'external', true);

				scripts = popup.querySelectorAll('script');
				slice.call(scripts).forEach(function (baseUrl, script) {
					var newscript = document.createElement('script'),
						i,
						scriptAttributes = script.attributes,
						count = script.childNodes.length,
						src = script.getAttribute("src"),
						xhrObj,
						attribute;

					// 'src' may become null when none src attribute is set
					if (src !== null) {
						src = path.makeUrlAbsolute(src, baseUrl);
					}

					//Copy script tag attributes
					for (i = scriptAttributes.length - 1; i >= 0; i -= 1) {
						attribute = scriptAttributes[i];
						if (attribute.name !== 'src') {
							newscript.setAttribute(attribute.name, attribute.value);
						}
					}

					if (src) {
						try {
							// get some kind of XMLHttpRequest
							xhrObj = new XMLHttpRequest();
							// open and send a synchronous request
							xhrObj.open('GET', src, false);
							xhrObj.send('');
							// add the returned content to a newly created script tag
							newscript.type = "text/javascript";
							newscript.text = xhrObj.responseText;
						} catch (ignore) {
						}
					} else {
						for (i = 0; i < count; i++) {
							newscript.appendChild(script.childNodes[i]);
						}
					}
					script.parentNode.replaceChild(newscript, script);
				}.bind(null, dataUrl));

				return popup;
			};

			/**
			 * Convert url to data-url
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @return {string}
			 * @memberOf ns.router.micro.route.popup
			 * @protected
			 * @static
			 */
			routePopup._createDataUrl = function( absoluteUrl ) {
				return path.convertUrlToDataUrl( absoluteUrl );
			};

			/**
			 * Return true if active popup exists.
			 * @method _hasActivePopup
			 * @return {boolean}
			 * @memberOf ns.router.micro.route.popup
			 * @protected
			 * @static
			 */
			routePopup._hasActivePopup = function () {
				var popup = document.querySelector('.ui-popup-active');
				routePopup.activePopup = popup && engine.instanceWidget(popup, 'popup');
				return !!routePopup.activePopup;
			};

			ns.router.micro.route.popup = routePopup;

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return routePopup;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
