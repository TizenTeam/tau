/*global define */
//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
(function () {
	"use strict";
	define(
		[
			"require",
			"./core",
			"./config",
			"./gear/ui/all",
			"./engine",
			// widget list
			"./widget/micro/Page",
			"./widget/micro/Popup",
			"./widget/micro/PageContainer",
			"./widget/micro/IndexScrollbar",
			"./router/micro/Router",
			"./router/micro/route/page",
			"./router/micro/route/popup",
			"./router/micro/history"
		],
		function (require) {
			require(["./init"], function () {
				return true;
			});
		}
	);
}());
//>>excludeEnd("ejBuildExclude");
