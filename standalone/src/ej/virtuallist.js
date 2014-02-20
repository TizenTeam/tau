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
//>>excludeEnd("ejBuildExclude");
(function() {
var newGear = gear.noConflict();
gear.ui.VirtualListview = newGear.ui.VirtualListview.bind(newGear.ui);
}());
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
				return true;
			});
		}
	);
}());
//>>excludeEnd("ejBuildExclude");
