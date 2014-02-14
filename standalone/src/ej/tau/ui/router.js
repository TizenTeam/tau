/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping class
 * @class ej.jqm
 */
(function (window, document, ej, tau) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../ui",
			"../../ej/core",
			"../../ej/engine",
			"../../ej/router/micro/route",
			"../../ej/router/micro/history"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			var tauNavigator = {
				/**
				*
				* @method init
				* @param {Object} router
				* @memberOf ej.jqm.micro
				*/
				init: function (router) {
					var history = ej.router.micro.history;

					if (tau.autoInitializePage !== undefined) {
						ej.set('autoInitializePage', tau.autoInitializePage);
					}
					tau.changePage = router.open.bind(router);
					document.addEventListener('pageshow', function () {
						tau.activePage = document.querySelector('.' + ej.widget.micro.Page.classes.uiPageActive);
					});
					tau.firstPage = router.getFirstPage();
					tau.back = history.back.bind(router);
					tau.initializePage = router.init.bind(router);
					tau.pageContainer = router.container;
					tau.rule = ej.router.micro.route;
					tau.openPopup = router.openPopup.bind(router);
					tau.closePopup = router.closePopup.bind(router);

					tau.navigator = router;
					tau.navigator.rule = tau.rule;
					tau.navigator.open = tau.changePage;
					tau.navigator.back = tau.back;
					tau.navigator.history = history;
				}
			};

			document.addEventListener("initrouter", function (evt) {
				tauNavigator.init(evt.detail);
			}, false);

			tau.navigator = tauNavigator;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return tau.navigator;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej, window.tau));
