/*global window, define */
/*jslint plusplus: true, nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class tau.navigator
 * @inheritdoc ns.router.wearable.Router
 * @extends ns.router.wearable.router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
(function (document, frameworkNamespace, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tau",
			"../core/core",
			"../core/engine",
			"../core/router/wearable/route",
			"../core/router/wearable/history"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

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
					history = frameworkNamespace.router.wearable.history,
					navigator,
					back = history.back.bind(router),
					changePage = router.open.bind(router),
					rule = frameworkNamespace.router.wearable.route;
				/**
				 * @method changePage
				 * @inheritdoc ns.router.wearable.Router#open
				 * @member tau
				 */
				ns.changePage = router.open.bind(router);
				document.addEventListener('pageshow', function () {
					/**
					 * Current active page
					 * @property {HTMLElement} activePage
					 * @member tau
					 */
					ns.activePage = document.querySelector('.' + frameworkNamespace.widget.wearable.Page.classes.uiPageActive);
				});
				/**
				 * First page element
				 * @inheritdoc ns.router.wearable.Router#firstPage
				 * @property {HTMLElement} firstPage
				 * @member tau
				 */
				ns.firstPage = router.getFirstPage();
				/**
				 * @inheritdoc ns.router.wearable.history#back
				 * @method back
				 * @member tau
				 */
				ns.back = back;
				/**
				 * @inheritdoc ns.router.wearable.Router#init
				 * @method initializePage
				 * @member tau
				 */
				ns.initializePage = router.init.bind(router);
				/**
				 * Page Container widget
				 * @property {HTMLElement} pageContainer
				 * @inheritdoc ns.router.wearable.Router#container
				 * @member tau
				 */
				ns.pageContainer = router.container;
				/**
				 * @property {Object} rule
				 * @extends ns.router.wearable.route
				 * @member tau
				 */
				ns.rule = rule;
				/**
				 * @method openPopup
				 * @inheritdoc ns.router.wearable.Router#openPopup
				 * @member tau
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
				 * @inheritdoc ns.router.wearable.Router#closePopup
				 * @member tau
				 */
				ns.closePopup = router.closePopup.bind(router);

				/**
				 * @property {Object} navigator
				 * @extends ns.router.wearable.router
				 * @instance
				 * @member tau
				 */
				navigator = router;
				/**
				 * @property {Object} rule object contains rules for navigator
				 * @extends ns.router.wearable.rule
				 * @instance
				 * @member tau.navigator
				 */
				navigator.rule = rule;
				/**
				 * @method back
				 * @inheritdoc ns.router.wearable.history#back
				 * @member tau.navigator
				 */
				navigator.back = back;
				/**
				 * Object to change history of browsing pages or popups
				 * @property {Object} history
				 * @extends ns.router.wearable.history
				 * @member tau.navigator
				 */
				navigator.history = history;
				ns.navigator = navigator;
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns, window.tau));
