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
			"./core/widget/wearable/Page",
			"./core/widget/wearable/Popup",
			"./core/widget/wearable/PageContainer",
			"./core/widget/wearable/indexscrollbar/IndexScrollbar",
			"./core/widget/wearable/VirtualListview",
			"./core/widget/wearable/SectionChanger",
			"./core/widget/wearable/VirtualGrid",
			"./core/widget/wearable/scroller/Scroller",
			"./core/widget/wearable/scroller/scrollbar/ScrollBar",
			"./core/widget/wearable/SwipeList",
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
