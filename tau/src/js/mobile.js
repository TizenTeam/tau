/*global define */
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
(function () {
	"use strict";
	define(
		[
			"require",
			"./core/core",
			"./core/config",
			"./profile/mobile/config",
			"./core/support",
			"./jqm/all",
			"./core/engine",
			"./core/frameworkData",
			"./core/theme",
			"./core/theme/ThemeCommon",
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
			"./core/event/touch",
			// widget list
			"./profile/mobile/widget/mobile/Page",
			"./profile/mobile/widget/mobile/Scrollview",
			"./profile/mobile/widget/mobile/Circularview",
			"./profile/mobile/widget/mobile/Collapsibleset",
			"./profile/mobile/widget/mobile/Collapsible",
			"./profile/mobile/widget/mobile/Button",
			"./profile/mobile/widget/mobile/Dialog",
			"./profile/mobile/widget/mobile/Checkboxradio",
			"./profile/mobile/widget/mobile/Listview",
			"./profile/mobile/widget/mobile/Listdivider",
			"./profile/mobile/widget/mobile/ListviewAutodivider",
			"./profile/mobile/widget/mobile/ListviewFilter",
			"./profile/mobile/widget/mobile/ExtendableList",
			"./profile/mobile/widget/mobile/Fastscroll",
			"./profile/mobile/widget/mobile/TabBar",
			"./profile/mobile/widget/mobile/Fieldcontain",
			"./profile/mobile/widget/mobile/Controlgroup",
			"./profile/mobile/widget/mobile/Textinput",
			"./profile/mobile/widget/mobile/Popup",
			"./profile/mobile/widget/mobile/Datetimepicker",
			"./profile/mobile/widget/mobile/Slider",
			"./profile/mobile/widget/mobile/Swipe",
			"./profile/mobile/widget/mobile/SelectMenu",
			"./profile/mobile/widget/mobile/SearchBar",
			"./profile/mobile/widget/mobile/Progress",
			"./profile/mobile/widget/mobile/Navbar",
			"./profile/mobile/widget/mobile/MultimediaView",
			"./profile/mobile/widget/mobile/Progressbar",
			"./profile/mobile/widget/mobile/Tokentextarea",
			"./profile/mobile/widget/mobile/Notification",
			"./profile/mobile/widget/mobile/Gallery",
			"./profile/mobile/widget/mobile/VirtualListview",
			"./profile/mobile/widget/mobile/VirtualGrid",
			"./profile/mobile/widget/mobile/Loader",
			"./profile/mobile/widget/mobile/TizenSlider",
			"./profile/mobile/widget/mobile/SplitView",
			"./profile/mobile/widget/mobile/ScrollHandler",
			"./profile/mobile/widget/mobile/Drawer",
			"./profile/mobile/widget/mobile/ToggleSwitch",
			"./profile/mobile/widget/mobile/Navigation",
			"./profile/mobile/expose",
			// default theme
			"../css/profile/mobile/changeable/theme-changeable/theme",
			// Modules to be loaded after
			"./core/init",
			//documentation pages
			"./profile/mobile/page/layout",
			"./profile/mobile/page/multipage",
			"./profile/mobile/page/change",
			"./profile/mobile/page/pageevents"
		],
		function () {
			return;
		}
	);
}());
//>>excludeEnd("tauBuildExclude");
