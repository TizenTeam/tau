/*global window, define*/
/*jslint bitwise: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			// Default configuration properties for micro
			ns.set('autoBuildOnPageChange', false);
			// .. other possible options
			// ns.set('autoInitializePage', true);
			// ns.get('pageContainer'); // defining application container for micro

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
