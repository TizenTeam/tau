/* global define, equal, ok, start, asyncTest, test */
define(
	["../compare-helper"],
	function (compareHelper) {
		// square
		compareHelper.compare({
			path: "/base/demos/SDK/wearable",
			appName: "UIComponents",
			indexFile: "index.html",
			width: 360,
			height: 480
		});
		// circular
		compareHelper.compare({
			path: "/base/demos/SDK/wearable/circular",
			appName: "CircularUIComponents",
			indexFile: "index.html",
			width: 360,
			height: 360
		});
	});