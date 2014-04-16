/*global define */
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
(function () {
	"use strict";
	define(
		[
			"require",
			"./ej",
			"./ej/config",
			"./tau/all",
			"./ej/engine",
			// widget list
			"./ej/utils/anchorHighlight",
			"./ej/widget/wearable/Page",
			"./ej/widget/wearable/Popup",
			"./ej/widget/wearable/PageContainer",
			"./ej/router/wearable/Router",
			"./ej/router/wearable/route/page",
			"./ej/router/wearable/route/popup",
			"./ej/router/wearable/history"
		],
		function (require) {
			require(["./ej/init"], function () {
				return true;
			});
		}
	);
}());
//>>excludeEnd("ejBuildExclude");
