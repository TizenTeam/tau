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
					gear.ui.defaults = {
						autoInitializePage: true,
						pageTransition: 'none',
						popupTransition: 'none'
					};
					gear.ui.dynamicBaseEnabled = true;
					gear.ui.dialogHashKey = "ui-dialog";
					gear.ui.selectors = ej.micro.selectors;
					gear.ui.navigator = gear.ui.navigator || {};
					gear.ui.navigator.defaults = {
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

			gear.ui.defaults = defaults;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return gear.ui.defaults;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej, window.gear));
