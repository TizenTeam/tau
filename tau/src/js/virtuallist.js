/*global define */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
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
//>>excludeEnd("tauBuildExclude");
(function() {
	var newTau = tau.noConflict();
	tau.VirtualListview = newTau.VirtualListview.bind(newTau);
}());
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
}());
//>>excludeEnd("tauBuildExclude");
