/*global define, ns */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function (ns) {
	"use strict";
	define(
		[
			"require",
			//>>excludeStart("tauPerformance", pragmas.tauPerformance);
			"./tools/performance",
			//>>excludeEnd("tauPerformance");
			"./core/core",
			"./profile/wearable/config",
			"./core/config",
			"./core/support/tizen",
			"./core/info",
			"./core/engine",
			// widget list
			"./core/util/anchorHighlight",
			"./core/util/scrolling",
			"./core/util/polar",
			"./core/util/rotaryScrolling",
			"./core/util/date",
			"./core/widget/core/PageContainer",
			"./core/widget/core/Button",
			"./core/widget/core/Checkbox",
			"./core/widget/core/Radio",
			"./core/widget/core/Marquee",
			"./core/widget/core/viewswitcher/ViewSwitcher",
			"./core/widget/core/PageIndicator",
			"./core/widget/core/scroller/Scroller",
			"./core/widget/core/scroller/scrollbar/ScrollBar",
			"./core/widget/core/SectionChanger",
			"./profile/wearable/widget/wearable/Page",
			"./profile/wearable/widget/wearable/Popup",
			"./profile/wearable/widget/wearable/Drawer",
			"./profile/wearable/widget/wearable/Slider",
			"./profile/wearable/widget/wearable/CircleProgressBar",
			"./profile/wearable/widget/wearable/Listview",
			"./profile/wearable/widget/wearable/IndexScrollbar",
			"./profile/wearable/widget/wearable/CircularIndexScrollbar",
			"./profile/wearable/widget/wearable/Progress",
			"./profile/wearable/widget/wearable/Progressing",
			"./profile/wearable/widget/wearable/ToggleSwitch",
			"./profile/wearable/widget/wearable/VirtualListview",
			"./profile/wearable/widget/wearable/VirtualGrid",
			"./core/widget/core/VirtualListviewSimple",
			"./profile/wearable/widget/wearable/SnapListview",
			"./profile/wearable/widget/wearable/SwipeList",
			"./profile/wearable/widget/wearable/Selector",
			"./profile/wearable/widget/wearable/Grid",
			"./profile/wearable/widget/wearable/CircleIndicator",
			"./profile/wearable/helper/SnapListStyle",
			"./profile/wearable/helper/SnapListMarqueeStyle",
			"./profile/wearable/helper/DrawerMoreStyle",
			"./profile/wearable/helper/RotaryEventBinder",
			"./profile/wearable/widget/wearable/ArcListview",
			"./core/router/Router",
			"./core/router/history",
			"./core/router/route/page",
			"./core/router/route/popup",
			"./core/router/route/drawer",
			"./profile/wearable/router/route/circularindexscrollbar",
			"./profile/wearable/router/route/grid",
			"./profile/wearable/expose",
			"./profile/wearable/backward",
			// events
			"./core/event/scrolledtoedge",
			"./core/event/gesture/Manager",
			"./core/event/gesture/Instance",
			"./core/event/gesture/Drag",
			"./core/event/gesture/Swipe",
			"./core/event/gesture/Pinch",
			"./core/event/gesture/LongPress",
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
