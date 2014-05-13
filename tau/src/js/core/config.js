/*global window, define*/
/*jslint bitwise: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			// Default configuration properties
			ns.setConfig('rootDir', ns.getFrameworkPath(), true);
			ns.setConfig('version', '');
			ns.setConfig('allowCrossDomainPages', false, true);
			ns.setConfig('domCache', false, true);
			// .. other possible options
			// ns.setConfig('autoBuildOnPageChange', true);
			// ns.setConfig('autoInitializePage', true);
			// ns.setConfig('container', document.body); // for defining application container
			// ns.setConfig('pageContainer', document.body); // same as above, but for wearable version

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
