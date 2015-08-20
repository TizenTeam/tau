/*global window, define, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint plusplus: true, nomen: true */
/**
 * @class tau.expose
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/core",
			"../../core/engine",
			"../../core/util/object",
			"../../core/widget/core/Page",
			"../../core/router/route",
			"../../core/history"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			document.addEventListener("beforerouterinit", function () {
				if (ns.autoInitializePage !== undefined) {
					ns.setConfig("autoInitializePage", ns.autoInitializePage);
				}
			}, false);

			document.addEventListener("routerinit", function (evt) {
				var router = evt.detail,
					utilObject = ns.util.object,
					routePage = router.getRoute("page"),
					routePopup = router.getRoute("popup"),
					history = ns.history,
					back = history.back.bind(router),
					classes = ns.widget.core.Page.classes,
					pageActiveClass = classes.uiPageActive;
				/**
				 * @method changePage
				 * @inheritdoc ns.router.Router#open
				 * @member tau
				 */
				ns.changePage = router.open.bind(router);
				document.addEventListener("pageshow", function () {
					/**
					 * Current active page
					 * @property {HTMLElement} activePage
					 * @member tau
					 */
					ns.activePage = document.querySelector("." + pageActiveClass);
				});
				/**
				 * First page element
				 * @inheritdoc ns.router.Router#firstPage
				 * @property {HTMLElement} firstPage
				 * @member tau
				 */
				ns.firstPage = routePage.getFirstElement();
				/**
				 * Returns active page element
				 * @inheritdoc ns.router.Router#getActivePageElement
				 * @method getActivePage
				 * @member tau
				 */
				ns.getActivePage = routePage.getActiveElement.bind(routePage);
				/**
				 * @inheritdoc ns.router.history#back
				 * @method back
				 * @member tau
				 */
				ns.back = back;
				/**
				 * @inheritdoc ns.router.Router#init
				 * @method initializePage
				 * @member tau
				 */
				ns.initializePage = router.init.bind(router);
				/**
				 * Page Container widget
				 * @property {HTMLElement} pageContainer
				 * @inheritdoc ns.router.Router#container
				 * @member tau
				 */
				ns.pageContainer = router.container;
				/**
				 * @method openPopup
				 * @inheritdoc ns.router.Router#openPopup
				 * @member tau
				 */
				ns.openPopup = function(to, options) {
					var htmlElementTo;
					if (to && to.length !== undefined && typeof to === "object") {
						htmlElementTo = to[0];
					} else {
						htmlElementTo = to;
					}
					options = utilObject.merge({}, options, {rel: "popup"});
					router.open(htmlElementTo, options);
				};
				/**
				 * @method closePopup
				 * @inheritdoc ns.router.Router#closePopup
				 * @member tau
				 */
				ns.closePopup = routePopup.close.bind(routePopup, null);

			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document));
