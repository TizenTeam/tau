/*global define */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function () {
	"use strict";
	define(
		[
			"require",
			"./core/core",
			"./core/config",
			"./profile/wearable/profile",
			"./core/export",
			"./core/engine",
			// widget list
			"./core/utils/anchorHighlight",
			"./profile/wearable/widget/wearable/Page",
			"./profile/wearable/widget/wearable/Popup",
			"./profile/wearable/widget/wearable/PageContainer",
			"./profile/wearable/router/Router",
			"./profile/wearable/router/route/page",
			"./profile/wearable/router/route/popup",
			"./profile/wearable/router/history"
		],
		function (require) {
			require(["./core/init"], function () {
				return true;
			});
		}
	);
}());
//>>excludeEnd("tauBuildExclude");
