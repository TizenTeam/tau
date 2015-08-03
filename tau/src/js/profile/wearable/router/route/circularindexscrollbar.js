/*global window, define */
/*jslint nomen: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Route CircularIndexScrollbar
 * Support class for router to control circularindexscrollbar widget in profile Wearable.
 * @class ns.router.route.circularindexscrollbar
 * @author Junyoung Park <jy-.park@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/path",
			"../../../../core/util/selectors",
			"../../../../core/util/object",
			"../../../../core/router/route",
			"../../../../core/history",
			"../../widget/wearable/CircularIndexScrollbar"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CircularIndexScrollbar = ns.widget.wearable.CircularIndexScrollbar,
				CircularIndexScrollbarPrototype = CircularIndexScrollbar.prototype,
				util = ns.util,
				path = util.path,
				DOM = util.DOM,
				object = util.object,
				utilSelector = util.selectors,
				history = ns.router.history,
				engine = ns.engine,
				slice = [].slice,
				routeCircularIndexScrollbar = {},
				circularindexscrollbarHashKey = "circularindexscrollbar=true",
				circularindexscrollbarHashKeyReg = /([&|\?]circularindexscrollbar=true)/,
				INDEXSCROLLBAR_SELECTOR = ".ui-circularindexscrollbar";

			/**
			 * Property defining selector for filtering only circularIndexScrollbar elements
			 * @property {string} filter
			 * @member ns.router.route.circularindexscrollbar
			 * @static
			 */
			routeCircularIndexScrollbar.filter = INDEXSCROLLBAR_SELECTOR;

			/**
			 * Returns default route options used inside Router.
			 * But, circularindexscrollbar router has not options.
			 * @method option
			 * @static
			 * @member ns.router.route.circularindexscrollbar
			 * @return null
			 */
			routeCircularIndexScrollbar.option = function () {
				return null;
			};

			/**
			 * This method opens the circularindexscrollbar.
			 * @method open
			 * @param {HTMLElement} element
			 * @param {Object} [options]
			 * @member ns.router.route.circularindexscrollbar
			 */
			routeCircularIndexScrollbar.open = function (element, options) {
				return null;
			};

			/**
			 * This method determines target circularIndexScrollbar to open.
			 * @method find
			 * @param {string} absUrl Absolute path to opened circularIndexScrollbar widget
			 * @member ns.router.route.circularindexscrollbar
			 * @return {?HTMLElement} circularIndexScrollbarElement
			 */
			routeCircularIndexScrollbar.find = function (absUrl) {
				var self = this,
					dataUrl = path.convertUrlToDataUrl(absUrl),
					activePage = engine.getRouter().getContainer().getActivePage(),
					circularIndexScrollbar;

				circularIndexScrollbar = activePage.element.querySelector("#" + dataUrl);

				return circularIndexScrollbar;
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * But, circularIndexScrollbar router doesn't need to that.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed page
			 * @member ns.router.route.circularindexscrollbar
			 * @return {?HTMLElement} Element of page in parsed document.
			 */
			routeCircularIndexScrollbar.parse = function (html, absUrl) {
				return null;
			};

			/**
			 * This method sets active circularIndexScrollbar and manages history.
			 * @method setActive
			 * @param {Object} activeWidget
			 * @member ns.router.route.circularindexscrollbar
			 * @static
			 */
			routeCircularIndexScrollbar.setActive = function (activeWidget) {
				var url,
					pathLocation = path.getLocation(),
					documentUrl = pathLocation.replace(circularindexscrollbarHashKeyReg, "");

				this._activeWidget = activeWidget;

				if(activeWidget) {
					url = path.addHashSearchParams(documentUrl, circularindexscrollbarHashKey);
					history.replace({}, "", url);
				} else if (pathLocation !== documentUrl) {
					history.back();
				}
			};

			/**
			 * This method handles hash change.
			 * @method onHashChange
			 * @param {Object} options
			 * @static
			 * @member ns.router.route.circularindexscrollbar
			 * @return {boolean}
			 */
			routeCircularIndexScrollbar.onHashChange = function (options) {
				var self = this,
					url = options.url,
					prev = options.stateUrl,
					activeWidget = self._activeWidget;

				if (activeWidget && prev.search(circularindexscrollbarHashKey) > 0 && url.search(circularindexscrollbarHashKey) < 0) {
					activeWidget.hide(options);
				}
				return false;
			};

			ns.router.route.circularindexscrollbar = routeCircularIndexScrollbar;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routeCircularIndexScrollbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
