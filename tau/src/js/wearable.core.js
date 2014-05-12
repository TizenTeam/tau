/*global define */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function () {
	"use strict";
	define(
		[
			"require",
			"./core/core",
			"./core/config",
			"./tau/all",
			"./core/engine",
			// widget list
			"./core/utils/anchorHighlight",
			"./core/widget/wearable/Page",
			"./core/widget/wearable/Popup",
			"./core/widget/wearable/PageContainer",
			"./core/router/wearable/Router",
			"./core/router/wearable/route/page",
			"./core/router/wearable/route/popup",
			"./core/router/wearable/history"
		],
		function (require) {
			require(["./core/init"], function () {
				return true;
			});
		}
	);
}());
//>>excludeEnd("tauBuildExclude");
