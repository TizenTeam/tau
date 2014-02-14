/*global define, window */
(function (ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"./core",
			"./engine"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			if (ej.get("autorun", true) === true) {
				ej.engine.run();
			}
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.ej));
