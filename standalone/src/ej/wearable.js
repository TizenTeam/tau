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
			"./ej/widget/wearable/indexscrollbar/IndexScrollbar",
			"./ej/widget/wearable/VirtualListview",
			"./ej/widget/wearable/SectionChanger",
			"./ej/widget/wearable/VirtualGrid",
			"./ej/widget/wearable/scroller/Scroller",
			"./ej/widget/wearable/scroller/scrollbar/Scrollbar",
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
