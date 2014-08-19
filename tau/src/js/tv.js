/*global define */
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
			"./profile/wearable/selectors",
			"./core/engine",
			// widget list
			"./core/util/anchorHighlight",
			"./profile/tv/widget/Button",
			"./profile/tv/widget/Listview",
			"./profile/tv/widget/Page",
			"./profile/tv/widget/Popup",
			"./profile/wearable/widget/wearable/VirtualGrid",
			"./profile/tv/widget/PageContainer",
			"./profile/tv/widget/Drawer",
			"./profile/wearable/router/Router",
			"./profile/wearable/router/route/page",
			"./profile/tv/router/route/popup",
			"./profile/tv/router/route/dynamic",
			"./profile/wearable/router/history",
			"./profile/wearable/expose",
			// Modules to be loaded after
			"./core/init"
		],
		function ( ) {
			return;
		}
	);
}());
//>>excludeEnd("tauBuildExclude");
