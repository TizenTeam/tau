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
			ns.set('rootDir', ns.getFrameworkPath());
			ns.set('version', '');
			ns.set('allowCrossDomainPages', false);
			ns.set('domCache', false);
			ns.set('autoBuildOnPageChange', true);
			// .. other possible options
			// ns.set('autoInitializePage', true);
			// ns.set('container', ...); // for defining application container
			// ns.set('pageContainer', ...); // same as above, but for micro version

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
