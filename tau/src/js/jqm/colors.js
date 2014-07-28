/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping object for color support
 * @class ns.jqm.colors
 */
(function (window, document, ns, $) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./namespace",
			"../core/engine",
			"../core/util/colors"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.jqm.colors = {
				/**
				* Proxy colors library from ns namespace to jQM namespace
				* @method init
				* @member ns.jqm.colors
				* @static
				*/
				init: function () {
					if ($) {
						$.mobile.tizen.clrlib = ns.util.colors;
					}
				}
			};
			// Listen when framework is ready
			document.addEventListener(ns.engine.eventType.INIT, function () {
				ns.jqm.colors.init();
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm.colors;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns, ns.jqm.jQuery));
