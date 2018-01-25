/*global window, define, ns */
/*jslint plusplus: true, nomen: true */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/core",
			"../../core/engine",
			"../../core/util/object",
			"./widget/mobile/Loader",
			"../../core/router/Router"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var engine = ns.engine,
				eventType = engine.eventType,
				object = ns.util.object,
				router = null;

			/**
			 * Look to ns.router.Page#open
			 * @method changePage
			 * @inheritdoc ns.router.Page#open
			 * @member ns
			 */
			ns.changePage = function (toPage, options) {
				if (router) {
					router.open(toPage, options);
				}
			};

			/**
			 * Back in history.
			 * @method back
			 * @static
			 * @member ns
			 */
			ns.back = function () {
				window.history.back();
			};

			/**
			 * Look to ns.router.Page#open
			 * @method openPopup
			 * @inheritdoc ns.router.Page#open
			 * @member ns
			 */
			ns.openPopup = function (to, options) {
				if (router) {
					router.open(to, object.merge({}, options, {
						rel: "popup"
					}));
				}
			};

			/**
			 * Close active popup
			 * @method closePopup
			 * @static
			 * @member ns
			 */
			ns.closePopup = function () {
				var activePopup = ns.activePopup;

				if (activePopup) {
					activePopup.close();
				}
			};

			/**
			 * Returns active page element
			 * @inheritdoc ns.router.Router#getActivePageElement
			 * @method getActivePage
			 * @member tau
			 */
			ns.getActivePage = function () {
				if (router) {
					return router.getActivePageElement();
				}
				return null;
			};

			/**
			 * Initialize router on router init
			 */
			function init() {
				router = engine.getRouter();
			}

			/**
			 * Remove events listeners on framework destroy
			 */
			function destroy() {
				document.removeEventListener(eventType.ROUTER_INIT, init, true);
				document.removeEventListener(eventType.DESTROY, destroy, true);
			}

			document.addEventListener(eventType.ROUTER_INIT, init, true);
			document.addEventListener(eventType.DESTROY, destroy, true);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, ns));
