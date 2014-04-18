/*global window, define*/
/*jslint bitwise: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../core"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			ns.set('rootDir', ns.getFrameworkPath());
			ns.set('version', '');
			ns.set('allowCrossDomainPages', false);
			ns.set('domCache', false);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(ns));
