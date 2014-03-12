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
			"../../micro/selectors",
			"../../engine"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var defaults = {
				/**
				* Proxy colors library from ej namespace to jQM namespace
				* @method init
				* @memberOf ej.jqm
				* @static
				*/
				init: function () {
					tau.defaults = {
						autoInitializePage: true,
						pageTransition: 'none',
						popupTransition: 'none'
					};
					tau.dynamicBaseEnabled = true;
					tau.dialogHashKey = "ui-dialog";
					tau.selectors = ej.micro.selectors;
					tau.navigator = tau.navigator || {};
					tau.navigator.defaults = {
						fromHashChange: false,
						reverse: false,
						showLoadMsg: true,
						loadMsgDelay: 0
					};
				}
			};

			document.addEventListener("initjqm", function () {
				defaults.init();
			}, false);

			tau.defaults = defaults;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return tau.defaults;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej, window.tau));
