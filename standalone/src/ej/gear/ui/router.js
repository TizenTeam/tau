/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping class
 * @class ej.jqm
 */
(function (window, document, ej, gear) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../ui",
			"../../core",
			"../../engine",
			"../../router/micro/route",
			"../../router/micro/history"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			var gearNavigator = {
				/**
				*
				* @method init
				* @param {Object} router
				* @memberOf ej.jqm.micro
				*/
				init: function (router) {
					var history = ej.router.micro.history;

					if (gear.ui.autoInitializePage !== undefined) {
						ej.set('autoInitializePage', gear.ui.autoInitializePage);
					}
					gear.ui.changePage = router.open.bind(router);
					document.addEventListener('pageshow', function () {
						gear.ui.activePage = document.querySelector('.' + ej.widget.micro.Page.classes.uiPageActive);
					});
					gear.ui.firstPage = router.getFirstPage();
					gear.ui.back = history.back.bind(router);
					gear.ui.initializePage = router.init.bind(router);
					gear.ui.pageContainer = router.container;
					gear.ui.rule = ej.router.micro.route;
					gear.ui.openPopup = router.openPopup.bind(router);
					gear.ui.closePopup = router.closePopup.bind(router);

					gear.ui.navigator = router;
					gear.ui.navigator.rule = gear.ui.rule;
					gear.ui.navigator.open = gear.ui.changePage;
					gear.ui.navigator.back = gear.ui.back;
					gear.ui.navigator.history = history;
				}
			};

			document.addEventListener("initrouter", function (evt) {
				gearNavigator.init(evt.detail);
			}, false);

			gear.ui.navigator = gearNavigator;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return gear.ui.navigator;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej, window.gear));
