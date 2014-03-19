/*global define */
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
(function () {
	"use strict";
	define(
		[
			"require",
			"./ej/widget",
			"./tau/widget",
			// widget list
			"./ej/widget/micro/VirtualListview"
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
