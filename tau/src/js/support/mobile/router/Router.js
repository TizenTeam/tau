/*global window, define, XMLHttpRequest, Node, HTMLElement, ns */
/*jslint nomen: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Router Support
 * Legacy router API support
 *
 * @class ns.router.Router
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				router = engine.getRouter();

			function defineActivePage(router) {
				Object.defineProperty(router, "activePage", {
					get: function () {
						return router.container.activePage
					}
				});
			}

			if (router) {
				defineActivePage(router);
			} else {
				document.addEventListener("routerinit", function(event) {
					var router = event.detail;
					defineActivePage(router);
				});
			}

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
