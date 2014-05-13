/*global define, window */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core",
			"./engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			if (ns.getConfig("autorun", true) === true) {
				ns.engine.run();
			}
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
