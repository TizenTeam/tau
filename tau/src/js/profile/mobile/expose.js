/*global window, define, ns */
/*jslint plusplus: true, nomen: true */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
		 	"../../core/engine",
		 	"../../core/util/object",
			"./widget/mobile/Loader",
			"./router/Page",
			"./router/PageExternal",
			"./router/PageTransition"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var engine = ns.engine,
				object = ns.util.object,
				router = null;

			/**
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
			 * @method openPopup
			 * @inheritdoc ns.router.Page#open
			 * @member ns
			 */
			ns.openPopup = function (to, options) {
				if (router) {
					router.open(to, object.merge({}, options, {
						rel : "popup"
					}));
				}
			};

			/**
			 * Close popup
			 * @method closePopup
			 * @static
			 * @member ns
			 */
			ns.closePopup = function () {
				var activePopup = ns.activePopup;
				if(activePopup) {
					activePopup.close();
				}
			};

			document.addEventListener("routerinit", function () {
				router = engine.getRouter();
			}, true);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, ns));
