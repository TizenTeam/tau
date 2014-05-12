/*global window, define, ns */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, frameworkNamespace, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/conflict",
			"../../core/wearable/selectors"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			document.addEventListener("mobileinit", function () {
				var navigator,
					selectors = frameworkNamespace.wearable.selectors;

				ns.defaults = {
					autoInitializePage: true,
					pageTransition: 'none',
					popupTransition: 'none'
				};
				/**
				 * Set dynamic base tag changes.
				 * @property {boolean} [dynamicBaseEnabled=true]
				 * @member tau
				 */
				ns.dynamicBaseEnabled = true;
				/**
				 * @inheritdoc ns.wearable.selectors
				 * @class tau.selectors
				 * @extend ns.wearable.selectors
				 */
				ns.selectors = selectors;
				navigator = ns.navigator || {};
				/**
				 * @property {Object} defaults Default values for router
				 * @property {boolean} [defaults.fromHashChange = false]
				 * @property {boolean} [defaults.reverse = false]
				 * @property {boolean} [defaults.showLoadMsg = true]
				 * @property {number} [defaults.loadMsgDelay = 0]
				 * @member tau.navigator
				 */
				navigator.defaults = {
					fromHashChange: false,
					reverse: false,
					showLoadMsg: true,
					loadMsgDelay: 0
				};
				ns.navigator = navigator;
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, ns, window.tau));
