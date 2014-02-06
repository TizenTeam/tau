/*global define */
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
(function () {
	"use strict";
	define(
		[
			"require",
			"./gear/ui/widget",
			// widget list
			"./widget/micro/VirtualListview"
		],
		function (require) {
			require(["./init"], function () {
				return true;
			});
		}
	);
}());
//>>excludeEnd("ejBuildExclude");
