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
			"../tau"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			document.addEventListener("mobileinit", function () {
				ns._export = frameworkNamespace;
			}, false);

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(document, ns, window.tau));
