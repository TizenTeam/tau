/*global define */
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
(function () {
	"use strict";
	define(
		[
			"require",
<<<<<<< HEAD
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
=======
			"./ej/core",
			"./ej/config",
			"./gear/ui/all",
			"./ej/engine",
			// widget list
			//"./ej/utils/anchorHighlight",
			//"./ej/widget/micro/Page",
			//"./ej/widget/micro/Popup",
			//"./ej/widget/micro/PageContainer",
			//"./ej/widget/micro/IndexScrollbar",
			"./ej/widget/micro/VirtualListview",
			//"./ej/widget/micro/VirtualGrid",
			//"./ej/router/micro/Router",
			//"./ej/router/micro/route/page",
			//"./ej/router/micro/route/popup",
			//"./ej/router/micro/history"
		],
		function (require) {
			require(["./ej/init"], function () {
>>>>>>> e2075a6... [UPDATE] Ej Framework 0.1.6
				return true;
			});
		}
	);
}());
//>>excludeEnd("ejBuildExclude");
