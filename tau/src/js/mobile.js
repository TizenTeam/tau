/*global define, ns */
/**
 * #Tizen Advanced UI Framework
 *
 * Tizen Advanced UI Framework(TAU) is new name of Tizen Web UI framework. It provides tools, such as widgets, events, effects, and animations, for Web application development. You can leverage these tools by just selecting the required screen elements and creating applications.
 *
 * TAU service is based on a template and works on a Web browser, which runs on the WebKit engine. You can code Web applications using the TAU, standard HTML5, and Tizen device APIs. You can also use different widgets with CSS animations and rendering optimized for Tizen Web browsers.
 *
 * For more information about the basic structure of a page in the Web application using the TAU, see [Application Page Structure](page/app_page_layout.htm).
 *
 * ##Framework Services
 *
 * The Web UI framework consists of the following services:
 *
 *  - Page navigation
 *
 *    Navigation JavaScript library is provided to allow smooth navigation between TAU based application [pages](page/layout.htm).
 *  - Web widgets and themes
 *
 *    We support APIs and CSS themes for Tizen web [widgets](widget/widget_reference.htm)
 *  - Element Events
 *
 *    Some special [events](event/event_reference.htm) are available with TAU that optimized for the Web applications.
 *  - Useful utility
 *
 *    Some special [utility](util/util_reference.htm) are available with TAU that supporting easy DOM methods for the Web applications.
 *
 * !!!The framework runs only on browsers supporting the HTML5/CSS standards. The draft version of the W3C specification is not fully supported.!!!
 * @class ns
 * @title Tizen Advanced UI Framework
 */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function (ns) {
	"use strict";
	define(
		[
			"require",
			//>>excludeStart("tauPerformance", pragmas.tauPerformance);
			"./tools/performance",
			//>>excludeEnd("tauPerformance")
			"./core/core",
			"./core/config",
			"./profile/mobile/config",
			"./core/support",
			"./core/info",
			"./jqm/all",
			"./core/engine",
			"./core/frameworkData",
			"./core/theme",
			"./core/theme/ThemeCommon",
			"./core/util/anchorHighlight",
			"./core/util/grid",
			"./core/util/data",
			"./core/util/array",
			"./core/util/DOM",
			"./core/util/selectors",
			"./core/util/object",
			"./core/util/date",
			"./core/util/callbacks",
			"./core/util/deferred",
			"./core/util/deferredWhen",
			"./core/util/path",
			"./core/util/bezierCurve",
			"./core/util/zoom",
			"./core/util/anim",
			"./core/util/anim/Keyframes.js",
			"./core/util/anim/Animation.js",
			"./core/util/anim/Chain.js",
			"./core/event/vmouse",
			"./core/event/hwkey",
			"./core/event/throttledresize",
			"./core/event/orientationchange",
			"./core/widget/customElements",
			// widget list
			"./core/widget/core/Checkbox",
			"./core/widget/core/Radio",
			"./core/widget/core/SectionChanger",
			"./core/widget/core/Button",
			"./core/widget/core/Listview",
			"./core/widget/core/PanelChanger",
			"./core/widget/core/SectionChanger",
			"./core/widget/core/PageIndicator",
			"./core/widget/core/Slider",
			"./core/widget/core/SearchInput",
			"./core/widget/core/progress/Progress",
			"./profile/mobile/widget/mobile/Page",
			"./profile/mobile/widget/mobile/PageContainer",
			"./profile/mobile/widget/mobile/Popup",
			"./profile/mobile/widget/mobile/Scrollview",
			"./profile/mobile/widget/mobile/Expandable",
			"./profile/mobile/widget/mobile/Listview",
			"./core/widget/core/tab/Tabbar",
			"./profile/mobile/widget/mobile/TextInput",
			"./profile/mobile/widget/mobile/DropdownMenu",
			"./profile/mobile/widget/mobile/TextEnveloper",
			"./profile/mobile/widget/mobile/VirtualListview",
			"./profile/mobile/widget/mobile/VirtualGrid",
			"./profile/mobile/widget/mobile/Loader",
			"./profile/mobile/widget/mobile/Drawer",
			"./profile/mobile/widget/mobile/ToggleSwitch",
			"./profile/mobile/widget/mobile/Navigation",
			"./profile/mobile/widget/mobile/IndexScrollbar",
			"./profile/mobile/widget/mobile/FloatingActions",
			"./profile/mobile/widget/mobile/Button",
			"./core/widget/core/Tabs",
			"./profile/mobile/widget/mobile/ColoredListview",
			"./profile/mobile/widget/mobile/GridView",
			"./profile/mobile/expose",
			// default theme
			"../css/profile/mobile/changeable/theme-changeable/theme",
			// router modules
			"./core/router/Router",
			"./core/router/route/page",
			"./core/router/route/popup",
			"./core/router/route/drawer",
			"./core/router/route/panel",
			"./core/router/history",
			"./profile/wearable/expose",
			"./core/widget/core/Box",
			"./core/layout/float",
			"./core/layout/linear",
			"./core/layout/relative",
			// Modules to be loaded after
			"./core/init",
			//documentation pages
			"./profile/mobile/page/layout",
			"./profile/mobile/page/multipage",
			"./profile/mobile/page/change",
			"./profile/mobile/page/pageevents",
			// globalize
			"./core/util/globalize"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.info.profile = "mobile";
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
}(ns));
//>>excludeEnd("tauBuildExclude");
