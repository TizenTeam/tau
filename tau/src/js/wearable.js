/*global define */
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
(function () {
	"use strict";
	define(
		[
			"require",
			"./core",
			"./core/config",
			"./tau/all",
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
			"./core/widget/wearable/scroller/scrollbar/Scrollbar",
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
//>>excludeEnd("ejBuildExclude");