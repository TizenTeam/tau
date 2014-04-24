/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping class
 * @class ns.jqm
 */
(function (window, document, ns, $) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../jqm",
			"../core/utils/colors"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.jqm.colors = {
				/**
				* Proxy colors library from ns namespace to jQM namespace
				* @method init
				* @member ns.jqm
				* @static
				*/
				init: function () {
					if ($) {
						$.mobile.tizen.clrlib = ns.utils.colors;
					}
				}
			};
			document.addEventListener("mobileinit", function () {
				ns.jqm.colors.init();
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm.colors;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns, ns.jqm.jQuery));
