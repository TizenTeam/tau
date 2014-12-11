/*global define, ns */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function (ns) {
	"use strict";
	define(
		[
			"require",
			"./core/core",
			"./core/config",
			"./profile/wearable/config",
			"./core/info",
			"./core/engine",
			// widget list
			"./core/util/anchorHighlight",
			"./core/widget/core/ContextPopup",
			"./core/widget/core/Page",
			"./core/widget/core/PageContainer",
			"./profile/wearable/widget/wearable/Button",
			"./profile/wearable/widget/wearable/Checkboxradio",
			"./profile/wearable/widget/wearable/Listview",
			"./profile/wearable/widget/wearable/indexscrollbar/IndexScrollbar",
			"./profile/wearable/widget/wearable/Progress",
			"./profile/wearable/widget/wearable/Progressing",
			"./profile/wearable/widget/wearable/ToggleSwitch",
			"./profile/wearable/widget/wearable/VirtualListview",
			"./profile/wearable/widget/wearable/SectionChanger",
			"./profile/wearable/widget/wearable/VirtualGrid",
			"./profile/wearable/widget/wearable/SwipeList",
			"./profile/wearable/widget/wearable/scroller/Scroller",
			"./profile/wearable/widget/wearable/scroller/scrollbar/ScrollBar",
			"./profile/wearable/router/Router",
			"./profile/wearable/router/route/page",
			"./profile/wearable/router/route/popup",
			"./profile/wearable/router/history",
			"./profile/wearable/expose",
			"./profile/wearable/backward",
			// Modules to be loaded after
			"./core/init"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.info.profile = "wearable";
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
}(ns));
//>>excludeEnd("tauBuildExclude");
