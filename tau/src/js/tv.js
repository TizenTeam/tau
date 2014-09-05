/*global define */
/**
 * #Tizen Advanced UI Framework
 *
 * Tizen Advanced UI Framework (TAU) is new name of Tizen Web UI framework.
 * It provides tools, such as widgets, events, effects, and animations for Web
 * application development. You can leverage these tools by just selecting the
 * required screen elements and creating applications.
 *
 * TAU service is based on a template and works on a Web browser, which runs on
 * the WebKit engine. You can code Web applications using the TAU, standard
 * HTML5, and Tizen device APIs. You can also use different widgets with CSS
 * animations and rendering optimized for Tizen Web browsers.
 *
 * For more information about the basic structure of a page in the Web
 * application using the TAU, see
 * [Application Page Structure](page/app_page_layout.htm).
 *
 * ##Framework Services
 *
 * The Web UI framework consists of the following services:
 *
 *  - Page navigation
 *
 *    Navigation JavaScript library is provided to allow smooth navigation
 *    between TAU based application [pages](page/layout.htm).
 *  - Web widgets and themes
 *
 *    We support APIs and CSS themes for Tizen web [widgets](widget/widget_reference.htm)
 *  - Element Events
 *
 *    Some special [events](event/event_reference.htm) are available with TAU
 *    that optimized for the Web applications.
 *  - Useful utility
 *
 *    Some special [utility](util/util_reference.htm) are available with TAU
 *    that supporting easy DOM methods for the Web applications.
 *
 * ##Design TV applications
 * If you want create user friendly TV application you should read this part of
 * the guide:
 *
 *  - [introduction](page/designIntroduction.htm)
 *  - [page](page/designPage.htm)
 *  - [navigation](page/designNavigation.htm)
 *  - [elements](page/designElements.htm)
 *
 * If you used mobile or wearable TAU please read about differences between
 * profiles:
 *
 *  - [introduction](page/differencesIntroduction.htm)
 *
 * !!!The framework runs only on browsers supporting the HTML5/CSS standards.
 * The draft version of the W3C specification is not fully supported.!!!
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
			"./profile/tv/config",
			"./profile/wearable/defaults",
			"./core/engine",
			// widget list
			"./core/util/anchorHighlight",
			"./profile/tv/widget/Button",
			"./profile/tv/widget/Listview",
			"./profile/tv/widget/Page",
			"./profile/tv/widget/Popup",
			"./profile/tv/widget/Slider",
			"./profile/wearable/widget/wearable/VirtualGrid",
			"./profile/tv/widget/PageContainer",
			"./profile/tv/widget/Drawer",
			"./profile/wearable/router/Router",
			"./profile/wearable/router/route/page",
			"./profile/wearable/router/route/popup",
			"./profile/tv/router/route/dynamic",
			"./profile/wearable/router/history",
			"./profile/wearable/expose",
			"./profile/tv/widget/TextInput",
			"./profile/tv/widget/Listdivider",
			"./profile/tv/widget/Checkboxradio",
			"./profile/tv/widget/Progress",
			"./profile/mobile/widget/mobile/TabBar",
			"./profile/tv/widget/ControlGroup",
			// Modules to be loaded after
			"./core/init",
			//documentation pages
			"./profile/mobile/page/layout",
			"./profile/mobile/page/multipage",
			"./profile/mobile/page/change",
			"./profile/mobile/page/pageevents",
			// tv design
			"./profile/tv/page/design/introduction",
			"./profile/tv/page/design/page",
			"./profile/tv/page/design/elements",
			"./profile/tv/page/design/navigation",
			// tv differences
			"./profile/tv/page/differences/introduction"
		],
		function ( ) {
			return;
		}
	);
}());
//>>excludeEnd("tauBuildExclude");
