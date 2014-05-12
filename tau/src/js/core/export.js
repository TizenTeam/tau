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
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./conflict"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

//			function setFrameworkExport() {
//				document.removeEventListener('mobileinit', setFrameworkExport, true);
//
//				ns._export = frameworkNamespace;
//			}
//
//			// When framework doesn't start automatically wait for mobileinit
//			document.addEventListener('mobileinit', setFrameworkExport, true);

			// We need to set this if framework has autostarted
			ns._export = frameworkNamespace;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, ns, window.tau));
