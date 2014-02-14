/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 *
 * @class gear.ui.defaults
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

			document.addEventListener("initjqm", function () {
				var navigator,
					selectors = frameworkNamespace.micro.selectors;

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
			}, false);

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(document, window.ej, window.gear.ui));
