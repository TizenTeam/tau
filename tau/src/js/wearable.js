/*global define, ns */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function (ns) {
	"use strict";
	define(
		[
			"require",
			"./core/core",
			"./core/config",
			"./core/support/tizen",
			"./profile/wearable/config",
			"./core/info",
			"./core/engine",
			// widget list
			"./core/util/anchorHighlight",
			"./core/widget/core/PageContainer",
			"./core/widget/core/Button",
			"./core/widget/core/Checkboxradio",
			"./core/widget/core/Marquee",
			"./profile/wearable/widget/wearable/Page",
			"./profile/wearable/widget/wearable/Popup",
			"./profile/wearable/widget/wearable/ExpandableHeader",
			"./profile/wearable/widget/wearable/Drawer",
			"./profile/wearable/widget/wearable/CircleProgressBar",
			"./profile/wearable/widget/wearable/Listview",
			"./profile/wearable/widget/wearable/IndexScrollbar",
			"./profile/wearable/widget/wearable/CircularIndexScrollbar",
			"./profile/wearable/widget/wearable/Progress",
			"./profile/wearable/widget/wearable/Progressing",
			"./profile/wearable/widget/wearable/ToggleSwitch",
			"./profile/wearable/widget/wearable/VirtualListview",
			"./profile/wearable/widget/wearable/SectionChanger",
			"./profile/wearable/widget/wearable/VirtualGrid",
			"./profile/wearable/widget/wearable/SnapListview",
			"./profile/wearable/widget/wearable/SwipeList",
			"./profile/wearable/widget/wearable/scroller/Scroller",
			"./profile/wearable/widget/wearable/scroller/scrollbar/ScrollBar",
			"./profile/wearable/widget/wearable/PageIndicator",
			"./profile/wearable/helper/SnapListStyle",
			"./profile/wearable/helper/SnapListMarqueeStyle",
			"./profile/wearable/helper/ExpandableHeaderMarqueeStyle",
			"./profile/wearable/helper/DrawerMoreStyle",
			"./core/router/Router",
			"./core/router/history",
			"./core/router/route/page",
			"./core/router/route/popup",
			"./profile/wearable/router/route/circularindexscrollbar",
			"./profile/wearable/router/route/drawer",
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
