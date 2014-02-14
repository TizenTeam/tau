/*global define */
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
(function () {
	"use strict";
	define(
		[
			"require",
			"./tau/ui/widget",
			// widget list
			"./ej/widget/micro/VirtualListview"
		],
		function (require) {
			require(["./ej/init"], function () {
//>>excludeEnd("ejBuildExclude");
				(function() {
					var newTau = tau.noConflict();
					tau.VirtualListview = newTau.VirtualListview.bind(newTau);
				}());
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
				return true;
			});
		}
	);
}());
//>>excludeEnd("ejBuildExclude");
