/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class ns.router.micro.route.popup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
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
			var RoutePopup = {
					defaults: {
						transition: 'none',
						container: null,
						volatileRecord: true
					},
					filter: ns.micro.selectors.popup,
					activePopup: null,
					events: {
						POPUP_HIDE: 'popuphide'
					}
				},
				engine = ns.engine,
				path = ns.utils.path,
				utilSelector = ns.utils.selectors,
				history = ns.router.micro.history,
				pathUtils = ns.utils.path,
				DOM = ns.utils.DOM,
				slice = [].slice,
				popupHashKey = "popup=true",
				popupHashKeyReg = /([&|\?]popup=true)/;

			/**
			* Tries to find a popup element matching id and filter (selector).
			* Adds data url attribute to found page, sets page = null when nothing found
			* @method findPopupAndSetDataUrl
			* @private
			* @param {string} id
			* @param {string} filter
			* @memberOf ns.router.micro.route.popup
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

			RoutePopup.option = function () {
				return RoutePopup.defaults;
			};
			/**
			* Change page
			* @method open
			* @param {HTMLElement|string} toPopup
			* @param {Object} options
			* @static
			* @memberOf ns.router.micro.route.popup
			*/
			RoutePopup.open = function (toPopup, options) {
				var popup,
					popupKey,
					router = engine.getRouter(),
					url = pathUtils.getLocation(),
					removePopup = function () {
						document.removeEventListener(RoutePopup.events.POPUP_HIDE, removePopup, false);
						toPopup.parentNode.removeChild(toPopup);
						RoutePopup.activePopup = null;
					},
					openPopup = function () {
						document.removeEventListener(RoutePopup.events.POPUP_HIDE, openPopup, false);
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
					container = options.container ? activePage.element.querySelector(options.container) : activePage.element;
					container.appendChild(toPopup);
					document.addEventListener(RoutePopup.events.POPUP_HIDE, removePopup, false);
				}

				if (RoutePopup._hasActivePopup()) {
					document.addEventListener(RoutePopup.events.POPUP_HIDE, openPopup, false);
					RoutePopup._closeActivePopup();
				} else {
					openPopup();
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

			RoutePopup.onOpenFailed = function(/* options */) {
			};

			RoutePopup.find = function( absUrl ) {
				var dataUrl = this._createDataUrl( absUrl ),
					activePage = engine.getRouter().getContainer().getActivePage(),
					popup;

				popup = activePage.element.querySelector("[data-url='" + dataUrl + "']" + this.filter);

				if ( !popup && dataUrl && !path.isPath( dataUrl ) ) {
					popup = findPopupAndSetDataUrl(dataUrl, this.filter);
				}

				return popup;
			};

			RoutePopup.parse = function( html, absUrl ) {
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

			RoutePopup._createDataUrl = function( absoluteUrl ) {
				return path.convertUrlToDataUrl( absoluteUrl );
			};

			RoutePopup._hasActivePopup = function () {
				var popup = document.querySelector('.ui-popup-active');
				RoutePopup.activePopup = popup && engine.instanceWidget(popup, 'popup');
				return !!RoutePopup.activePopup;
			};

			ns.router.micro.route.popup = RoutePopup;

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return RoutePopup;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
