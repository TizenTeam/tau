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
(function (document, frameworkNamespace, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../tau",
			"./navigator",
			"../ej/micro/selectors",
			"../ej/engine"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			document.addEventListener("mobileinit", function () {
				var navigator,
					selectors = frameworkNamespace.micro.selectors;

				ns.defaults = {
					autoInitializePage: true,
					pageTransition: 'none',
					popupTransition: 'none'
				};
				/**
				 * Set dynamic base tag changes.
				 * @property {boolean} [dynamicBaseEnabled=true]
				 * @memberOf tau
				 */
				ns.dynamicBaseEnabled = true;
				/**
				 * @inheritdoc ns.micro.selectors
				 * @class tau.selectors
				 * @extend ns.micro.selectors
				 */
				ns.selectors = selectors;
				navigator = ns.navigator || {};
				/**
				 * @property {Object} defaults Default values for router
				 * @property {boolean} [defaults.fromHashChange = false]
				 * @property {boolean} [defaults.reverse = false]
				 * @property {boolean} [defaults.showLoadMsg = true]
				 * @property {number} [defaults.loadMsgDelay = 0]
				 * @memberOf tau.navigator
				 */
				navigator.defaults = {
					fromHashChange: false,
					reverse: false,
					showLoadMsg: true,
					loadMsgDelay: 0
				};
				ns.navigator = navigator;
			}, false);

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(document, ns, window.tau));
