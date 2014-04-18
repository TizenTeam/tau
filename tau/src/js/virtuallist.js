/*global define */
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
(function () {
	"use strict";
	define(
		[
			"require",
			"./core/widget",
			"./tau/widget",
			// widget list
			"./core/widget/wearable/VirtualListview"
		],
		function (require) {
//>>excludeEnd("ejBuildExclude");
(function() {
	var newTau = tau.noConflict();
	tau.VirtualListview = newTau.VirtualListview.bind(newTau);
}());
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
}());
//>>excludeEnd("ejBuildExclude");
