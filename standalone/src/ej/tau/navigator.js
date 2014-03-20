/*global window, define */
/*jslint plusplus: true, nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class tau.navigator
 * @inheritdoc ns.router.micro.Router
 * @extends ns.router.micro.Router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
(function (document, frameworkNamespace, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../tau",
			"../ej/core",
			"../ej/engine",
			"../ej/router/micro/route",
			"../ej/router/micro/history"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			document.addEventListener("beforerouterinit", function (evt) {
				var tau = ns.getOrginalNamespace();
				if (tau && tau.autoInitializePage !== undefined) {
					ns.autoInitializePage = tau.autoInitializePage;
				} else {
					ns.autoInitializePage = true;
				}
				frameworkNamespace.set('autoInitializePage', ns.autoInitializePage);
			}, false);

			document.addEventListener("routerinit", function (evt) {
				var router = evt.detail,
					history = frameworkNamespace.router.micro.history,
					navigator,
					back = history.back.bind(router),
					changePage = router.open.bind(router),
					rule = frameworkNamespace.router.micro.route;
				/**
				 * @method changePage
				 * @inheritdoc ns.router.micro.Router#open
				 * @memberOf tau
				 */
				ns.changePage = router.open.bind(router);
				document.addEventListener('pageshow', function () {
					/**
					 * Current active page
					 * @property {HTMLElement} activePage
					 * @memberOf tau
					 */
					ns.activePage = document.querySelector('.' + frameworkNamespace.widget.micro.Page.classes.uiPageActive);
				});
				/**
				 * @property {HTMLElement} firstPage
				 * @inheritdoc ns.router.micro.Router#firstPage
				 * @memberOf tau
				 */
				ns.firstPage = router.getFirstPage();
				/**
				 * @method back
				 * @inheritdoc ns.router.micro.history#back
				 * @memberOf tau
				 */
				ns.back = back;
				/**
				 * @method initializePage
				 * @inheritdoc ns.router.micro.Router#init
				 * @memberOf tau
				 */
				ns.initializePage = router.init.bind(router);
				/**
				 * @property {HTMLElement} pageContainer
				 * @inheritdoc ns.router.micro.Router#pageContainer
				 * @memberOf tau
				 */
				ns.pageContainer = router.container;
				/**
				 * @property {Object} rule
				 * @inheritdoc ns.router.micro.route
				 * @memberOf tau
				 */
				ns.rule = rule;
				/**
				 * @method openPopup
				 * @inheritdoc ns.router.micro.Router#openPopup
				 * @memberOf tau
				 */
				ns.openPopup = function(to, options) {
					var htmlElementTo;
					if (to && to.length !== undefined && typeof to === 'object') {
						htmlElementTo = to[0];
					} else {
						htmlElementTo = to;
					}
					router.openPopup(htmlElementTo, options);
				};
				/**
				 * @method closePopup
				 * @inheritdoc ns.router.micro.Router#closePopup
				 * @memberOf tau
				 */
				ns.closePopup = router.closePopup.bind(router);

				navigator = router;
				/**
				 * @property {Object} rule object contains rules for navigator
				 * @extends ns.router.micro.rule
				 * @instance
				 * @memberOf tau.navigator
				 */
				navigator.rule = rule;
				/**
				 * @method back
				 * @inheritdoc ns.router.micro.history#back
				 * @memberOf tau.navigator
				 */
				navigator.back = back;
				/**
				 * @property {Object} history
				 * @inheritdoc ns.router.micro.history
				 * @extends ns.router.micro.history
				 * @memberOf tau.navigator
				 */
				navigator.history = history;
				ns.navigator = navigator;
			}, false);

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej, window.tau));
