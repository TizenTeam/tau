/* global define, equal, ok, start, asyncTest, test */
define(
	["../compare-helper"],
	function (compareHelper) {
		compareHelper.compare({
			path: "/base/demos/SDK/wearable",
			appName: "UIComponents",
			indexFile: "index.html",
			width: 360,
			height: 480
		});
	});