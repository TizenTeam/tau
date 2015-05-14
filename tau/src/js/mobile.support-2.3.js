/*global define, ns */
/**
 * #Tizen Advanced UI Framework Backward compatibility
 *
 * TAU framework Tizen 2.4 version has many changed feature for example component naming, API and structure.
 * But, We need to support previous version so we divide to previous support file and current version support file.
 * This file has previous support files.
 *
 * @class ns
 * @title Tizen Advanced UI Framework
 */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function (ns) {
	"use strict";
	define(
		[
			"require",
			"support/mobile/widget/ToggleSwitch.extra"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.info.profile = "mobile";
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
}(ns));
//>>excludeEnd("tauBuildExclude");
