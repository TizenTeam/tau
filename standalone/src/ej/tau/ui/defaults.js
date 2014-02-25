/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 *
 * @class gear.ui.defaults
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, frameworkNamespace, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../ui",
			"../../ej/micro/selectors",
			"../../ej/engine"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			function initGearDefaults() {
				var navigator,
					selectors = frameworkNamespace.micro.selectors;

				document.removeEventListener("initjqm", initGearDefaults, false);
				ns.defaults = {
					autoInitializePage: true,
					pageTransition: 'none',
					popupTransition: 'none'
				};
				ns.dynamicBaseEnabled = true;
				ns.selectors = selectors;
				navigator = ns.navigator || {};
				navigator.defaults = {
					fromHashChange: false,
					reverse: false,
					showLoadMsg: true,
					loadMsgDelay: 0
				};
				ns.navigator = navigator;
			}

			document.addEventListener("initjqm", initGearDefaults, false);

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(document, window.ej, window.gear.ui));
