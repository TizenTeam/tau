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
			"./ej/widget/micro/Page",
			"./ej/widget/micro/Popup",
			"./ej/widget/micro/PageContainer",
			"./ej/widget/micro/indexscrollbar/IndexScrollbar",
			"./ej/widget/micro/VirtualListview",
			"./ej/widget/micro/SectionChanger",
			"./ej/widget/micro/VirtualGrid",
			"./ej/widget/micro/scroller/Scroller",
			"./ej/widget/micro/scroller/scrollbar/Scrollbar",
			"./ej/router/micro/Router",
			"./ej/router/micro/route/page",
			"./ej/router/micro/route/popup",
			"./ej/router/micro/history"
		],
		function (require) {
			require(["./ej/init"], function () {
				return true;
			});
		}
	);
}());
//>>excludeEnd("ejBuildExclude");
